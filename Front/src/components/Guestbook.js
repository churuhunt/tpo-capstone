import React, { useState } from 'react';
import './Guestbook.css';

const Guestbook = () => {
    const [messages, setMessages] = useState([]); // 방명록 메시지 목록 상태

    // 방명록에 새로운 메시지 추가
    const addMessage = (newMessage) => {
        setMessages([...messages, newMessage]);
    };

    // 방명록 메시지를 표시하는 함수
    const renderMessages = () => {
        if (messages.length === 0) {
            return <p>아직 방명록이 없습니다.</p>;
        }
        return (
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        );
    };

    // 새로운 메시지를 입력하는 폼
    const [newMessage, setNewMessage] = useState(''); // 입력된 새로운 메시지
    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        addMessage(newMessage);
        setNewMessage('');
    };

    return (
        <div>
            <h2>방명록</h2>
            <div>
                {renderMessages()}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="방명록을 남겨주세요"
                />
                <button type="submit">등록</button>
            </form>
        </div>
    );
}

export default Guestbook;
