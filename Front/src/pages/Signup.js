import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const navigate = useNavigate();

  const handleUserIdCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/check-userId?userId=${userId}`);
      if (response.status === 200) {
        alert("사용 가능한 아이디입니다.");
        setIsUserIdChecked(true);
      }
    } catch (error) {
      alert("이미 사용 중인 아이디입니다.");
      setIsUserIdChecked(false);
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/check-nickname?nickname=${nickname}`);
      if (response.status === 200) {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      }
    } catch (error) {
      alert("이미 사용 중인 닉네임입니다.");
      setIsNicknameChecked(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isUserIdChecked) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    if (!isNicknameChecked) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup', {
        userId,
        password,
        name,
        nickname,
      });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    }
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
