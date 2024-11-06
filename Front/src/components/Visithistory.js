import React, { useEffect, useState } from 'react';
import api from '../axios'; // Axios import
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Visithistory.css';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, ChartDataLabels);

const Visithistory = () => {
    const introduction = "마이홈 소개글란";

    const [visitorData, setVisitorData] = useState({
        labels: [],
        datasets: [
            {
                label: "방문자 수",
                data: [], // 초기 데이터는 빈 배열
                borderColor: '#40C4FF',
                backgroundColor: '#40C4FF',
                pointBackgroundColor: '#40C4FF',
                pointRadius: 4,
                borderWidth: 1.5,
                fill: false,
                tension: 0.3, // 곡선 설정
            },
        ],
    });

    // 오늘부터 5일 전까지의 날짜를 계산하여 labels에 저장
    const generateLabels = () => {
        return Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (5 - i));
            return `${date.getMonth() + 1}/${date.getDate()}`; // 월/일 형식으로 반환
        });
    };

    // 컴포넌트가 마운트될 때 방문자 수 데이터를 가져오는 함수
    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                // 현재 사용자 정보를 가져오는 API 호출
                const userResponse = await api.get('/users/current');
                const visitorUsername = userResponse.data.nickname; // 사용자 이름 설정 (nickname으로 가정)

                // 방문자 수를 추가하는 API 호출
                await api.post('/myhome/add-visitor', { visitorUsername }); // 현재 사용자의 username을 넣어야 함

                // 방문자 수를 가져오는 API 호출
                const countResponse = await api.get('/myhome/visitor-count'); // 방문자 수 API 호출
                const visitorCountData = countResponse.data;

                // 방문자 수 데이터를 업데이트
                setVisitorData((prevState) => ({
                    ...prevState,
                    labels: generateLabels(),
                    datasets: [{
                        ...prevState.datasets[0],
                        data: visitorCountData, // 가져온 데이터로 업데이트
                    }],
                }));
            } catch (error) {
                console.error("Error fetching visitor count:", error);
            }
        };

        fetchVisitorData();
    }, []);

    const options = {
        responsive: true,
        layout: {
            padding: {
                top: 20,
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
            },
            datalabels: {
                color: visitorData.datasets[0].borderColor,
                anchor: 'end',
                align: 'top',
                formatter: (value) => value.toLocaleString(),
                font: {
                    size: 12,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#888',
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
        },
        elements: {
            line: {
                tension: 0.3,
            },
            point: {
                radius: 4,
                hoverRadius: 6,
            },
        },
    };

    return (
        <div className="visit-history-container">
            <h2 className="visit-history-title">소개</h2>
            <p className="visit-history-intro">{introduction}</p>
            <hr className="visit-history-divider" />
            <h2 className="visit-history-title">방문자</h2>
            <div className="visit-history-chart">
                <Line data={visitorData} options={options} />
            </div>
        </div>
    );
};

export default Visithistory;