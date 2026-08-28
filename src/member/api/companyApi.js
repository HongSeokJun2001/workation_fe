import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/";

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
    selectCompanyListApi,
    selectCompanyDetailApi,
    updateCompanyApi,
    createCompanyApi
};