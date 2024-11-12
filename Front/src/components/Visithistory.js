import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Visithistory.css';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, ChartDataLabels);

const Visithistory = ({ visitorCount, visitorDataPoints, introduction: initialIntroduction, onSaveIntroduction, isEditable }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localIntroduction, setLocalIntroduction] = useState(initialIntroduction);

    useEffect(() => {
        setLocalIntroduction(initialIntroduction); // 초기 소개글 설정
    }, [initialIntroduction]);

    // handleSaveClick에서 onSaveIntroduction 호출
    const handleSaveClick = () => {
        onSaveIntroduction(localIntroduction); // 부모 컴포넌트로 저장 요청
        setIsEditing(false);
    };

    return (
        <div className="visit-history-container">
            <div className="visit-history-container1">
                <div className="visit-history-container1-1">
                    <h2 className="visit-history-title">소개</h2>
                    {isEditable && (isEditing ? (
                        <button onClick={handleSaveClick}>Save</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    ))}
                </div>
                {isEditing ? (
                    <textarea
                        className="visit-history-intro-edit"
                        value={localIntroduction}
                        onChange={(e) => setLocalIntroduction(e.target.value)}
                    />
                ) : (
                    <p className="visit-history-intro">{localIntroduction}</p>
                )}
            </div>
            <div className="visit-history-container2">
                <hr className="visit-history-divider" />
                <h2 className="visit-history-title">방문자</h2>
                <div className="visit-history-chart">
                    <Line data={{
                        labels: Array.from({ length: 6 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (5 - i));
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }),
                        datasets: [
                            {
                                label: "방문자 수",
                                data: visitorDataPoints.length > 0 ? visitorDataPoints : [0, 0, 0, 0, 0, 0],
                                borderColor: '#40C4FF',
                                backgroundColor: '#40C4FF',
                                pointBackgroundColor: '#40C4FF',
                                pointRadius: 4,
                                borderWidth: 1.5,
                                fill: false,
                                tension: 0.3,
                            },
                        ],
                    }} options={{
                        responsive: true,
                        layout: { padding: { top: 20 } },
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true },
                            datalabels: {
                                color: '#40C4FF',
                                anchor: 'end',
                                align: 'top',
                                formatter: (value) => value.toLocaleString(),
                                font: { size: 12, weight: 'bold' },
                            },
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { color: '#888' } },
                            y: { grid: { display: false }, ticks: { display: false } },
                        },
                        elements: { line: { tension: 0.3 }, point: { radius: 4, hoverRadius: 6 } },
                    }} />
                </div>
            </div>
        </div>
    );
};


export default Visithistory;
