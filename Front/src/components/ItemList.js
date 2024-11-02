import React from 'react';
import '../pages/Store.css';

const ItemList = ({ items }) => {
  return (
    <div className="item-sale">
      {items.map((item, index) => (
        <div className="aa" key={index}>
          <img src={item.image} alt={item.text} className="item-image" />
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
