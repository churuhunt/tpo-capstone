import React, { useEffect, useState } from 'react';
import api from '../axios'; // Axios import
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Visithistory.css';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, ChartDataLabels);

const Visithistory = ({ visitorCount, visitorDataPoints }) => {
    const introduction = "마이홈 소개글란";
    const [visitorUsername, setVisitorUsername] = useState(null);  // 현재 사용자 이름 상태값

       useEffect(() => {
        // 현재 사용자 정보 가져오기
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/users/current');
                const username = response.data.nickname; // 가져온 사용자의 이름 저장
                console.log( response.data.nickname)
                setVisitorUsername(username);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        // 가져온 사용자 이름으로 방문 기록 남기기
        const logVisit = async (username) => {
            try {
                await api.post('/myhome/add-visitor', null, {
                    params: { visitorUsername: username },
                });
                console.log("Visitor logged successfully");
            } catch (error) {
                console.error("Error logging visitor:", error);
            }
        };


        // 컴포넌트가 처음 로드될 때 실행
        fetchCurrentUser().then(() => {
            if (visitorUsername) {
                logVisit(visitorUsername);
            }
        });
    }, [visitorUsername]);

    // 최근 5일간 날짜 생성
    const labels = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (5 - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const visitorData = {
        labels: labels,
        datasets: [
            {
                label: "방문자 수",
                data: visitorDataPoints.length > 0 ? visitorDataPoints : [0, 0, 0, 0, 0, 0], // 방문자 수 데이터
                borderColor: '#40C4FF',
                backgroundColor: '#40C4FF',
                pointBackgroundColor: '#40C4FF',
                pointRadius: 4,
                borderWidth: 1.5,
                fill: false,
                tension: 0.3,
            },
        ],
    };

const options = {
    responsive: true,
    layout: {
        padding: {
            top: 20,
        },
    },
    plugins: {
        legend: {
            display: false, // 범례 숨기기
        },
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
            <div className="visit-history-container1">
            <div className="visit-history-container1-1">
            <h2 className="visit-history-title">소개</h2>
            <button>Edit</button>
            </div>
            <p className="visit-history-intro">{introduction}</p></div>
            <div className="visit-history-container2">
            <hr className="visit-history-divider" />
            <h2 className="visit-history-title">방문자</h2>
            {/*<p className="visitor-count">{visitorCount.toLocaleString()}</p>*/}
            <div className="visit-history-chart">
                <Line data={visitorData} options={options} />
            </div></div>
        </div>
    );
};

export default Visithistory;