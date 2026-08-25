import axios from "axios";

const BASE_URL = "http://localhost:8007/workation/auth";

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