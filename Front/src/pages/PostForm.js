//글작성 JS
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostForm.css';

import boldIcon from '../image/bold.png';
import italicsIcon from '../image/italics.png';
import underlineIcon from '../image/under.png';
import leftIcon from '../image/left.png';
import centerIcon from '../image/center.png';
import rightIcon from '../image/right.png';
import imageIcon from '../image/image.png';
import strikethroughIcon from '../image/strikethrough.png';
import fontcolorIcon from '../image/fontcolor.png';
import fontbackcolorIcon from '../image/fontbackcolor.png';
import banner1 from '../image/banner1.jpg';
import PageSubMenu from '../components/PageSubMenu'; /*sub*/
import Banner from '../components/Banner';

const PostForm = () => {
    const menuItems = ["🗽자유게시판", "👖데일리룩게시판", "❔질문게시판"]; /*sub */
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('커뮤니티');
    const [fontColor, setFontColor] = useState('#000000');
    const [fontBackColor, setFontBackColor] = useState('#ffffff');
    const [tags, setTags] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const underlineRef = useRef(null);
    const navigate = useNavigate();
    const contentRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            title,
            content,
            category,
            tags,
            author: '현재 사용자 이름',
            date: new Date(),
            views: 0,
            likes: 0,
        };

        try {
            await axios.post('/api/posts', postData);
            alert('게시물이 성공적으로 작성되었습니다.');
            navigate('/community');
        } catch (error) {
            console.error('게시물 작성 중 오류가 발생했습니다:', error);
        }
    };

    const applyStyle = (command, value = null) => {
        if (contentRef.current) contentRef.current.focus();
        document.execCommand(command, false, value);
    };

    const handleColorChange = (color) => {
        setFontColor(color);
        applyStyle('foreColor', color);
    };

    const handleBackgroundColorChange = (color) => {
        setFontBackColor(color);
        applyStyle('backColor', color);
    };

    const insertImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (contentRef.current) contentRef.current.focus();
                applyStyle('insertImage', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="post-form-container">

            <Banner src={banner1} title="🧾게시글 작성" />
            
            <div className="post-form-container"> {/*sub*/}
            <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
            <form className="post-form-container1" onSubmit={handleSubmit}>
                <div className="title-category-container">
                    <label className="category-label">
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="자유게시판">자유게시판</option>
                            <option value="데일리룩">데일리룩</option>
                            <option value="질문게시판">질문게시판</option>
                            <option value="추천게시판">추천게시판</option>
                            <option value="정보게시판">정보게시판</option>
                        </select>
                    </label>
                    <label className="title-label">
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요" />
                    </label>
                </div>
                
                <div className="editor-controls">
                    <label>
                        <select onChange={(e) => applyStyle('fontName', e.target.value)}>
                            <option value="Arial">폰트1</option>
                            <option value="Courier New">폰트2</option>
                            <option value="Georgia">폰트3</option>
                            <option value="Times New Roman">폰트4</option>
                            <option value="Verdana">폰트5</option>
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
                    <button type="button" onMouseDown={() => applyStyle('bold')} className="PostForm-icon-button">
                        <img src={boldIcon} alt="Bold" />
                    </button>
                    <button type="button" onMouseDown={() => applyStyle('italic')} className="PostForm-icon-button">
                        <img src={italicsIcon} alt="Italic" />
                    </button>
                    <button type="button" onMouseDown={() => applyStyle('underline')} className="PostForm-icon-button">
                        <img src={underlineIcon} alt="Underline" />
                    </button>
                    <button type="button" onMouseDown={() => applyStyle('strikethrough')} className="PostForm-icon-button">
                        <img src={strikethroughIcon} alt="Strikethrough" />
                    </button>

                    <label className="PostForm-icon-button" onMouseDown={(e) => e.preventDefault()}>
                        <img src={fontcolorIcon} alt="Font Color" />
                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{ display: 'none' }}
                        />
                    </label>

                    <label className="PostForm-icon-button" onMouseDown={(e) => e.preventDefault()}>
                        <img src={fontbackcolorIcon} alt="Font Background Color" />
                        <input
                            type="color"
                            value={fontBackColor}
                            onChange={(e) => handleBackgroundColorChange(e.target.value)}
                            style={{ display: 'none' }}
                        />
                    </label>
                    
                    <button type="button" onMouseDown={() => applyStyle('justifyLeft')} className="PostForm-icon-button">
                        <img src={leftIcon} alt="Left" />
                    </button>
                    <button type="button" onMouseDown={() => applyStyle('justifyCenter')} className="PostForm-icon-button">
                        <img src={centerIcon} alt="Center" />
                    </button>
                    <button type="button" onMouseDown={() => applyStyle('justifyRight')} className="PostForm-icon-button">
                        <img src={rightIcon} alt="Right" />
                    </button>
                    <label className="PostForm-icon-button" onMouseDown={(e) => e.preventDefault()}>
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

                <div className="tag-container">
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="본문에 #을 이용하여 태그를 사용해보세요! (최대 10개)"
                    />
                </div>

                <div className="buttons-container">
                    <button type="submit" className="submit-button">등록</button>
                    <button type="button" className="list-button" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
        
    );
};

export default PostForm;
