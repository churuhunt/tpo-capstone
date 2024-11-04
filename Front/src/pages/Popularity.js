import React, { useState, useEffect } from 'react';
import axios from 'axios';
/*import './Popularity.css';*/
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';
import Banner from '../components/Banner';
import banner1 from '../image/Popularitybanner.jpg';
import Noticeboard from '../components/Noticeboard';

import PageSubMenu from '../components/PageSubMenu'; /*sub*/

const Popularity = () => {
  const [activeIndex, setActiveIndex] = useState(0); /*sub */
  const menuItems = ["😺일간", "😸주간", "😹월간", "😻연간"]; /*sub */

  const [posts, setPosts] = useState([
    {
      id: 1,
      category: '🗽',
      title: '첫 번째 게시물 제목입니다.',
      author: '사용자1',
      date: '2024-09-30',
      views: 100,
      likes: 20,
      thumbnailUrl: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/Fashion-photography_P1_900x420?$pjpeg$&jpegSize=200&wid=900',
      profileImageUrl: 'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfODEg/MDAxNjA2OTYwMTMwMDIz.CH0wwi3vq1NRbCMo4vSD2DxwqUjWhLAfGK3vs_HYAVMg.ew3TvMIDK86UJADD7363U3K2eQwi4TOwoG__QRwLgCUg.GIF.bidsh/01.gif?type=w800'
    },
    {
      id: 2,
      category: '❔',
      title: '두 번째 게시물 제목입니다.',
      author: '사용자2',
      date: '2024-09-29',
      views: 150,
      likes: 30,
      thumbnailUrl: 'https://img.khan.co.kr/news/2024/02/03/news-p.v1.20240131.e92b61eee105426b8fb091a0d5d8b0fe_P1.jpg',
      profileImageUrl: 'https://i.pinimg.com/originals/a3/66/6a/a3666aa57ceb02a22b155cb1b287f9e7.gif'
    },
    {
      id: 3,
      category: '👖',
      title: '세 번째 게시물 제목입니다.',
      author: '사용자3',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUWf9vKvLbrmHMW5MnCZ4aONKvDYwnUWb05w&s',
      profileImageUrl: 'https://i.namu.wiki/i/t7F8pzHw36_DxvmZD7h39NuCJYqXKZowmyvvO29Ng4DOY3jrnGRwWZUE1oCtyF2HNPHrxAENVfx9Nc8SG5ajJQ.gif'
    },
    {
      id: 4,
      category: '👖',
      title: '네 번째 게시물 제목입니다.',
      author: '사용자4',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://www.womansense.co.kr/upload/woman/article/201912/thumb/43613-395833-sampleM.jpg',
      profileImageUrl: 'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfMjM4/MDAxNjA2OTYwMTMwNTIx.WPbCwJi9dPPV9bvYFqNQWOCXBW0cuvxUUV-HlHIrD2kg.Q3IbhhN_ivuL-lxiv-BhOxne1wxBF6mHvTM2Y2wfChYg.GIF.bidsh/17.gif?type=w800'
    },
    {
      id: 5,
      category: '👖',
      title: '다섯 번째 게시물 제목입니다.',
      author: '사용자5',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://pimg.mk.co.kr/meet/neds/2021/01/image_readtop_2021_1224407_16409650924902628.jpg',
      profileImageUrl: 'https://i.namu.wiki/i/AqqP_0SvJeN-Ho3VwvnVlUP9uFxZUHOIAqjQpnc6L5JYjdv4p5am1Q7UEy67RUY9VNSIgdWPfbgQF6vGmZcBJw.gif'
    },
    {
      id: 6,
      category: '👖',
      title: '여섯 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://pimg.mk.co.kr/meet/neds/2021/01/image_readmed_2021_1224407_16409650924902629.jpg',
      profileImageUrl: 'https://i.namu.wiki/i/U_e54VGxcjBX4usL4co3vPE4n4tp0DwS-BvcyASuvP5lnco0NMFdJ0EeUgp9Uo4RDb68QlpgeysA3AyWsVfV5A.gif'
    },
    {
      id: 6,
      category: '👖',
      title: '일곱 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://image-cdn.hypb.st/https%3A%2F%2Fkr.hypebeast.com%2Ffiles%2F2023%2F04%2Fworlds-first-ai-fashion-week-ft.jpg?w=960&cbr=1&q=90&fit=max',
      profileImageUrl: 'https://i.namu.wiki/i/ngGBvU1gp5JvWQ1GM_UkBI5yiwKXUw-v3lP8qPh2IKO49YhWiRuUOq976Vi1RtFXgQr2qISob4SESCqQMbwOdw.gif'
    },
    {
      id: 6,
      category: '👖',
      title: '여덟 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://i.pinimg.com/736x/43/1e/2e/431e2e63acdc743a230d254bc1a01ad7.jpg',
      profileImageUrl: 'https://media.tenor.com/N1WZEisOLXsAAAAM/%EB%86%8D%EB%8B%B4%EA%B3%B0-jokebear.gif'
    },
    {
      id: 6,
      category: '👖',
      title: '아홉 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://m.fashion-full.com/renewImg/image/m/main_banner/2_202409290256071212.jpg',
      profileImageUrl: 'https://media.tenor.com/MPCPvINDMKUAAAAM/%E5%AF%B6%E8%B2%9D%E7%86%8A.gif'
    },
    {
      id: 6,
      category: '👖',
      title: '열 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://i.pinimg.com/236x/b8/e4/88/b8e488ec549dcdd7ff812b9739ed3795.jpg',
      profileImageUrl: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif'
    },
    {
      id: 6,
      category: '👖',
      title: '11 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1667520043080-53dcca77e2aa?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUVEJThDJUE4JUVDJTg1JTk4JTIwJUVCJUFBJUE4JUVCJThEJUI4fGVufDB8fDB8fHww',
      profileImageUrl: 'https://item.kakaocdn.net/do/5cabf3cc8b2e3541e9f652f06b25b1c6f43ad912ad8dd55b04db6a64cddaf76d'
    },
    {
      id: 6,
      category: '👖',
      title: '12 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://image.moazine.com/VCover/XLarge/000370/000000049842.jpg',
      profileImageUrl: 'https://item.kakaocdn.net/do/55637fa74e97ecbe8c86ac5e8d1d9f627e6f47a71c79378b48860ead6a12bf11'
    },
    {
      id: 6,
      category: '👖',
      title: '13 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfq1JWb6eId_J6MLbdQlb8R5Yjx4DClN5mNg&s',
      profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlpCFy3iIzQNzLYXLggaOclrq5sU1Ms5mhag&s'
    },
    {
      id: 6,
      category: '👖',
      title: '14 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://pimg.mk.co.kr/meet/neds/2022/07/image_readtop_2022_635451_16582076355112096.jpg',
      profileImageUrl: 'https://media.bunjang.co.kr/product/253870277_%7Bcnt%7D_1708354676_w%7Bres%7D.jpg'
    },
    {
      id: 6,
      category: '👖',
      title: '15 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://www.bizhankook.com/upload/bk/article/201804/thumb/15178-29626-sampleM.jpg',
      profileImageUrl: 'https://media.bunjang.co.kr/product/253870277_2_1708354676_w360.jpg'
    },
    {
      id: 6,
      category: '👖',
      title: '16 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://blog.kakaocdn.net/dn/Sqxn1/btqw7c3471n/kxC2l3QZOlwqZAUfyQYCH0/img.png',
      profileImageUrl: 'https://i.pinimg.com/236x/dd/f7/c7/ddf7c7ba7eb9736b84a64a565c8d4537.jpg'
    },
    {
      id: 6,
      category: '👖',
      title: '17 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://image.msscdn.net/mfile_s01/cms-files/64cb2f0e791467.76930275.jpg',
      profileImageUrl: 'https://i.pinimg.com/550x/c5/ae/3a/c5ae3a02a869f7381797046f59854d54.jpg'
    },
    {
      id: 6,
      category: '👖',
      title: '18 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9vIqkOhWByoYY5Qote39dB2FHb9m1ApeL6_Lz1PJKbqRcW4iBzwIU9VHy9xqbbvhBDzY&usqp=CAU',
      profileImageUrl: 'https://i.pinimg.com/236x/91/55/13/91551360dc17bb62f7d23dc2a8ce7f4f.jpg'
    },
    {
      id: 6,
      category: '👖',
      title: '19 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://i.pinimg.com/236x/20/88/7a/20887ace146540dba9dfde0603004fbd.jpg',
      profileImageUrl: 'https://i.pinimg.com/236x/5f/ac/72/5fac726960c5d61599ec52a955fbf32b.jpg'
    },
    {
      id: 6,
      category: '👖',
      title: '20 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://i.pinimg.com/236x/3c/0e/c4/3c0ec4d829a43cc46cee6428e21ba8c6.jpg',
      profileImageUrl: 'https://image.blip.kr/v1/file/843689388f56fabb7cb64da9cfbc772f'
    },
    {
      id: 6,
      category: '👖',
      title: '21 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://i.pinimg.com/236x/d5/3f/de/d53fde7ca66f6f855ac891ffc64289ef.jpg',
      profileImageUrl: 'https://mblogthumb-phinf.pstatic.net/MjAyMTAxMTVfMTQ3/MDAxNjEwNzE1NjI5NDg3.zVoKymGokWDVyo4LR4DGX0hcD0tOhekkrYrQXcFgrvog.j-77qhOAo8HG_hLeeo8PM1UFSZ4UQVpww9sRTX-A-6Qg.JPEG.dltldud33/IMG_8779.JPG?type=w800'
    }
  ]);
    return (
      <div className="board4-container">
        <Banner src={banner1} title="👍추천게시판" />
        <div className="post-form-container"> {/*sub*/}
            <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
        <Noticeboard posts={posts} postsPerPage={15} onWriteLink="/write" />
      </div>
    );
  };

export default Popularity;


