import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Store.css';
import Store1 from '../image/Store1.jpg';
import Store2 from '../image/Store2.jpg';
import Store3 from '../image/Store3.jpg';

const Store = () => {
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

  return (
    <div className="store-container">
      <div className="store-header">
        <h2>상점</h2>
        <div className="store-search">
          <input type="text" placeholder="검색어를 입력하세요..." />
          <button>검색</button>
        </div>
        <div className="store-points">보유 포인트: 100</div>
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
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
        <div className="aa">
          {}
        </div>
      </div>
    </div>
  );
}

export default Store;
