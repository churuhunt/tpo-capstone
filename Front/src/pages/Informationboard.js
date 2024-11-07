import React, { useState, useEffect } from 'react';
import api from '../axios';
import Noticeboard from '../components/Noticeboard';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';
import Banner from '../components/Banner';
import banner1 from '../image/infobanner.jpg';
import PageSubMenu from '../components/PageSubMenu'; /*sub*/

const InformationBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsPerPage] = useState(15);
  const [activeIndex, setActiveIndex] = useState(0); /*sub */
  const menuItems = ["🅰️전체", "🕺패션정보", "💲세일정보", "🎸기타정보"]; /*sub */

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts', {
          params: {
            category: '정보게시판',
            page: 0,
            size: postsPerPage
          }
        });
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="board4-container">
    <Banner src={banner1} title="정보게시판" />
    <div className="post-form-container"> {/*sub*/}
                <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            </div>
      <Noticeboard posts={posts} postsPerPage={15}/>
    </div>
  );
};

export default InformationBoard;
