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

  // 사용자 포인트와 활성화된 탭의 아이템 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 소지 포인트 가져오기
        const userResponse = await api.get('/user/points');
        setPoints(userResponse.data.points);

        const itemsResponse = await api.get('/items');
        console.log('Fetched items:', itemsResponse.data);  // 데이터 확인용
        setItems(itemsResponse.data);

      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 선택된 탭에 맞는 아이템만 필터링
  const filteredItems = items.filter(item => item.category === tabItems[activeTab]);


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
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="itemlist-container">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="store-item">
                  <img
                    src={item.image || "기본 이미지 URL"}
                    alt={item.name || "이미지"}
                    className="store-item-image"
                    onError={(e) => {
                      console.error(`이미지 로드 오류: ${item.image}`);
                      e.target.src = "기본 이미지 URL";
                    }}
                  />
                  <div className="store-item-info">
                    <p>{item.name}</p>
                    <p>💰 {item.price} 포인트</p>
                  </div>
                </div>
              ))
            ) : (
                <div className="store-item-empty">
                  <img src="기본 이미지 URL" alt="준비 중" />
                  <p>해당 카테고리에 상품이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Store;
