import React, { useState } from 'react';
import './ViewModeToggle.css';

import listViewIcon from '../image/listview.png';
import gridViewIcon from '../image/gridview.png';

const ViewModeToggle = ({ viewMode, onChange }) => {
    return (
        <div className="View-toggle-container">
            <img
                src={listViewIcon}
                alt="리스트형 보기"
                onClick={() => onChange('list')}
                style={{ opacity: viewMode === 'list' ? 0.5 : 1 }}
            />
            <img
                src={gridViewIcon}
                alt="액자형 보기"
                onClick={() => onChange('grid')}
                style={{ opacity: viewMode === 'grid' ? 0.5 : 1 }}
            />
        </div>
    );
};


export default ViewModeToggle;
