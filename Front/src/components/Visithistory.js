import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Visithistory.css';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, ChartDataLabels);

const Visithistory = () => {
    const introduction = "마이홈 소개글란";

    // 오늘부터 5일 전까지의 날짜를 계산하여 labels에 저장
    const labels = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (5 - i));
        return `${date.getMonth() + 1}/${date.getDate()}`; // 월/일 형식으로 반환
    });

    const visitorData = {
        labels: labels,
        datasets: [
            {
                label: "방문자 수",
                data: [1331, 1370, 1203, 1131, 1060, 1150], // 예시 데이터
                borderColor: '#40C4FF',
                backgroundColor: '#40C4FF',
                pointBackgroundColor: '#40C4FF',
                pointRadius: 4,
                borderWidth: 1.5,
                fill: false,
                tension: 0.3, // 곡선 설정
            },
        ],
    };

    const options = {
        responsive: true,
        layout: {
            padding: {
                top: 20, // 그래프 위쪽 여백을 추가
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
            },
            datalabels: {
                color: visitorData.datasets[0].borderColor, // 숫자 색상을 그래프 색상과 동일하게 설정
                anchor: 'end',
                align: 'top',
                formatter: (value) => value.toLocaleString(), // 값에 콤마 추가
                font: {
                    size: 12,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // x축 격자선 숨김
                },
                ticks: {
                    color: '#888', // x축 색상
                },
            },
            y: {
                grid: {
                    display: false, // y축 격자선 숨김
                },
                ticks: {
                    display: false, // y축 숫자 레이블 숨김
                },
            },
        },
        elements: {
            line: {
                tension: 0.3, // 선의 곡률을 높여 부드러운 곡선으로 변경
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