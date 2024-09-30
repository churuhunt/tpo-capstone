import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const openSignUp = () => {
    setIsSignUp(true);
  };

  const openSignIn = () => {
    setIsSignUp(false);
  };

  return (
    <div className="login-container">
      <div className={`login-overlay ${isSignUp ? 'login-open-sign-up' : 'login-open-sign-in'}`}>
        <div className="login-sign-in">
          <h1>회원가입회원가입</h1>
          <p>bbbbbbbbbbbbbbbbbbbb</p>
          <button className="login-switch-button" onClick={openSignIn}>로그인</button>
        </div>
        <div className="login-sign-up">
          <h1>로그인로그인</h1>
          <p>aaaaaaaaaaaaaaaaaaaaaaa</p>
          <button className="login-switch-button" onClick={openSignUp}>회원가입</button>
        </div>
      </div>
      <div className="login-form">
        <div className={`login-sign-in ${isSignUp ? 'login-form-left-slide-out' : 'login-form-left-slide-in'}`} style={{ display: isSignUp ? 'none' : 'flex' }}>
          <h1>로그인</h1>
          <div className="login-social-media-buttons">
            <div className="login-icon">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
              </svg>
            </div>
            <div className="login-icon">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M23,11H21V9H19V11H17V13H19V15H21V13H23M8,11V13.4H12C11.8,14.4 10.8,16.4 8,16.4C5.6,16.4 3.7,14.4 3.7,12C3.7,9.6 5.6,7.6 8,7.6C9.4,7.6 10.3,8.2 10.8,8.7L12.7,6.9C11.5,5.7 9.9,5 8,5C4.1,5 1,8.1 1,12C1,15.9 4.1,19 8,19C12,19 14.7,16.2 14.7,12.2C14.7,11.7 14.7,11.4 14.6,11H8Z" />
              </svg>
            </div>
            <div className="login-icon">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M21,21H17V14.25C17,13.19 15.81,12.31 14.75,12.31C13.69,12.31 13,13.19 13,14.25V21H9V9H13V11C13.66,9.93 15.36,9.24 16.5,9.24C19,9.24 21,11.28 21,13.75V21M7,21H3V9H7V21M5,3A2,2 0 0,1 7,5A2,2 0 0,1 5,7A2,2 0 0,1 3,5A2,2 0 0,1 5,3Z" />
              </svg>
            </div>
          </div>
          {/*<p className="login-small">또는</p>*/}
          <form id="login-sign-in-form">
            <input type="email" placeholder="아이디" />
            <input type="password" placeholder="비밀번호" />
            <p className="login-forgot-password">아이디/비밀번호 찾기</p>
            <button className="login-control-button login-in">로그인</button>
          </form>
        </div>
        <div className={`login-sign-up ${isSignUp ? 'login-form-right-slide-in' : 'login-form-right-slide-out'}`} style={{ display: isSignUp ? 'flex' : 'none' }}>
          <h1>회원가입</h1>
          {/*<div className="login-social-media-buttons">
            <div className="login-icon">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
              </svg>
            </div>
            <div className="login-icon">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M23,11H21V9H19V11H17V13H19V15H21V13H23M8,11V13.4H12C11.8,14.4 10.8,16.4 8,16.4C5.6,16.4 3.7,14.4 3.7,12C3.7,9.6 5.6,7.6 8,7.6C9.4,7.6 10.3,8.2 10.8,8.7L12.7,6.9C11.5,5.7 9.9,5 8,5C4.1,5 1,8.1 1,12C1,15.9 4.1,19 8,19C12,19 14.7,16.2 14.7,12.2C14.7,11.7 14.7,11.4 14.6,11H8Z" />
              </svg>
            </div>
            <div className="login-icon">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M21,21H17V14.25C17,13.19 15.81,12.31 14.75,12.31C13.69,12.31 13,13.19 13,14.25V21H9V9H13V11C13.66,9.93 15.36,9.24 16.5,9.24C19,9.24 21,11.28 21,13.75V21M7,21H3V9H7V21M5,3A2,2 0 0,1 7,5A2,2 0 0,1 5,7A2,2 0 0,1 3,5A2,2 0 0,1 5,3Z" />
              </svg>
            </div>
          </div> */}
          {/*<p className="login-small">또는</p>*/}
          <form id="login-sign-up-form">
            <input type="email" placeholder="아이디" />
            <input type="text" placeholder="이름" />
            <input type="text" placeholder="닉네임" />
            <input type="password" placeholder="비밀번호" />
            <input type="password2" placeholder="비밀번호 확인" />
            <button className="login-control-button login-up">가입하기</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
