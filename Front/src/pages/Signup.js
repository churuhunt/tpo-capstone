import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('User ID:', userId);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Name:', name);
    console.log('Nickname:', nickname);
  };

  return (
    <div className="signuppagecontainer">
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <div className='btndiv'>
          <label htmlFor="userId">아이디:</label>
          <input
            type="text"
            id="userId"
            className='input1'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <button className="button1" type="button">중복확인</button>
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='btndiv'>
          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            className='input1'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <button type="button" className='button1'>중복확인</button>
        </div>
        <button className="button2" type="submit">가입하기</button>
      </form>
      <Link to="/login" className='aa'>이미 회원이신가요? 로그인하기</Link>
    </div>
    </div>
  );
};

export default Signup;
