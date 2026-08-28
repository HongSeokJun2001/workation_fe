import axios from "axios";
import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation";

// 워케이션 시설 목록 조회용
const selectFacilityListApi = (cpage, sort = "LATEST") => {

    const response = axios({
        url : `${BASE_URL}/facilities`,
        method : "get",
        params : {
            cpage : cpage,
            sort : sort
        },
        headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;
};

// 워케이션 시설 검색용
const searchFacilityListApi = (cpage, keyword, sort = "LATEST") => {

    const response = axios({
        url : `${BASE_URL}/facilities/search`,
        method : "get",
        params : {
            cpage : cpage,
            keyword : keyword,
            sort : sort
        },
        headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;
};

// 워케이션 시설 등록용 (파일 업로드 포함)
const insertFacilityApi = formData => {

    const response = axios({
        url : `${BASE_URL}/facilities`,
        method : "post",
        data : formData,
        headers : {
            "Content-Type" : "multipart/form-data",
            "Authorization" : getAuthorization()
        }
    });

    return response;
};

// 워케이션 시설 상세 조회용 (상세보기 페이지)
const selectFacilityApi = facilityId => {
    
    const response = axios({
        url : `${BASE_URL}/facilities/${facilityId}`,
        method : "get",
        headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;
};

// 워케이션 시설 상세 조회용2 (수정하기 폼 진입 시)
const selectFacilityFormApi = facilityId => {

    const response = axios({
        url : `${BASE_URL}/facilities/${facilityId}/form`,
        method : "get",
        headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;
}

// 워케이션 시설 수정용
const updateFacilityApi = (facilityId, formData) => {
    
    const response = axios({
        url : `${BASE_URL}/facilities/${facilityId}`,
        method : "put",
        data : formData,
        headers : {
            "Content-Type" : "multipart/form-data",
            "Authorization" : getAuthorization()
        }
    });

    return response;
};

// 워케이션 시설 삭제용
const deleteFacilityApi = facilityId => {

    const response = axios({
        url : `${BASE_URL}/facilities/${facilityId}`,
        method : "delete",
        headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;
}

// 워케이션 신청 시설 목록 조회용
const selectFacilityAllListApi = () => {

    const response = axios({
        url: `${BASE_URL}/facilities/all`,
        method: "get"
    });

    return response;
};

export {selectFacilityListApi, searchFacilityListApi, insertFacilityApi, selectFacilityApi, selectFacilityFormApi, updateFacilityApi, deleteFacilityApi, selectFacilityAllListApi};
export {BASE_URL};