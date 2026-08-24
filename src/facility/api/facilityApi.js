import axios from "axios";

const BASE_URL = "http://localhost:8007/workation/api/facilities";

// 워케이션 시설 목록 조회용
const selectFacilityListApi = cpage => {

    const response = axios({
        url : `${BASE_URL}`,
        method : "get",
        params : {
            cpage : cpage
        }
    });

    return response;
};

// 워케이션 시설 검색용
const searchFacilityListApi = (cpage, keyword) => {

    const response = axios({
        url : `${BASE_URL}/search`,
        method : "get",
        params : {
            cpage : cpage,
            keyword : keyword
        }
    });

    return response;
};

// 워케이션 시설 등록용 (파일 업로드 포함)
const insertFacilityApi = formData => {

    const response = axios({
        url : `${BASE_URL}`,
        method : "post",
        data : formData,
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    });

    return response;
};

// 워케이션 시설 상세 조회용 (상세보기 페이지)
const selectFacilityApi = facilityId => {
    
    const response = axios({
        url : `${BASE_URL}/${facilityId}`,
        method : "get"
    });

    return response;
};

// 워케이션 시설 상세 조회용2 (수정하기 폼 진입 시)
const selectFacilityFormApi = facilityId => {

    const response = axios({
        url : `${BASE_URL}/${facilityId}/form`,
        method : "get"
    });

    return response;
}

// 워케이션 시설 수정용
const updateFacilityApi = (facilityId, formData) => {
    
    const response = axios({
        url : `${BASE_URL}/${facilityId}`,
        method : "put",
        data : formData,
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    });

    return response;
};

// 워케이션 시설 삭제용
const deleteFacilityApi = facilityId => {

    const response = axios({
        url : `${BASE_URL}/${facilityId}`,
        method : "delete"
    });

    return response;
}

export {selectFacilityListApi, searchFacilityListApi, insertFacilityApi, selectFacilityApi, selectFacilityFormApi, updateFacilityApi, deleteFacilityApi};
export {BASE_URL};