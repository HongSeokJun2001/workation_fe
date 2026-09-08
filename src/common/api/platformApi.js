import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const BASE_URL = `${API_BASE_URL}/`;

// 로그인 화면 통계 조회용
const selectPlatformStatsApi = () => {

    return axios({
        url : `${ BASE_URL }public/platform/stats`,
        method : "get"
    });
};

export { selectPlatformStatsApi };
