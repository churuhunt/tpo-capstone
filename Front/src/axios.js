// src/axios.js
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080/api',  // API의 기본 URL
    timeout: 50000, // 요청 타임아웃 시간 설정 (필요에 따라 조정 가능)
});

// 요청 인터셉터 설정
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // localStorage에서 JWT 토큰 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 토큰이 있을 때만 Authorization 헤더 추가
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;