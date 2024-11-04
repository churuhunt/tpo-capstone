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
      { name: "살려주세요", price:"50,000", image: "https://ogq-sticker-global-cdn-z01.afreecatv.com/sticker/16f23ce594d55f6/main.png" },
      { name: "심슨", price:"50,000", image: "https://media.tenor.com/m-5kVE1gidsAAAAj/homer-simpson-bush-transparent.gif" },
      { name: "개구리", price:"50,000", image: "https://media.fmkorea.com/files/attach/new/20200728/2978469841/2984528844/3010242160/1021e5f1017ff36b298d393574c9ce1c.gif" },
      { name: "농담곰", price:"50,000", image: "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfODEg/MDAxNjA2OTYwMTMwMDIz.CH0wwi3vq1NRbCMo4vSD2DxwqUjWhLAfGK3vs_HYAVMg.ew3TvMIDK86UJADD7363U3K2eQwi4TOwoG__QRwLgCUg.GIF.bidsh/01.gif?type=w800" },
    ],
    "테두리": [
      { name: "검정 테두리", price:"50,000", image: "https://png.pngtree.com/png-clipart/20220706/ourmid/pngtree-elegant-simple-black-lace-border-icon-png-yuri-png-image_5709541.png" },      
    ],
    "배경": [
      { name: "윈도우", price:"50,000", image: "https://i.namu.wiki/i/w11dbZZeomJI4bD3_KItw3vq7tgglcM1YQA_xHULxMsixPpY1S7KcB8WrEFhJNuSuejiiQkicGKMH12JvpUqBQ.webp" },
    ],
    "폰트": [
      { name: "이겨책읽", price:"50,000", image: "https://noonnucc-production.sfo2.cdn.digitaloceanspaces.com/202410/1730105823907507.png" },
      { name: "몸튼튼마음튼튼", price:"50,000", image: "https://noonnucc-production.sfo2.cdn.digitaloceanspaces.com/202408/1723017459633777.jpeg" },
    ],
    "이모티콘": [
      { name: "라이언힘", price:"50,000", image: "https://t1.kakaocdn.net/estoreweb/images/20240902172018/img_completed.png" },
      { name: "라이언등장", price:"50,000", image: "https://item.kakaocdn.net/do/30cef086c8778d80e1487385bd5efe7b8f324a0b9c48f77dbce3a43bd11ce785" },
    ],
    "이펙트": [
      { name: "눈", price:"50,000", image: "https://i.pinimg.com/originals/57/80/a4/5780a47067fb3e7a3fdd069465ac0f2f.gif" },
      { name: "하트", price:"50,000", image: "https://i.pinimg.com/originals/eb/5a/84/eb5a84fe13c6bf73285c4afe994297a5.gif" },
      { name: "꽃가루", price:"50,000", image: "https://i.pinimg.com/originals/52/f2/07/52f207b309cbdb9faa6e627ad3ffe95f.gif" },
    ],
    "기타": [
      { name: "기타", price:"50,000", image: "https://cdn-icons-png.flaticon.com/512/8332/8332396.png" },
    ],
  };

  return (
    <div className="store-container">
      <Banner src={banner1} title="🏪상점" />
      <div className="post-form-container">
        <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>
      <div className="store-container2">
        <div className="store-header">
        <div className="store-points">💰 100</div>
          {/*<div className="store-search">
            <input type="text" placeholder="검색어를 입력하세요..." />
            <button className="store-search-button">검색</button>
          </div>*/}
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
        <div className='itemlist-container'>
        <ItemList items={tabItems[activeTab]} /></div>
      </div>
    </div>
  );
};

export default Store;
