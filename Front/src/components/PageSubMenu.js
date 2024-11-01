import React, { useEffect, useRef, useState } from 'react';
import './PageSubMenu.css';

const PageSubMenu = ({ items, activeIndex, setActiveIndex }) => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const underlineRef = useRef(null);

    useEffect(() => {
        const menuItem = document.querySelectorAll('.page-sub-menu ul li')[hoverIndex ?? activeIndex];
        if (menuItem && underlineRef.current) {
            underlineRef.current.style.width = `${menuItem.offsetWidth}px`;
            underlineRef.current.style.left = `${menuItem.offsetLeft}px`;
        }
    }, [hoverIndex, activeIndex]);

    return (
        <nav className="page-sub-menu">
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        className={activeIndex === index ? 'active' : ''}
                    >
                        {item}
                    </li>
                ))}
            </ul>
            <div className="underline" ref={underlineRef}></div>
        </nav>
    );
};

export default PageSubMenu;
