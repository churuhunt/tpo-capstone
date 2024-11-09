import React, { useState, useEffect } from 'react';
import './ActivityDashboard.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler  } from 'chart.js';
import api from '../axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const ActivityDashboard = ({stats}) => {
    const [displayStats, setDisplayStats] = useState({
        posts: 0,
        comments: 0,
        likes: 0,
        dislikes: 0,
    });


    useEffect(() => {
        const animateStats = (key, target) => {
            const increment = target / 50; // 애니메이션 속도 조절
            const interval = setInterval(() => {
                setDisplayStats((prev) => {
                    const newValue = Math.min(prev[key] + increment, target);
                    if (newValue === target) clearInterval(interval);
                    return { ...prev, [key]: newValue };
                });
            }, 20); // 애니메이션 속도 조절
        };

        animateStats('posts', stats.posts);
        animateStats('comments', stats.comments);
        animateStats('likes', stats.likes);
        animateStats('dislikes', stats.dislikes);
    }, [stats]);

    const rankData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
        datasets: [
            {
                label: '인기 게시글 순위',
                data: [1, 3, 2, 4, 1, 5],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4caf50',
            },
        ],
    };

    const rankOptions = {
        responsive: true,
        scales: {
            y: {
                reverse: true,
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}위`,
                },
            },
        },
    };

    return (
        <div className="Activity-dashboard">
            <h2 className="Activity-dashboard-title">활동 통계</h2>
            <div className="Activity-dashboard-stats">
                <div className="Activity-dashboard-card">
                    <span className="Activity-dashboard-icon">📝</span>
                    <div className="Activity-dashboard-info">
                        <h3>{Math.floor(displayStats.posts)}</h3>
                        <p>게시글 작성 수</p>
                    </div>
                </div>
                <div className="Activity-dashboard-card">
                    <span className="Activity-dashboard-icon">💬</span>
                    <div className="Activity-dashboard-info">
                        <h3>{Math.floor(displayStats.comments)}</h3>
                        <p>작성한 댓글 수</p>
                    </div>
                </div>
                <div className="Activity-dashboard-card">
                    <span className="Activity-dashboard-icon">👍</span>
                    <div className="Activity-dashboard-info">
                        <h3>{Math.floor(displayStats.likes)}</h3>
                        <p>누적 추천 수</p>
                    </div>
                </div>
                <div className="Activity-dashboard-card">
                    <span className="Activity-dashboard-icon">👎</span>
                    <div className="Activity-dashboard-info">
                        <h3>{Math.floor(displayStats.dislikes)}</h3>
                        <p>누적 비추천 수</p>
                    </div>
                </div>
            </div>
            <div className="Activity-dashboard-chart">
                <h3>인기 게시글 순위 추이</h3>
                <Line data={rankData} options={rankOptions} />
            </div>
        </div>
    );
};

export default ActivityDashboard;