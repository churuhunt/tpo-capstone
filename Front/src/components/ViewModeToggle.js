import React, { useState } from 'react';

import listViewIcon from '../image/listview.png';
import gridViewIcon from '../image/gridview.png';

const ViewModeToggle = () => {
    const [viewMode, setViewMode] = useState('list');

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    return (
    <div className="Noticeboard-container">
          <div className="Noticeboard-top">
        <div className="Noticeboard-view-toggle-container">
                  <img
                    src={listViewIcon}
                    alt="리스트형 보기"
                    onClick={() => handleViewModeChange('list')}
                    disabled={viewMode === 'list'}
                  />
                  <img
                    src={gridViewIcon}
                    alt="액자형 보기"
                    onClick={() => handleViewModeChange('grid')}
                    disabled={viewMode === 'grid'}
                  />
        </div></div></div>
    );
};

export default ViewModeToggle;
