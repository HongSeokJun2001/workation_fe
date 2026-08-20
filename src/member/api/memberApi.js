import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/";

// 슈퍼관리자 -> 목록 조회용
const selectMemberListApi = (status = "ALL", target = "ALL") => {

    const response = axios({
        url : `${ BASE_URL }admin/super-admin/list?status=${ status }&target=${ target }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });

    return response;
};


// 본사관리자 -> 목록 조회용
const selectCompanyAdminListApi = (status = "ALL") => {

    return axios({
        url : `${ BASE_URL }admin/company-admin/list?status=${ status }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const selectEmployeeListApi = (status = "ALL") => {

    return axios({
        url : `${ BASE_URL }admin/employee/list?status=${ status }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

// 멤버 상세 조회용

// 멤버 정보 수정용

// 멤버 탈퇴 처리용

export { selectMemberListApi, selectCompanyAdminListApi, selectEmployeeListApi };