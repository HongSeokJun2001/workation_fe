import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import { getAuthorization } from "./commonApi";

const BASE_URL = `${API_BASE_URL}/`;

// 로그인 화면 통계 조회용
const selectPlatformStatsApi = () => {

    return axios({
        url : `${ BASE_URL }public/platform/stats`,
        method : "get"
    });
};

const selectDashboardStatsApi = loginRole => {
    const path = loginRole === "SUPER"
        ? "admin/super/dashboard/stats"
        : loginRole === "COMPANY"
            ? "admin/company/dashboard/stats"
            : "employee/dashboard/stats";

    return axios({
        url : `${ BASE_URL }${ path }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

export { selectPlatformStatsApi, selectDashboardStatsApi };
