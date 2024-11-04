// src/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
});

// 요청 인터셉터 설정
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log("토큰을 헤더에 추가합니다:", token); // 콘솔에 토큰 출력하여 확인
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;