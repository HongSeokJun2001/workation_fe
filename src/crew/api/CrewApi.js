
import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/crews";

// 크루 조회 Api
const selectCrewListApi = cpage =>{

    const response = axios({

        url: `${BASE_URL}`,
        method: "get",
        params: {
            cpage: cpage
        }
        // headers: {
        //     "Content-Type": "application/json",
        // }
        
    });

    return response;
}

// 크루 단건 조회 Api

const selectCrewApi = crewId =>{

    const response = axios({

        url: `${BASE_URL}/${crewId}`,
        method: "get"
    });

    return response;
}


// 크루 검색 Api
const searchCrewListApi = (cpage, keyword) => {

    const response = axios({

        url: `${BASE_URL}/search`,
        method: "get",
        params: {
            cpage: cpage,
            keyword: keyword
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
        // headers: {
        //     "Content-Type": "application/json",
        // }
    })

    return response;
}

// 크루 글 삭제 Api
const deleteCrewApi = crewId => {

    const response = axios({
        url : `${BASE_URL}/${crewId}`,
        method : "delete"
    })

    return response;
}

// 가입 크루 조회
const selectMyCrewListApi = employeeId => {

    const response = axios({

        url : `${BASE_URL}/mylist/${employeeId}`,
        method : "get"

    });

    return response;
}


//크루 신청하기 api
const joinCrewApi = crewId =>{

    const response = axios({

        url : `${BASE_URL}/${crewId}/join`,
        method : "post"

    })

    return response;
}


// 크루 탈퇴 API
const leaveCrewApi = crewId => axios({
    url: `${BASE_URL}/${crewId}/join`,
    method: "delete"
});


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

export { selectCrewListApi, searchCrewListApi, insertCrewApi, updateCrewApi,
    deleteCrewApi,
    joinCrewApi,
    leaveCrewApi,
    selectMyCrewListApi, selectCrewLeaderListApi };
