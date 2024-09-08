import React, {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // axios로 API 요청
import './PostForm.css';

import boldIcon from '../image/bold.png';
import italicsIcon from '../image/italics.png';
import underlineIcon from '../image/under.png';
import leftIcon from '../image/left.png';
import centerIcon from '../image/center.png';
import rightIcon from '../image/right.png';
import imageIcon from '../image/image.png';

const PostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('커뮤니티');
    const navigate = useNavigate();
    const contentRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            title,
            content,
            category,
            author: '현재 사용자 이름',  // 실제로는 로그인된 사용자 정보가 필요.
            date: new Date(),  // 현재 시간을 설정
            views: 0,  // 새로운 게시물은 조회수 0으로 시작
            likes: 0,  // 새로운 게시물은 추천수 0으로 시작
        };

        try {
            // 서버로 POST 요청 보내기
            await axios.post('/api/posts', postData);
            alert('게시물이 성공적으로 작성되었습니다.');
            navigate('/community');  // 게시물 작성 후 커뮤니티 목록으로 이동
        } catch (error) {
            console.error('게시물 작성 중 오류가 발생했습니다:', error);
        }
    };

    const applyStyle = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const insertImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            document.execCommand('insertImage', false, event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="post-form-container">
            <h2 className="post-form-title">게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                <div className="title-category-container">
                    <label className="title-label">
                        제목:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label className="category-label">
                        카테고리:
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="자유게시판">자유게시판</option>
                            <option value="데일리룩">데일리룩</option>
                            <option value="질문게시판">질문게시판</option>
                            <option value="추천게시판">추천게시판</option>
                            <option value="정보게시판">정보게시판</option>
                        </select>
                    </label>
                </div>
                <div className="editor-controls">
                    <label>
                        <select onChange={(e) => applyStyle('fontName', e.target.value)}>
                            <option value="Arial">Arial</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                    </label>
                    <label>
                        <select onChange={(e) => applyStyle('fontSize', e.target.value)}>
                            <option value="1">10</option>
                            <option value="2">13</option>
                            <option value="3">16</option>
                            <option value="4">18</option>
                            <option value="5">24</option>
                            <option value="6">32</option>
                            <option value="7">48</option>
                        </select>
                    </label>
                    <button type="button" onClick={() => applyStyle('bold')} className="icon-button">
                        <img src={boldIcon} alt="Bold" />
                    </button>
                    <button type="button" onClick={() => applyStyle('italic')} className="icon-button">
                        <img src={italicsIcon} alt="Italic" />
                    </button>
                    <button type="button" onClick={() => applyStyle('underline')} className="icon-button">
                        <img src={underlineIcon} alt="Underline" />
                    </button>
                    <button type="button" onClick={() => applyStyle('justifyLeft')} className="icon-button">
                        <img src={leftIcon} alt="Left" />
                    </button>
                    <button type="button" onClick={() => applyStyle('justifyCenter')} className="icon-button">
                        <img src={centerIcon} alt="Center" />
                    </button>
                    <button type="button" onClick={() => applyStyle('justifyRight')} className="icon-button">
                        <img src={rightIcon} alt="Right" />
                    </button>
                    <label className="icon-button">
                        <img src={imageIcon} alt="Insert Image" />
                        <input type="file" accept="image/*" onChange={insertImage} style={{ display: 'none' }} />
                    </label>
                </div>
                <div
                    ref={contentRef}
                    contentEditable
                    className="content-editable"
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                ></div>
                <br />
                <button type="submit" className="submit-button">게시글 작성</button>
                <button type="button" className="list-button" onClick={() => navigate(-1)}>목록</button>
            </form>
        </div>
    );
};

export default PostForm;