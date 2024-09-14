import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Topbar from './components/Topbar';
import Mainpage from './pages/Mainpage';
import Notification from './pages/Notification';
import Popularity from './pages/Popularity';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Store from './pages/Store';
import Ranking from './pages/Ranking';
import MyMenu from './pages/Mymenu';
import PostForm from './pages/PostForm';
import Community from './pages/community';
import Informationboard from './pages/Informationboard';
import Recommendedboard from './pages/Recommendedboard';


const App = () => {
  return (
    <div className="app-container">
      <Router>
        <Topbar />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/main" element={<Mainpage />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/popularity" element={<Popularity />} />
          <Route path="/community" element={<Community />} />
          <Route path="/informationboard" element={<Informationboard />} />
          <Route path="/recommendedboard" element={<Recommendedboard />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Store />} />
          <Route path="/mymenu" element={<MyMenu />} />
          <Route exact path="/write" element={<PostForm />} />
        </Routes>
      </Router>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();