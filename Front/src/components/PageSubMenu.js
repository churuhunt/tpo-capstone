import React, { useEffect, useRef, useState } from 'react';
import './PageSubMenu.css';

const PageSubMenu = ({ items, activeIndex, setActiveIndex, onItemClick }) => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const underlineRef = useRef(null);

    useEffect(() => {
        if (items.length > 0) {
            const menuItem = document.querySelectorAll('.page-sub-menu ul li')[hoverIndex ?? activeIndex];
            if (menuItem && underlineRef.current) {
                underlineRef.current.style.width = `${menuItem.offsetWidth}px`;
                underlineRef.current.style.left = `${menuItem.offsetLeft}px`;
            }
        }
    }, [hoverIndex, activeIndex, items]);

    return (
        <nav className="page-sub-menu">
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            setActiveIndex(index);
                            onItemClick && onItemClick(item, index); // 클릭 시 부모 콜백 호출
                        }}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        className={activeIndex === index ? 'active' : ''}
                    >
                        {item}
                    </li>
                ))}
            </ul>
            {items.length > 0 && <div className="underline" ref={underlineRef}></div>}
        </nav>
    );
};

export default PageSubMenu;