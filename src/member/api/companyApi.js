import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/";

// 활성 고객사 목록 조회
const selectActiveCompanyListApi = () => {

    return axios({
        url : `${ BASE_URL }admin/super/company-list`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

// 회원가입 고객사 확인
const checkCompanyApi = (businessNo, companyName) => {

    return axios({
        url : `${ BASE_URL }public/company/check`,
        method : "get",
        params : { businessNo, companyName }
    });
};

// 고객사 목록 조회
const selectCompanyListApi = (status = "ALL", cpage = 1) => {
    
    const response = axios({
        url : `${ BASE_URL }admin/super/company/list?status=${ status }&cpage=${ cpage }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });

    return response;
};

// 고객사 상세 조회
const selectCompanyDetailApi = companyId => {

    return axios({
        url : `${ BASE_URL }admin/super/company/${ companyId }`,
        method : "get",
        headers : {
            Authorization : getAuthorization()
        }
    });
};

// 고객사 정보 수정
const updateCompanyApi = (companyId, company) => {

    return axios({
        url : `${ BASE_URL }admin/super/company/${ companyId }`,
        method : "put",
        data : company,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

// 고객사 등록
const createCompanyApi = company => {

    return axios({
        url : `${ BASE_URL }admin/super/new-company`,
        method : "post",
        data : company,
        headers : {
            Authorization : getAuthorization()
        }
    });
};

export {
    selectActiveCompanyListApi,
    checkCompanyApi,
    selectCompanyListApi,
    selectCompanyDetailApi,
    updateCompanyApi,
    createCompanyApi
};