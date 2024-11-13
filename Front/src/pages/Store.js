import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './Store.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Store1 from '../image/Store1.jpg';
import Store2 from '../image/Store2.jpg';
import Store3 from '../image/Store3.jpg';
import Store4 from '../image/Store4.jpg';
import Store5 from '../image/Store5.jpg';
import notyetproduct from '../image/notyetproduct.png';
import LoadingModal from '../components/LoadingModal';

import api from '../axios'; // axios 인스턴스를 가져옵니다
import PageSubMenu from '../components/PageSubMenu';
import Banner from '../components/Banner';
import ItemList from '../components/ItemList';
import banner1 from '../image/storebanner.jpg';

const Store = () => {
  const menuItems = ["　"];
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("프로필");
  const [points, setPoints] = useState(0); // 소지 포인트 상태
  const [items, setItems] = useState([]); // 현재 탭의 아이템 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 정의
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 항목 수
  const [storeModalItem, setStoreModalItem] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dotsClass: 'slick-dots',
    appendDots: (dots) => (
      <ul style={{ marginBottom: '15px' }}> {dots} </ul>
    ),
  };

  // 탭에 맞는 API 카테고리 설정
  const tabItems = {
    "프로필": "profile",
    "테두리": "border",
    "배경": "background",
    "폰트": "font",
    "이모티콘": "emoticon",
    "이펙트": "effect",
    "기타": "etc",
  };

    const openStoreModal = (item) => {
      setStoreModalItem(item);
    };

    // 모달 닫기 함수
    const closeStoreModal = () => {
      setStoreModalItem(null);
    };


  const handlePurchase = async (item) => {
    if (points < item.price) {
      alert("포인트가 부족합니다.");
      closeStoreModal();
      return;
    }

    setLoading(true);

    try {
      await api.post(`/shop/purchase?itemId=${item.id}`); // URL 파라미터로 itemId 전달
      setPoints(points - item.price);  // 포인트 차감
      alert("구매하였습니다.");
      closeStoreModal();  // 성공 시 모달 닫기
    } catch (error) {
      console.error("구매 실패:", error.response ? error.response.data : error);
      alert(error.response?.data?.message || "구매에 실패했습니다."); // 서버 메시지 출력
      closeStoreModal();  // 실패 시에도 모달 닫기
    } finally {
      setLoading(false);
    }
  };

  // 사용자 포인트와 활성화된 탭의 아이템 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 소지 포인트 가져오기
        const userResponse = await api.get('/users/current');
        setPoints(userResponse.data.points);
        const userData = userResponse.data;

        const itemsResponse = await api.get('/items');
        console.log('Fetched items:', itemsResponse.data);  // 데이터 확인용
        setItems(itemsResponse.data);

      } catch (error) {
         console.error("구매 실패:", error.response ? error.response.data : error);
         alert("구매에 실패했습니다.");
      }
         finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = items.filter(item => item.category.toLowerCase() === tabItems[activeTab]);
  const totalItems = filteredItems.length;
  const fixedItems = [...filteredItems];

  while (fixedItems.length < 10) {
    fixedItems.push({ id: `empty-${fixedItems.length}`, name: '', price: 0, imageUrl: '' });
  }

  // 페이지네이션에 따른 현재 페이지 아이템 가져오기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const filledItems = [
      ...currentItems,
      ...Array(itemsPerPage - currentItems.length).fill({ isPlaceholder: true })
    ];

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="store-container">
       {loading ? ( <LoadingModal />) : ( <>

      <Banner src={banner1} title="🏪상점" />
      <div className="post-form-container">
        <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>
      <div className="store-container2">
        <div className="store-header">
          <div className="store-points">💰 {points}</div>
        </div>
        <Slider {...settings} className="image-slider">
          <div>
            <img src={Store1} alt="Store1" />
          </div>
          <div>
            <img src={Store2} alt="Store2" />
          </div>
          <div>
            <img src={Store3} alt="Store3" />
          </div>
          <div>
            <img src={Store4} alt="Store4" />
          </div>
          <div>
            <img src={Store5} alt="Store5" />
          </div>
        </Slider>
            <div className="menu-tabs">
              {Object.keys(tabItems).map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1); // 탭 변경 시 페이지를 첫 번째로 리셋
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
<div className="itemlist-container">
  {filledItems.map((item, index) =>
    item.isPlaceholder ? (
      <div key={`empty-${index}`} className="store-item store-item-empty">
        <img src={notyetproduct} alt="상품 준비 중" />
        <p>상품 준비 중입니다.</p>
        <p>💰 0 포인트</p>
      </div>
    ) : (
      <div
        key={item.id}
        className="store-item"
        onClick={() => openStoreModal(item)}
      >
        <img
          src={item.imageUrl || "path/to/default-image.jpg"}
          alt={item.name || "이미지"}
          className="store-item-image"
          onError={(e) => {
            console.error(`이미지 로드 오류: ${item.image}`);
            e.target.src = "path/to/default-image.jpg";
          }}
        />
        <div className="store-item-info">
          <p>{item.name}</p>
          <p>💰 {item.price} 포인트</p>
        </div>
      </div>
    )
  )}
</div>

            {/* 페이지네이션 */}
            {totalItems > itemsPerPage && (
              <div className="pagination">
                {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
{storeModalItem && (
  <div className="store-modal">
    <div className="store-modal-content">
      <span className="store-modal-close" onClick={closeStoreModal}>&times;</span>
      <img
        src={storeModalItem.imageUrl || "path/to/default-image.jpg"}
        alt={storeModalItem.name}
        className="store-modal-image"
      />
      <h3>{storeModalItem.name}</h3>
      <p>{storeModalItem.description}</p>
      <p className="store-modal-price">💰 {storeModalItem.price} 포인트</p>
      <div className="store-modal-buttons">
            <button className="store-modal-buy-button" onClick={() => handlePurchase(storeModalItem)}>구매</button>
            <button className="store-modal-close-button" onClick={closeStoreModal}>취소</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};


export default Store;
