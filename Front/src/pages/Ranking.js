import React, { useState, useEffect } from 'react';
import Confetti from '../components/Confetti';
import './Ranking.css';
import profileImage from '../image/profile.png';

const Rankings = ({ rankings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  if (!rankings) {
    rankings = [
      { nickname: 'User1', points: 100, profile: 'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfODEg/MDAxNjA2OTYwMTMwMDIz.CH0wwi3vq1NRbCMo4vSD2DxwqUjWhLAfGK3vs_HYAVMg.ew3TvMIDK86UJADD7363U3K2eQwi4TOwoG__QRwLgCUg.GIF.bidsh/01.gif?type=w800' },
      { nickname: 'User3', points: 32, profile: 'https://i.pinimg.com/originals/a3/66/6a/a3666aa57ceb02a22b155cb1b287f9e7.gif' },
      { nickname: 'User5', points: 543, profile: 'https://i.namu.wiki/i/t7F8pzHw36_DxvmZD7h39NuCJYqXKZowmyvvO29Ng4DOY3jrnGRwWZUE1oCtyF2HNPHrxAENVfx9Nc8SG5ajJQ.gif' },
      { nickname: 'User5', points: 1430, profile: 'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfMjM4/MDAxNjA2OTYwMTMwNTIx.WPbCwJi9dPPV9bvYFqNQWOCXBW0cuvxUUV-HlHIrD2kg.Q3IbhhN_ivuL-lxiv-BhOxne1wxBF6mHvTM2Y2wfChYg.GIF.bidsh/17.gif?type=w800' },
      { nickname: 'User6', points: 9540, profile: 'https://i.namu.wiki/i/AqqP_0SvJeN-Ho3VwvnVlUP9uFxZUHOIAqjQpnc6L5JYjdv4p5am1Q7UEy67RUY9VNSIgdWPfbgQF6vGmZcBJw.gif' },
      { nickname: 'User31', points: 210, profile: 'https://i.namu.wiki/i/U_e54VGxcjBX4usL4co3vPE4n4tp0DwS-BvcyASuvP5lnco0NMFdJ0EeUgp9Uo4RDb68QlpgeysA3AyWsVfV5A.gif' },
      { nickname: 'User2', points: 30, profile: 'https://i.namu.wiki/i/ngGBvU1gp5JvWQ1GM_UkBI5yiwKXUw-v3lP8qPh2IKO49YhWiRuUOq976Vi1RtFXgQr2qISob4SESCqQMbwOdw.gif' },
      { nickname: 'User5', points: 11, profile: 'https://media.tenor.com/N1WZEisOLXsAAAAM/%EB%86%8D%EB%8B%B4%EA%B3%B0-jokebear.gif' },
      { nickname: 'User7', points: 54, profile: 'https://media.tenor.com/MPCPvINDMKUAAAAM/%E5%AF%B6%E8%B2%9D%E7%86%8A.gif' },
      { nickname: 'User6', points: 13213, profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' },
      { nickname: 'User54', points: 23, profile: 'https://media.bunjang.co.kr/product/253870277_2_1708354676_w360.jpg' },
      { nickname: 'User3', points: 542, profile: 'https://item.kakaocdn.net/do/5cabf3cc8b2e3541e9f652f06b25b1c6f43ad912ad8dd55b04db6a64cddaf76d' },
      { nickname: 'User54', points: 23, profile: 'https://item.kakaocdn.net/do/55637fa74e97ecbe8c86ac5e8d1d9f627e6f47a71c79378b48860ead6a12bf11' },
      { nickname: 'User54', points: 28, profile: 'https://media.bunjang.co.kr/product/253870277_%7Bcnt%7D_1708354676_w%7Bres%7D.jpg' },
      { nickname: 'User1', points: 101, profile: 'https://i.pinimg.com/236x/dd/f7/c7/ddf7c7ba7eb9736b84a64a565c8d4537.jpg' },
      { nickname: 'User3', points: 33, profile: 'https://i.pinimg.com/550x/c5/ae/3a/c5ae3a02a869f7381797046f59854d54.jpg' },
      { nickname: 'User5', points: 542, profile: 'https://i.pinimg.com/236x/91/55/13/91551360dc17bb62f7d23dc2a8ce7f4f.jpg' },
      { nickname: 'User5', points: 1420, profile: 'https://i.pinimg.com/236x/5f/ac/72/5fac726960c5d61599ec52a955fbf32b.jpg' },
      { nickname: 'User6', points: 9530, profile: 'https://image.blip.kr/v1/file/843689388f56fabb7cb64da9cfbc772f' },
      { nickname: 'User31', points: 200, profile: 'https://mblogthumb-phinf.pstatic.net/MjAyMTAxMTVfMTQ3/MDAxNjEwNzE1NjI5NDg3.zVoKymGokWDVyo4LR4DGX0hcD0tOhekkrYrQXcFgrvog.j-77qhOAo8HG_hLeeo8PM1UFSZ4UQVpww9sRTX-A-6Qg.JPEG.dltldud33/IMG_8779.JPG?type=w800' },
      { nickname: 'User2', points: 21, profile: null },
      { nickname: 'User5', points: 41, profile: null },
      { nickname: 'User7', points: 34, profile: null },
      { nickname: 'User6', points: 12213, profile: null },
      { nickname: 'User54', points: 22, profile: null },
      { nickname: 'User3', points: 535, profile: null },
      { nickname: 'User54', points: 111, profile: null },
      { nickname: 'User54', points: 22, profile: null },
    ];
  }

  rankings.sort((a, b) => b.points - a.points);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRankings = rankings.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getBackgroundColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'rgb(205, 127, 50)';
    return '';
  };

  return (
    <div className="ranking-container">
      <Confetti />
      <h2>🏆랭킹</h2>
      <table className="ranking-table">
        <tbody>
          {currentRankings.map((rank, index) => {
            const realIndex = indexOfFirstItem + index + 1;
            return (
              <tr
                key={index}
                className="ranking-item"
                style={{ backgroundColor: getBackgroundColor(realIndex) }}
              >
                <td>{realIndex}</td>
                <td className="profile-cell">
                  {rank.profile ? (
                    <img src={rank.profile} alt="프로필 사진" style={{ width: '50px', height: '50px' }} />
                  ) : (
                    <img src={profileImage} alt="기본 프로필 사진" style={{ width: '50px', height: '50px' }} />
                  )}
                </td>
                <td>{rank.nickname}</td>
                <td>{rank.points}</td>
              </tr>
            );
          })}
          {Array(itemsPerPage - currentRankings.length)
            .fill()
            .map((_, index) => (
              <tr key={`empty-${index}`} className="ranking-item">
                <td></td>
                <td className="profile-cell"></td>
                <td></td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentRankings.length < itemsPerPage}>
          다음
        </button>
      </div>
    </div>
  );
};

export default Rankings;
