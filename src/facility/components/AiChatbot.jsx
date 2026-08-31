import React, { useEffect, useState, useRef } from "react";
import "../css/AiChatbot.css";
import { sendChatMessageApi } from "../api/AiChatbotApi";

function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: "ai", text: "안녕하세요! 원하시는 분위기나 조건을 말씀해주시면 워케이션 시설을 추천해드릴게요" }
    ]);
    const [loading, setLoading] = useState(false);
    
    const chatEndRef = useRef(null);

    // 새 메시지 추가 시 자동 스크롤 하단 이동
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput("");
        setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
        setLoading(true);

        try {
            // Axios API 함수 호출
            const response = await sendChatMessageApi(userMsg);

            if (response.status === 200) {
                setMessages((prev) => [...prev, { sender: "ai", text: response.data.reply }]);
            } else {
                setMessages((prev) => [...prev, { sender: "ai", text: "죄송합니다. 응답을 가져오지 못했습니다." }]);
            }
        } catch (error) {
            console.error("AI 통신 실패: ", error);
            setMessages((prev) => [...prev, { sender: "ai", text: "서버와 통신 중 오류가 발생했습니다." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chatbot-container">
            {/* 채팅 창 영역 */}
            {isOpen && (
                <div className="ai-chatbot-window">
                    <div className="ai-chatbot-header">
                        <span>워케이션 AI 추천 매니저</span>
                        <button onClick={handleToggle} className="ai-chatbot-close-btn">X</button>
                    </div>

                    <div className="ai-chatbot-body">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`ai-chatbot-bubble ${msg.sender === "user" ? "user" : "ai"}`}
                            >
                                {msg.text.split("\n").map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}<br />
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                        {loading && (
                            <div className="ai-chatbot-bubble ai">
                                추천 시설을 찾는 중...
                            </div>
                        )}
                        <div ref={chatEndRef} />    
                    </div>

                    <form onSubmit={handleSend} className="ai-chatbot-footer">
                        <input 
                            type="text"
                            placeholder="예: 바다 보이고 작업하기 좋은 곳 추천해줘"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="ai-chatbot-input"
                        />
                        <button type="submit" className="ai-chatbot-send-btn" disabled={loading}>
                            전송
                        </button>
                    </form>
                </div>
            )}

            {/* 원형 플로팅 토글 버튼 */}
            <button onClick={handleToggle} className="ai-chatbot-toggle-btn">
                {isOpen ? "X" : "💬"}
            </button>
        </div>
    );
}

export default AiChatbot;