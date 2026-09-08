import axios from "axios";
import { API_BASE_URL } from "../../common/api/apiConfig";

const BASE_URL = API_BASE_URL;

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