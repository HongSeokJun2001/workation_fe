import axios from "axios";

const BASE_URL = "http://localhost:8007/workation/";

// 로그인 화면 통계 조회용
const selectPlatformStatsApi = () => {

    return axios({
        url : `${ BASE_URL }public/platform/stats`,
        method : "get"
    });
};

export { selectPlatformStatsApi };
