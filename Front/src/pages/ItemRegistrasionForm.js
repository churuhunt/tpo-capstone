import React, { useState } from 'react';
import api from '../axios'; // axios 인스턴스를 가져옵니다

const ItemRegistrationForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('PROFILE');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 카테고리 옵션
    const categories = [
        { value: 'PROFILE', label: '프로필' },
        { value: 'BORDER', label: '테두리' },
        { value: 'BACKGROUND', label: '배경' },
        { value: 'FONT', label: '폰트' },
        { value: 'EMOJI', label: '이모티콘' },
        { value: 'EFFECT', label: '이펙트' },
        { value: 'OTHER', label: '기타' },
    ];

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // FormData 객체에 폼 데이터 추가
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        if (image) {
            formData.append('imageFile', image);
        }

        try {
            const response = await api.post('/items/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Item registered:', response.data);
            alert('물품이 성공적으로 등록되었습니다.');

            // 폼 초기화
            setName('');
            setDescription('');
            setPrice('');
            setCategory('PROFILE');
            setImage(null);
        } catch (error) {
            console.error('물품 등록 중 오류가 발생했습니다:', error);
            alert('물품 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="item-registration-form">
            <h2>상점 물품 등록</h2>

            <label>
                아이템 이름:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>

            <label>
                설명:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </label>

            <label>
                가격 (포인트):
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </label>

            <label>
                카테고리:
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                이미지:
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </label>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '등록 중...' : '물품 등록'}
            </button>
        </form>
    );
};

export default ItemRegistrationForm;