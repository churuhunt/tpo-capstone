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
    { item_category: "프로필", item_name: "기본 1💰 Gif 2💰", image_url: "", isUploadOption: true },
    { item_category: "배경", item_name: "기본 1💰 Gif 2💰", image_url: "", isUploadOption: true },
    { item_category: "프로필", item_name: "토끼", image_url: "https://i.pinimg.com/236x/2f/55/97/2f559707c3b04a1964b37856f00ad608.jpg" },
    { item_category: "프로필", item_name: "곰", image_url: "https://i.pinimg.com/236x/d6/4e/97/d64e9765deca662e8fa07d2cfdb67f7c.jpg" },
    { item_category: "배경", item_name: "남색 배경", image_url: "https://my-tpo-images.s3.ap-southeast-2.amazonaws.com/94080ca7-9d9b-423d-a63e-408b8756059f_9.png" },
    { item_category: "배경", item_name: "바다색 배경", image_url: "https://my-tpo-images.s3.ap-southeast-2.amazonaws.com/579311bb-cf13-491a-bc98-78203d2008ab_qkek.png" },
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