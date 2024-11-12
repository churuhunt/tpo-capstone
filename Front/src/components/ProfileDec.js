import React from 'react';
import './ProfileDec.css';

import image1 from '../image/ProfileDecor1.gif';
import image2 from '../image/ProfileDecor2.gif';
import image3 from '../image/ProfileDecor2.gif';

const ProfileDec = ({ decId }) => {
  let selectedImage;

  switch (decId) {
    case 0:
      selectedImage = null;
      break;
    case 1:
      selectedImage = image1;
      break;
    case 2:
      selectedImage = image2;
      break;
    case 3:
      selectedImage = image3;
      break;
    default:
      selectedImage = null;
      break;
  }

  return (
    <div className={`profile-decor profile-decor-${decId}`}>
      {selectedImage ? (
        <img src={selectedImage} alt={`Decoration ${decId}`} />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ProfileDec;
