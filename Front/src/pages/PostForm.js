import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
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
import PageSubMenu from '../components/PageSubMenu';
import Banner from '../components/Banner';

const PostForm = () => {
    const [fontName, setFontName] = useState('Arial');
    const menuItems = ["자유게시판", "데일리룩게시판", "질문게시판", "추천게시판", "정보게시판"];
    const subCategories = {
        정보게시판: ["패션정보", "세일정보", "기타정보"],
    };

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(menuItems[0]);
    const [smallCategory, setSmallCategory] = useState('');
    const [author, setAuthor] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [tags, setTags] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const underlineRef = useRef(null);
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const [subCategoryFilter, setSubCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [showFontColorPicker, setShowFontColorPicker] = useState(false);
    const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
    const [fontColor, setFontColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    // 스타일 버튼 상태 관리
    const [boldActive, setBoldActive] = useState(false);
    const [italicActive, setItalicActive] = useState(false);
    const [underlineActive, setUnderlineActive] = useState(false);
    const [strikethroughActive, setStrikethroughActive] = useState(false);

    const toggleStyle = (command, isActive, setActive) => {
        document.execCommand(command, false, null);
        setActive(!isActive);
    };

    const handleSubCategoryChange = (event) => {
        setSubCategoryFilter(event.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/users/current');
                setAuthor(response.data.nickname);
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const menuItem = document.querySelectorAll('.post-form-sub-menu li')[hoverIndex ?? activeIndex];
        if (menuItem && underlineRef.current) {
            underlineRef.current.style.width = `${menuItem.offsetWidth}px`;
            underlineRef.current.style.left = `${menuItem.offsetLeft}px`;
        }
    }, [hoverIndex, activeIndex]);

    const handleFontChange = (e) => {
        const selectedFont = e.target.value;
        setFontName(selectedFont);
        applyStyle('fontName', selectedFont);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            category,
            smallCategory: category === "정보게시판" ? smallCategory : null,
            author,
            date: new Date(),
            views: 0,
            likes: 0,
        };

        const formData = new FormData();
        formData.append('postDto', JSON.stringify(postData));
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        try {
            await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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

    const insertImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                if (contentRef.current) contentRef.current.focus();
                applyStyle('insertImage', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFontColorChange = (e) => {
        const color = e.target.value;
        setFontColor(color);
        applyStyle('foreColor', color);
    };

    const handleBackgroundColorChange = (e) => {
        const color = e.target.value;
        setBackgroundColor(color);
        applyStyle('hiliteColor', color);
    };

    // 텍스트 커서 위치에서 현재 스타일을 감지하여 버튼 활성화 상태를 업데이트
    useEffect(() => {
        const updateButtonStates = () => {
            setBoldActive(document.queryCommandState('bold'));
            setItalicActive(document.queryCommandState('italic'));
            setUnderlineActive(document.queryCommandState('underline'));
            setStrikethroughActive(document.queryCommandState('strikethrough'));
        };

        document.addEventListener('selectionchange', updateButtonStates);

        return () => {
            document.removeEventListener('selectionchange', updateButtonStates);
        };
    }, []);

    return (
        <div className="post-form-container">
            <Banner src={banner1} title="📝게시물 작성" />

            <PageSubMenu
                items={menuItems}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onItemClick={(item, index) => {
                    const value = item === "🅰️전체" ? "all" : item;
                    handleSubCategoryChange({ target: { value } });
                }}
            />

            <form className="post-form-container1" onSubmit={handleSubmit}>
                <div className="title-category-container2">
                    <div className="title-category-container">
                        <label className="category-label">
                            <select className="Postform-sel-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="자유게시판">자유게시판</option>
                                <option value="데일리룩">데일리룩</option>
                                <option value="질문게시판">질문게시판</option>
                                <option value="추천게시판">추천게시판</option>
                                <option value="정보게시판">정보게시판</option>
                            </select>
                        </label>
                        <label className="title-label">
                            <input type="text1" className="custom-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요" />
                        </label>
                    </div>

                    <div className="editor-controls">
                        <label>
                            <select
                                className="Postform-sel-2"
                                onChange={handleFontChange}
                                style={{ fontFamily: fontName }}
                            >
                                <option value="Arial" style={{ fontFamily: 'Arial' }}>폰트선택 - 기본 (Arial)</option>
                                <option value="'Gasoek One', sans-serif" style={{ fontFamily: "'Gasoek One', sans-serif" }}>가나다라 (Gasoek One)</option>
                                <option value="'Stylish', sans-serif" style={{ fontFamily: "'Stylish', sans-serif" }}>가나다라 (Stylish)</option>
                                <option value="'Dongle', sans-serif" style={{ fontFamily: "'Dongle', sans-serif", fontSize: '30px' }}>가나다라 (Dongle)</option>
                            </select>
                        </label>
                        <label>
                            <select className="Postform-sel-3" onChange={(e) => applyStyle('fontSize', e.target.value)}>
                                <option value="1">10</option>
                                <option value="2">13</option>
                                <option value="3">16</option>
                                <option value="4">18</option>
                                <option value="5">24</option>
                                <option value="6">32</option>
                                <option value="7">48</option>
                            </select>
                        </label>

                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                toggleStyle('bold', boldActive, setBoldActive);
                            }}
                            className={`PostForm-icon-button ${boldActive ? 'active' : ''}`}
                        >
                            <img src={boldIcon} alt="Bold" />
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                toggleStyle('italic', italicActive, setItalicActive);
                            }}
                            className={`PostForm-icon-button ${italicActive ? 'active' : ''}`}
                        >
                            <img src={italicsIcon} alt="Italic" />
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                toggleStyle('underline', underlineActive, setUnderlineActive);
                            }}
                            className={`PostForm-icon-button ${underlineActive ? 'active' : ''}`}
                        >
                            <img src={underlineIcon} alt="Underline" />
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                toggleStyle('strikethrough', strikethroughActive, setStrikethroughActive);
                            }}
                            className={`PostForm-icon-button ${strikethroughActive ? 'active' : ''}`}
                        >
                            <img src={strikethroughIcon} alt="Strikethrough" />
                        </button>

                        <label className="PostForm-icon-button">
                            <img src={fontcolorIcon} alt="Font Color" onClick={() => setShowFontColorPicker(!showFontColorPicker)} />
                            {showFontColorPicker && (
                                <input
                                    type="color"
                                    value={fontColor}
                                    onChange={handleFontColorChange}
                                    onBlur={() => setShowFontColorPicker(false)}
                                    className="color-picker-popup"
                                />
                            )}
                        </label>

                        <label className="PostForm-icon-button">
                            <img src={fontbackcolorIcon} alt="Font Background Color" onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)} />
                            {showBackgroundColorPicker && (
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={handleBackgroundColorChange}
                                    onBlur={() => setShowBackgroundColorPicker(false)}
                                    className="color-picker-popup"
                                />
                            )}
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

                    <div className="PostForm-postandcancelbutton-container">
                        <button type="submit" className="submit-button">등록</button>
                        <button type="button" className="list-button" onClick={() => navigate(-1)}>취소</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
