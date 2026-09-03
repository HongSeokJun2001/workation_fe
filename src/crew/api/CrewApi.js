
import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/crews";

// 크루 조회 Api
const selectCrewListApi = (cpage, sort) =>{

    const response = axios({

        url: `${BASE_URL}`,
        method: "get",
        params: {
            cpage: cpage,
            sort: sort
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization()
        }
        
    });

    return response;
}

// 크루 단건 조회 Api

const selectCrewApi = crewId =>{

    const response = axios({

        url: `${BASE_URL}/${crewId}`,
        method: "get",
        headers: {
            Authorization: getAuthorization()
        }
    });

    return response;
}


// 크루 검색 Api
const searchCrewListApi = (cpage, keyword, sort) => {

    const response = axios({

        url: `${BASE_URL}/search`,
        method: "get",
        params: {
            cpage: cpage,
            keyword: keyword,
            sort: sort
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization()
        }
        
    });

    return response;
}



// 크루 모집 글 작성 Api
const insertCrewApi = crewData => {


    const response = axios({

        url : `${BASE_URL}`,
        data : crewData,
        method : "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization()
        }

    });

    return response;
}

// 크루 글 수정 Api

const updateCrewApi = (crewId,payload) => {

    const response = axios({

        url : `${BASE_URL}/${crewId}`,
        method : "put",
        data : payload,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization()
        }
    })

    return response;
}

// 크루 글 삭제 Api
const deleteCrewApi = crewId => {

    const response = axios({
        url : `${BASE_URL}/${crewId}`,
        method : "delete",
        headers: {
            Authorization: getAuthorization()
        }   
    })

    return response;
}

// 가입 크루 조회
const selectMyCrewListApi = () => {

    const response = axios({

        url : `${BASE_URL}/mylist`,
        method : "get",
        headers: {
            Authorization: getAuthorization()
        }

    });

    return response;
}


//크루 신청하기 api
const joinCrewApi = crewId =>{

    const response = axios({

        url : `${BASE_URL}/${crewId}/join`,
        method : "post",
        headers: {
            Authorization: getAuthorization()
        }

    })

    return response;
}


// 크루 탈퇴 API
const leaveCrewApi = crewId => axios({
    url: `${BASE_URL}/${crewId}/join`,
    method: "delete",
    headers: {
        Authorization: getAuthorization()
    }
});

// 크루 멤버 이름 조회
const selectCrewMemberNamesApi = crewId => axios({
    url: `${BASE_URL}/${crewId}/members`,
    method: "get",
    headers: {
        Authorization: getAuthorization()
    }
});


// -------------------------------------------

// 워케이션신청시 크루장이 본인 크루 가져오는 코드
const selectCrewLeaderListApi = () => {
    
    const response = axios({
        url : `${BASE_URL}/leader`,
        method : "get",
        headers: {
            Authorization: getAuthorization()
        }
    });

    return response
}


export { selectCrewListApi, selectCrewApi, searchCrewListApi, insertCrewApi, updateCrewApi,
    deleteCrewApi,
    joinCrewApi,
    leaveCrewApi,
    selectCrewMemberNamesApi,
    selectMyCrewListApi,
    selectCrewLeaderListApi
};
