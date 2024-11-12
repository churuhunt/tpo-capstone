import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client' instead of 'react-dom'
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Topbar from './components/Topbar';
import Mainpage from './pages/Mainpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Store from './pages/Store';
import Ranking from './pages/Ranking';
import MyMenu from './pages/Mymenu';
import PostForm from './pages/PostForm';
import Informationboard from './pages/Informationboard';
import Community from './pages/Community';
import PostView from './pages/PostView';
import ProfileManagement from './pages/ProfileManagement';
import ErrorPage from './pages/ErrorPage';
import ScrollToTop from './components/ScrollToTop';
import Popularity from './pages/Popularity';
import Recommendedboard from './pages/Recommendedboard';
import Notification from './pages/Notification';
import ItemRegistrationForm from "./pages/ItemRegistrasionForm";
import FreePage from "./pages/FreePage";
import DailyLook from "./pages/DailyLook";
import QuestionsPage from "./pages/QuestionsPage";
const App = () => {
  return (
    <div className="app-container">
      <Router>
        <ScrollToTop targetPaths={['/postview/:postId', '/informationboard', '/write']} /> {/*페이지 전환 시 스크롤 위로 둘 페이지 목록*/}
        <Topbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/main" element={<Mainpage />} />
            <Route path="/informationboard" element={<Informationboard />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/store" element={<Store />} />
            <Route path="/mymenu/:userId" element={<MyMenu />} />
            <Route path="/write" element={<PostForm />} />
            <Route path="/postview/:postId" element={<PostView />} />
            <Route path="/profile" element={<ProfileManagement />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/popularity" element={<Popularity />} />
            <Route path="/recommendedboard" element={<Recommendedboard />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/itemregistrationForm" element={<ItemRegistrationForm />} />
            <Route path="/free" element={<FreePage />} />
            <Route path="/DailyLook" element={<DailyLook />} />
            <Route path="/Questions" element={<QuestionsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot instead of render
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);
reportWebVitals();
