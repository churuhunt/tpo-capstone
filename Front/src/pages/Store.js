import React, { useState } from 'react';
import Slider from 'react-slick';
import './Store.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Store1 from '../image/Store1.jpg';
import Store2 from '../image/Store2.jpg';
import Store3 from '../image/Store3.jpg';
import Store4 from '../image/Store4.jpg';
import Store5 from '../image/Store5.jpg';

import PageSubMenu from '../components/PageSubMenu';
import Banner from '../components/Banner';
import ItemList from '../components/ItemList';
import banner1 from '../image/storebanner.jpg';

const Store = () => {
  const menuItems = ["　"];
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("프로필");

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

  const tabItems = {
    "프로필": [
      { text: "프로필 아이템1", image: "https://media.tenor.com/m-5kVE1gidsAAAAj/homer-simpson-bush-transparent.gif" },
      { text: "프로필 아이템2", image: "https://media.fmkorea.com/files/attach/new/20200728/2978469841/2984528844/3010242160/1021e5f1017ff36b298d393574c9ce1c.gif" },
      { text: "프로필 아이템3", image: "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfODEg/MDAxNjA2OTYwMTMwMDIz.CH0wwi3vq1NRbCMo4vSD2DxwqUjWhLAfGK3vs_HYAVMg.ew3TvMIDK86UJADD7363U3K2eQwi4TOwoG__QRwLgCUg.GIF.bidsh/01.gif?type=w800" },
      { text: "프로필 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "프로필 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
    ],
    "테두리": [
      { text: "테두리 아이템1", image: "https://png.pngtree.com/png-clipart/20220706/ourmid/pngtree-elegant-simple-black-lace-border-icon-png-yuri-png-image_5709541.png" },
      { text: "테두리 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "테두리 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      
    ],
    "배경": [
      { text: "배경 아이템1", image: "https://i.namu.wiki/i/w11dbZZeomJI4bD3_KItw3vq7tgglcM1YQA_xHULxMsixPpY1S7KcB8WrEFhJNuSuejiiQkicGKMH12JvpUqBQ.webp" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
    ],
    "폰트": [
      { text: "폰트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "폰트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
    ],
    "이모티콘": [
      { text: "이모티콘 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이모티콘 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
    ],
    "이펙트": [
      { text: "이펙트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "이펙트 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
    ],
    "기타": [
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템1", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템2", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
      { text: "배경 아이템3", image: "https://cdn-icons-png.flaticon.com/512/159/159833.png" },
    ],
    // 나머지 탭들도 유사한 방식으로 추가
  };

  return (
    <div className="store-container">
      <Banner src={banner1} title="🏪상점" />
      <div className="post-form-container">
        <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>
      <div className="store-container2">
        <div className="store-header">
          <div className="store-search">
            <input type="text" placeholder="검색어를 입력하세요..." />
            <button>검색</button>
          </div>
          <div className="store-points">💰 : 100</div>
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
        <ItemList items={tabItems[activeTab]} /> {/* ItemList 컴포넌트에 데이터 전달 */}
      </div>
    </div>
  );
};

export default Store;
