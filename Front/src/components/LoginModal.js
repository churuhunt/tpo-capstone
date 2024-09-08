import React from 'react';
import './LoginModal.css';
import { Link } from 'react-router-dom'; 

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = React.useState(''); 
  const [password, setPassword] = React.useState(''); 
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="modal">
      <div className="modal-content">
         <span className="close" onClick={closeModal}>×</span>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">ID:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">PW:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='loginbutton' type="submit">로그인</button>
          <Link to="/signup">회원가입</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
