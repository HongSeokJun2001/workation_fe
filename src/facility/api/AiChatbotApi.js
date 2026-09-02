import axios from "axios";

const BASE_URL = "http://localhost:8007/workation";

// AI 채팅 메시지 전송 API (인증 불필요)
const sendChatMessageApi = (message) => {
    return axios({
        url: `${BASE_URL}/chat`,
        method: "post",
        data: {
            message: message
        },
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export { sendChatMessageApi };