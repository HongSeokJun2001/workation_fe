import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/";

// 슈퍼관리자 -> 목록 조회용
const selectMemberListApi = (status = "ALL", target = "ALL", cpage = 1) => {

    const response = axios({
        url : `${ BASE_URL }admin/super/member/list?status=${ status }&target=${ target }&cpage=${ cpage }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });

    return response;
};

// 본사관리자 -> 목록 조회용
const selectCompanyAdminListApi = (status = "ALL", cpage = 1) => {

    return axios({
        url : `${ BASE_URL }admin/company/member/admin-list?status=${ status }&cpage=${ cpage }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const createCompanyAdminApi = admin => {

    return axios({
        url : `${ BASE_URL }admin/company/member/admin`,
        method : "post",
        data : admin,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const createCompanyAdminBySuperApi = admin => {

    return axios({
        url : `${ BASE_URL }admin/super/member/company-admin`,
        method : "post",
        data : admin,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const createSuperAdminApi = admin => {

    return axios({
        url : `${ BASE_URL }admin/super/member/admin`,
        method : "post",
        data : admin,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const selectEmployeeListApi = (status = "ALL", isProgressed = "ALL", cpage = 1) => {

    return axios({
        url : `${ BASE_URL }admin/company/member/employee-list?status=${ status }&isProgressed=${ isProgressed }&cpage=${ cpage }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
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

const requestEmployeeLoginIdApi = employee => {

    return axios({
        url : `${ BASE_URL }public/employee/recovery/login-id/request`,
        method : "post",
        data : employee
    });
};

const requestEmployeePasswordResetApi = employee => {

    return axios({
        url : `${ BASE_URL }public/employee/recovery/password/request`,
        method : "post",
        data : employee
    });
};

const verifyEmployeeRecoveryApi = verification => {

    return axios({
        url : `${ BASE_URL }public/employee/recovery/verify`,
        method : "post",
        data : verification
    });
};

const resetEmployeePasswordApi = resetRequest => {

    return axios({
        url : `${ BASE_URL }public/employee/recovery/password/reset`,
        method : "post",
        data : resetRequest
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

const selectMyEmployeeDetailApi = () => {

    return axios({
        url : `${ BASE_URL }employee/my-info`,
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

const approveEmployeeApi = employeeId => {

    return axios({
        url : `${ BASE_URL }admin/company/member/employee/${ employeeId }/approval`,
        method : "put",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const rejectEmployeeApi = employeeId => {

    return axios({
        url : `${ BASE_URL }admin/company/member/employee/${ employeeId }/rejection`,
        method : "delete",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

const updateMyEmployeeApi = employee => {

    return axios({
        url : `${ BASE_URL }employee/my-info`,
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
    createCompanyAdminApi,
    createCompanyAdminBySuperApi,
    createSuperAdminApi,
    selectEmployeeListApi,
    checkEmployeeLoginIdApi,
    signupEmployeeApi,
    requestEmployeeLoginIdApi,
    requestEmployeePasswordResetApi,
    verifyEmployeeRecoveryApi,
    resetEmployeePasswordApi,
    selectSuperAdminDetailApi,
    selectCompanyAdminDetailApi,
    selectEmployeeDetailApi,
    selectMyEmployeeDetailApi,
    updateSuperAdminApi,
    updateCompanyAdminApi,
    updateEmployeeApi,
    approveEmployeeApi,
    rejectEmployeeApi,
    updateMyEmployeeApi
};