import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        userId,
        password,
      });

      if (response.status === 200) {
        // JWT 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('nickname', response.data.nickname); // 서버에서 받은 닉네임 저장
        alert('로그인 성공!');
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
      console.error('로그인 실패:', error);
    }
  };



  const openSignUp = () => {
    navigate('/signup');  // '/signup' 경로로 이동
  };

  const openSignIn = () => {
    setIsSignUp(false);
  };

  return (
    <div className='Login-page-container1'> {/* 최상위 배경 컨테이너 */}
      <div className="Login-page-container2"> {/* 로그인 박스 */}
        <div className={`Login-page-overlay ${isSignUp ? 'Login-page-open-sign-up' : 'Login-page-open-sign-in'}`}>
          <div className="Login-page-sign-in">
            <h1>TPO 회원가입</h1>
            <p>Time Place Occasion</p>
            <button className="Login-page-switch-button" onClick={handleLogin}>로그인</button>
          </div>
          <div className="Login-page-sign-up">
            <h1>TPO 로그인</h1>
            <p>Time Place Occasion</p>
            <button className="Login-page-switch-button" onClick={openSignUp}>회원가입</button>
          </div>
        </div>
        <div className="Login-page-form">
          <div className={`Login-page-sign-in ${isSignUp ? 'Login-page-form-left-slide-out' : 'Login-page-form-left-slide-in'}`} style={{ display: isSignUp ? 'none' : 'flex' }}>
            <h1>로그인</h1>
            <div className="Login-page-social-media-buttons">
              <div className="Login-page-icon">
                <svg viewBox="0 0 24 24">
                  <path fill="#000000" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
                </svg>
              </div>
              <div className="Login-page-icon">
                <svg viewBox="0 0 24 24">
                  <path fill="#000000" d="M23,11H21V9H19V11H17V13H19V15H21V13H23M8,11V13.4H12C11.8,14.4 10.8,16.4 8,16.4C5.6,16.4 3.7,14.4 3.7,12C3.7,9.6 5.6,7.6 8,7.6C9.4,7.6 10.3,8.2 10.8,8.7L12.7,6.9C11.5,5.7 9.9,5 8,5C4.1,5 1,8.1 1,12C1,15.9 4.1,19 8,19C12,19 14.7,16.2 14.7,12.2C14.7,11.7 14.7,11.4 14.6,11H8Z" />
                </svg>
              </div>
              <div className="Login-page-icon">
                <svg viewBox="0 0 24 24">
                  <path fill="#000000" d="M21,21H17V14.25C17,13.19 15.81,12.31 14.75,12.31C13.69,12.31 13,13.19 13,14.25V21H9V9H13V11C13.66,9.93 15.36,9.24 16.5,9.24C19,9.24 21,11.28 21,13.75V21M7,21H3V9H7V21M5,3A2,2 0 0,1 7,5A2,2 0 0,1 5,7A2,2 0 0,1 3,5A2,2 0 0,1 5,3Z" />
                </svg>
              </div>
            </div>
            <form id="Login-page-sign-in-form">

              <div>
                <label htmlFor="userId">아이디</label>
                <input
                    type="email"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
              </div>

              <div>
                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <p className="Login-page-forgot-password">아이디/비밀번호 찾기</p>
              <button className="Login-page-control-button Login-page-in" onClick={handleLogin}>로그인</button>
            </form>
          </div>
          <div
              className={`Login-page-sign-up ${isSignUp ? 'Login-page-form-right-slide-in' : 'Login-page-form-right-slide-out'}`}
              style={{display: isSignUp ? 'flex' : 'none'}}>
            <h1>회원가입</h1>
            <form id="Login-page-sign-up-form">
            <input type="email" placeholder="아이디" />
              <input type="text" placeholder="이름" />
              <input type="text" placeholder="닉네임" />
              <input type="password" placeholder="비밀번호" />
              <input type="password" placeholder="비밀번호 확인" />
              <button className="Login-page-control-button Login-page-up">가입하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
