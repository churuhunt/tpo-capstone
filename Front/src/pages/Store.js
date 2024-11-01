import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Store.css';
import Store1 from '../image/Store1.jpg';
import Store2 from '../image/Store2.jpg';
import Store3 from '../image/Store3.jpg';
import api from '../axios'
import profileImage from '../image/profile.png';


const Store = () => {

  const [points, setPoints] = useState(0);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // 아이템을 저장할 상태
  const [ownedItems, setOwnedItems] = useState([]); // 사용자가 소유한 아이템 목록
  const [userId, setUserId] = useState(null); // 사용자 ID 상태

  /*// 사용자 ID를 가져오는 API 호출
  const fetchUserId = async () => {
    try {
      const response = await api.get('/users/me'); // 사용자 ID를 반환하는 API 호출
      setUserId(response.data.id); // 사용자 ID 설정
    } catch (error) {
      console.error('사용자 ID를 가져오는 중 오류 발생:', error);
    }
  };
*/
  // 사용자 ID를 가져오는 API 호출
  const fetchUserId = async () => {
    try {
      const response = await api.get('/users/me'); // 사용자 정보 조회 API 호출
      if (response.status === 200) {
        setUserId(response.data.userId); // API에서 userId 필드를 받았다고 가정
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('사용자 ID를 가져오는 중 오류 발생:', error.response?.data || error.message);
    }
  };

  // 컴포넌트가 마운트될 때 사용자 포인트를 가져오는 함수
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await api.get('/user/points'); // API 호출
        console.log("API Full Response:", response); // 전체 응답 확인
        console.log("Fetched Points:", response.data?.points); // points 값 확인

        // 데이터가 단일 값으로 반환될 경우 그대로 설정
        setPoints(Number(response.data));

      } catch (error) {
        console.error('Error fetching points:', error);
        setError('포인트를 가져오는 데 실패했습니다. 나중에 다시 시도해주세요.');
      }
    };

    const fetchItems = async () => {
      try {
        const response = await api.get('/items'); // 아이템 목록 가져오기
        setItems(response.data);
      } catch (error) {
        console.error('아이템 조회 중 오류 발생:', error);
      }
    };

    fetchUserId(); // 사용자 ID 가져오기
    fetchPoints();
    fetchItems();
  }, []);



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
        <ul style={{ marginBottom: '15px' }}> {}
          {dots}
        </ul>
    ),

  };

  const purchaseItem = async (itemId) => {
    if (!userId) {
      alert('로그인 후 구매할 수 있습니다.');
      return;
    }

    try {
      const response = await api.post(`/users/${userId}/purchase/${itemId}`);
      alert(response.data);
      // 구매 후 포인트를 다시 조회하여 업데이트
      const pointsResponse = await api.get(`/user/points`);
      setPoints(pointsResponse.data);
    } catch (error) {
      console.error('구매 중 오류 발생:', error);
      alert('구매 중 오류가 발생했습니다: ' + error.response.data);
    }
  };

  const handlePurchase = (item) => {
    purchaseItem(item.id); // purchaseItem 호출
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h2>🏪상점</h2>
        <div className="store-search">
          <input type="text" placeholder="검색어를 입력하세요..."/>
          <button>검색</button>
        </div>
        <div className="store-points">보유 포인트:{points}</div>
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
      </Slider>
      <div className="menu-tabs">
        <button className="active">프로필</button>
        <button>테두리</button>
        <button>배경</button>
        <button>폰트</button>
        <button>이모티콘</button>
        <button>이펙트</button>
        <button>기타</button>
      </div>
      <div className="item-sale">
        {items.map(item => (
            <div className="aa" key={item.id}>
              <img src={item.image} alt={item.name} style={{width: '100%', height: '70%'}}/>
              <div>{item.name}</div>
              <div>가격: {item.price} point</div>
              <button onClick={() => handlePurchase(item)}>구매</button>
            </div>
        ))}

      </div>
    </div>
  );
}

export default Store;
