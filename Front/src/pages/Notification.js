import React, { useState, useEffect } from 'react';
import axios from 'axios';
/*import './Notification.css'; */
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';
import Banner from '../components/Banner';
import banner1 from '../image/Notificationbanner.jpg';
import Noticeboard from '../components/Noticeboard';

import PageSubMenu from '../components/PageSubMenu'; /*sub*/

const Notification = () => { 
  const [activeIndex, setActiveIndex] = useState(0); /*sub */
  const menuItems = []; /*sub */
  const [posts, setPosts] = useState([
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '🎁이벤트',
      title: '첫 번째 이벤트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '🆙업데이트',
      title: '첫 번째 업데이트입니다.',
      date: '2024-10-01',
      views: 322,
      likes: 150,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    },
    {
      category: '📢공지',
      title: '첫 번째 공지사항입니다.',
      date: '2024-10-01',
      views: 100,
      likes: 10,
    }
  ]);

  return (
    <div className="Notification-container">
      <div className="board4-container">
        <Banner src={banner1} title="📢공지사항" />
        <div className="post-form-container">
          <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
        {/* 2열과 4열을 숨기도록 hiddenColumns prop 추가 */}
        <Noticeboard posts={posts} postsPerPage={15} hiddenColumns={[2, 4]} />
      </div>
    </div>
  );
};

export default Notification;
