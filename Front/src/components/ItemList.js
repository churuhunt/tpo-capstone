import React, { useState } from 'react';
import '../pages/Store.css';
import notyetproduct from '../image/notyetproduct.png';

const StoreItemList = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const defaultImage = notyetproduct;

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="store-item-sale">
      {items.map((item, index) => (
        <div className="store-aa" key={index} onClick={() => handleItemClick(item)}>
          <img src={item.image || defaultImage} alt={item.name} className="store-item-image" />
          <p className="store-item-price">{'💰'+item.price || '0원'}</p>
        </div>
      ))}
      {items.length < 12 && Array.from({ length: 12 - items.length }).map((_, index) => (
        <div className="store-aa" key={`empty-${index}`}>
          <img src={defaultImage} alt="빈 아이템" className="store-item-image" />
          <p className="store-item-price">💰0</p>
        </div>
      ))}

{selectedItem && (
  <div className="store-item-modal" onClick={closeModal}>
    <div className="store-item-modal-content" onClick={(e) => e.stopPropagation()}>
      <img src={selectedItem.image || defaultImage} alt={selectedItem.name || "상품명 없음"} className="store-item-modal-image" />
      <h3>{selectedItem.name || '상품명 없음'}</h3>
      <p className="modal-price">{'💰'+selectedItem.price || '0'}</p>
      <div className="store-item-modal-buttons">
        <button className="store-item-modal-buy-button">구매</button>
        <button className="store-item-modal-close-button" onClick={closeModal}>닫기</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default StoreItemList;
