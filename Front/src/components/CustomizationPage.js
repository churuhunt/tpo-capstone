import React, { useState, useEffect } from 'react';
import './CustomizationPage.css';
import api from '../axios';

const CustomizationPage = ({
                             setTempProfileImage,
                             setTempBackgroundImage,
                             onSave,
                             onCancel,
                             points,
                             updatePoints, // 차감된 포인트를 반영할 상위 컴포넌트의 함수
                             userId, // userId를 props로 받음
                           }) => {
  const defaultItems = [
    { item_category: '프로필', item_name: '기본 1💰 Gif 2💰', image_url: '', isUploadOption: true },
    { item_category: '배경', item_name: '기본 1💰 Gif 2💰', image_url: '', isUploadOption: true },
    { item_category: '프로필', item_name: '테스트 이미지 1', image_url: 'https://i.pinimg.com/originals/6a/f4/0b/6af40b1d8318adbe38072284f24851b9.jpg' },
    { item_category: '프로필', item_name: '테스트 이미지 2', image_url: 'https://i.pinimg.com/originals/fd/29/9a/fd299aac8ae19c908fac63c9407a8460.jpg' },
    { item_category: '배경', item_name: '테스트 이미지 1', image_url: 'https://web.mission1.co.kr/boardForder/print/%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4PC4062341.jpg' },
    { item_category: '배경', item_name: '테스트 이미지 2', image_url: 'https://d2v80xjmx68n4w.cloudfront.net/gigs/DsuFJ1702393141.jpg' },
  ];

  const [items, setItems] = useState(defaultItems);
  const [selectedCategory, setSelectedCategory] = useState('프로필');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOwnedItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const fetchOwnedItems = async () => {
    try {
      const response = await api.get('/shop/owned-items');
      const ownedItems = response.data;
      setItems((prevItems) => [...prevItems, ...ownedItems]);
    } catch (error) {
      console.error('Failed to fetch owned items:', error);
    }
  };

  const filteredItems = items.filter((item) => item.item_category === selectedCategory);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deductPointsFromAccount = async (pointsToDeduct) => {
    try {
      await api.post(`/users/${userId}/deduct-points`, null, {
        params: { points: pointsToDeduct },
      });
    } catch (error) {
      console.error('Failed to deduct points:', error);
      alert('포인트 차감에 실패하였습니다.');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (points >= 1) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const uploadPath = selectedCategory === '프로필' ? 'profile/upload-profile-image' : 'profile/upload-background-image';
          const response = await api.post(`/myhome/${uploadPath}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const imageUrl = response.data;

          if (selectedCategory === '프로필') {
            setTempProfileImage(imageUrl);
          } else if (selectedCategory === '배경') {
            setTempBackgroundImage(imageUrl);
          }

          await deductPointsFromAccount(1); // 서버에 포인트 차감 요청
          updatePoints(points - 1); // 로컬 상태에서 포인트 차감
        } catch (error) {
          console.error('Image upload failed:', error);
          alert('이미지 업로드에 실패했습니다.');
        }
      } else {
        alert('포인트가 부족합니다.');
      }
    }
  };

  const handleUploadImage = async () => {
    if (points >= 1) {
      const imageUrl = prompt('업로드할 이미지 URL을 입력하세요:');
      if (imageUrl) {
        try {
          const updatePath = selectedCategory === '프로필' ? 'update-profile-url' : 'update-background-url';
          await api.post(`/api/myhome/${updatePath}`, { imageUrl });

          if (selectedCategory === '프로필') {
            setTempProfileImage(imageUrl);
          } else if (selectedCategory === '배경') {
            setTempBackgroundImage(imageUrl);
          }

          await deductPointsFromAccount(1); // 서버에 포인트 차감 요청
          updatePoints(points - 1); // 로컬 상태에서 포인트 차감
        } catch (error) {
          console.error('URL update failed:', error);
          alert('이미지 URL 업데이트에 실패했습니다.');
        }
      }
    } else {
      alert('포인트가 부족합니다.');
    }
  };

  const handleItemClick = (imageUrl, isUploadOption) => {
    if (isUploadOption) {
      document.getElementById('fileInput').click();
    } else {
      if (selectedCategory === '프로필') {
        setTempProfileImage(imageUrl);
      } else if (selectedCategory === '배경') {
        setTempBackgroundImage(imageUrl);
      }
    }
  };

  return (
      <div className="CustomizationPage-container1">
        <div className="store-points">보유 포인트: {points}</div>
        <div className="CustomizationPage-container-button-container2">
          <button onClick={() => setSelectedCategory('프로필')}>프로필</button>
          <button onClick={() => setSelectedCategory('배경')}>배경</button>
          <button onClick={() => setSelectedCategory('테두리')}>테두리</button>
          <button onClick={() => setSelectedCategory('이펙트')}>이펙트</button>
        </div>
        <div className="CustomizationPage-container2">
          <div className="CustomizationPage-items">
            {currentItems.map((item, index) => (
                <div key={index} className="CustomizationPage-item" onClick={() => handleItemClick(item.image_url, item.isUploadOption)}>
                  {item.isUploadOption ? (
                      <div className="CustomizationPage-upload-option">
                        <p>이미지 업로드</p>
                      </div>
                  ) : (
                      <img src={item.image_url} alt={item.item_name} className="CustomizationPage-item-image" />
                  )}
                  <p className="CustomizationPage-item-name">{item.item_name}</p>
                </div>
            ))}
          </div>
          <div className="CustomizationPage-pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>이전</button>
            <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}>다음</button>
          </div>
        </div>
        <div className="CustomizationPage-container-button-container2">
          <button onClick={onSave}>저장</button>
          <button onClick={onCancel}>취소</button>
        </div>

        {/* 파일 선택 input (hidden 처리) */}
        <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
  );
};

export default CustomizationPage;