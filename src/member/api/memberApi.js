import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/";

// 슈퍼관리자 -> 목록 조회용
const selectMemberListApi = (status = "ALL", target = "ALL") => {

    const response = axios({
        url : `${ BASE_URL }admin/super/member/list?status=${ status }&target=${ target }`,
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
        url : `${ BASE_URL }admin/company/member/admin-list?status=${ status }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const selectEmployeeListApi = (status = "ALL") => {

    return axios({
        url : `${ BASE_URL }admin/company/member/employee-list?status=${ status }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};


// 회원가입 회사 확인용
const checkCompanyApi = (businessNo, companyName) => {

    return axios({
        url : `${ BASE_URL }public/company/check`,
        method : "get",
        params : { businessNo, companyName }
    });
};

// 직원 로그인 아이디 중복 확인용
const checkEmployeeLoginIdApi = loginId => {

    return axios({
        url : `${ BASE_URL }public/employee/check-login-id`,
        method : "get",
        params : { loginId }
    });
};

// 직원 회원가입 신청용
const signupEmployeeApi = employee => {

    return axios({
        url : `${ BASE_URL }public/employee/signup`,
        method : "post",
        data : employee
    });
};

// 멤버 상세 조회용
const selectSuperAdminDetailApi = adminId => {

    return axios({
        url : `${ BASE_URL }admin/super/member/admin/${ adminId }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const selectCompanyAdminDetailApi = adminId => {

    return axios({
        url : `${ BASE_URL }admin/company/member/admin/${ adminId }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const selectEmployeeDetailApi = employeeId => {

    return axios({
        url : `${ BASE_URL }admin/company/member/employee/${ employeeId }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

// 멤버 정보 수정용
const updateSuperAdminApi = (adminId, admin) => {

    return axios({
        url : `${ BASE_URL }admin/super/member/admin/${ adminId }`,
        method : "put",
        data : admin,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const updateCompanyAdminApi = (adminId, admin) => {

    return axios({
        url : `${ BASE_URL }admin/company/member/admin/${ adminId }`,
        method : "put",
        data : admin,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const updateEmployeeApi = (employeeId, employee) => {

    return axios({
        url : `${ BASE_URL }admin/company/member/employee/${ employeeId }`,
        method : "put",
        data : employee,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

export {
    selectMemberListApi,
    selectCompanyAdminListApi,
    selectEmployeeListApi,
    checkCompanyApi,
    checkEmployeeLoginIdApi,
    signupEmployeeApi,
    selectSuperAdminDetailApi,
    selectCompanyAdminDetailApi,
    selectEmployeeDetailApi,
    updateSuperAdminApi,
    updateCompanyAdminApi,
    updateEmployeeApi
};