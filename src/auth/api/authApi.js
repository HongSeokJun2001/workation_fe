import axios from "axios";
import { API_BASE_URL } from "../../common/api/apiConfig";

const BASE_URL = `${API_BASE_URL}/auth`;

// 인증 요청용
const loginMemberApi = member => {

    const response = axios({
        url : `${ BASE_URL }/login`,
        method : "post",
        data : member
    });

    return response;
};

export { loginMemberApi };