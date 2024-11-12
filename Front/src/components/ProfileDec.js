import React from 'react';
import image1 from '../image/ProfileDecor1.gif';
import image2 from '../image/Store1.jpg';
import image3 from '../image/Store1.jpg';

const ProfileDec = ({ decId }) => {
  let selectedImage;

  switch (decId) {
    case 0:
      selectedImage = null;
      break;
    case 1:
      selectedImage = null;
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
    <div>
      {selectedImage ? (
        <img src={selectedImage} alt={`Decoration ${decId}`} />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ProfileDec;
