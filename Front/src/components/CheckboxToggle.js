import React from 'react';
import './CheckboxToggle.css';

const CheckboxToggle = ({ id, isChecked, onChange }) => {
    return (
        <div className="check-box-toggle-container">
            <input
                type="checkbox"
                id={id}
                className="check-box-input"
                checked={isChecked}
                onChange={onChange}
            />
            <label htmlFor={id} className="check-box-label">
                Toggle
            </label>
        </div>
    );
};

export default CheckboxToggle;
