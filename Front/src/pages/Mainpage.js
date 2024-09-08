import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Mainpage.css';

import mainimg1 from '../image/mainimg1.jpg';
import mainimg2 from '../image/mainimg2.jpg';
import mainimg3 from '../image/mainimg3.jpg';

const slideImages = [
  mainimg1,
  mainimg2,
  mainimg3
];

const Mainpage = () => {
  return (
    <div className="main-page">
      <div className="background-overlay"></div>
      <div className="content">
        <div className="slideshow-container">
          <Slide easing="ease">
            {slideImages.map((image, index) => (
              <div className="each-slide" key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Slide>
        </div>
        <div className="text-container">
          <h1 className="main-title">Welcome to TPO</h1>
          <p className="main-description">Time Place Occasion</p>
          <button className="explore-button">Explore Now</button>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
