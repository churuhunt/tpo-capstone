import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Store.css';
import Store1 from '../image/Store1.jpg';
import Store2 from '../image/Store2.jpg';
import Store3 from '../image/Store3.jpg';
import Store4 from '../image/Store4.jpg';
import Store5 from '../image/Store5.jpg';
import api from '../axios'
import profileImage from '../image/profile.png';

import PageSubMenu from '../components/PageSubMenu';
import Banner from '../components/Banner';
import ItemList from '../components/ItemList';
import banner1 from '../image/storebanner.jpg';


const Store = () => {
  const [points, setPoints] = useState(0);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // 아이템을 저장할 상태
  const [ownedItems, setOwnedItems] = useState([]); // 사용자가 소유한 아이템 목록
  const [userId, setUserId] = useState(null); // 사용자 ID 상태
  const [isAscending, setIsAscending] = useState(true); // 가격 오름차순 정렬 상태
  const [showUnownedOnly, setShowUnownedOnly] = useState(false); // 구매하지 않은 아이템만 보기 상태


    useEffect(() => {
        // 사용자 정보와 포인트를 가져옴
        const fetchUserInfo = async () => {
            try {
                const userResponse = await api.get('/user/points'); // 사용자 정보를 가져오는 API 호출
                console.log("User Info:", userResponse.data); // 데이터를 출력하여 확인
                setUserId(userResponse.data.id);
                setPoints(userResponse.data.points);

                await fetchPurchaseHistory(userResponse.data.id);
            } catch (error) {
                console.error("Error fetching user info:", error); // 오류 발생 시 콘솔에 출력
                setError("사용자 정보를 불러올 수 없습니다.");
            }
        };

        // 상점 아이템 목록을 불러옴
        const fetchItems = async () => {
            try {
                const itemResponse = await api.get('/shop/items');
                console.log("Items:", itemResponse.data); // 아이템 목록 출력
                setItems(itemResponse.data);
            } catch (error) {
                setError("아이템 목록을 불러올 수 없습니다.");
            }
        };

        // 사용자의 구매 내역을 불러옴
        const fetchPurchaseHistory = async () => {
            if (!userId) return;
            try {
                const historyResponse = await api.get(`/shop/purchase-history/${userId}`);
                setOwnedItems(historyResponse.data.map((purchase) => purchase.item.id));
            } catch (error) {
                setError("구매 내역을 불러올 수 없습니다.");
            }
        };

        fetchUserInfo();
        fetchItems();
    }, [userId]);


    // 가격순 정렬을 전환하는 함수
    const togglePriceSort = async () => {
        try {
            const response = isAscending
                ? await api.get('/shop/items/price-asc')
                : await api.get('/shop/items/price-desc');
            setItems(response.data);
            setIsAscending(!isAscending); // 정렬 상태 토글
        } catch (error) {
            setError("아이템을 정렬하는 데 실패했습니다.");
        }
    };

    // 구매하지 않은 아이템만 보이기 기능
    const toggleUnownedFilter = () => {
        setShowUnownedOnly(!showUnownedOnly);
    };

    // 아이템 구매 처리 함수
    const handlePurchase = async (item) => {
        if (points < item.price) {
            alert("포인트가 부족하여 구매할 수 없습니다.");
            return;
        }
        try {
            const purchaseResponse = await api.post('/shop/purchase', null, {
                params: { userId: userId, itemId: item.id }
            });
            setPoints((prevPoints) => prevPoints - item.price);  // 포인트 차감
            setOwnedItems((prevOwnedItems) => [...prevOwnedItems, item.id]);  // 구매한 아이템 추가
            alert(purchaseResponse.data);
        } catch (error) {
            setError(error.response ? error.response.data : "구매 실패");
        }
    };



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

    // 구매하지 않은 아이템만 필터링
    const displayedItems = showUnownedOnly
        ? items.filter(item => !ownedItems.includes(item.id))
        : items;


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
                    <img src={Store1} alt="Store1"/>
                </div>
                <div>
                    <img src={Store2} alt="Store2"/>
                </div>
                <div>
                    <img src={Store3} alt="Store3"/>
                </div>
                <div>
                    <img src={Store4} alt="Store4"/>
                </div>
                <div>
                    <img src={Store5} alt="Store5"/>
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

            <div className="store-filters">
                <button onClick={togglePriceSort}>
                    {isAscending ? "가격순 내림차순" : "가격순 오름차순"}
                </button>
                <button onClick={toggleUnownedFilter}>
                    {showUnownedOnly ? "모든 아이템 보기" : "구매하지 않은 아이템만 보기"}
                </button>
            </div>

            <div className="item-sale">
                {items.map(item => (
                    <div className="aa" key={item.id}>
                        <img src={item.image} alt={item.name} style={{width: '100%', height: '70%'}}/>
                        <div>{item.name}</div>
                        <div>가격: {item.price} point</div>
                        <button
                            onClick={() => handlePurchase(item)}
                            disabled={ownedItems.includes(item.id)}
                        >
                            {ownedItems.includes(item.id) ? "구매 완료" : "구매"}
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Store;
