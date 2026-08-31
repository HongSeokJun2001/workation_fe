
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

export { selectCrewListApi, searchCrewListApi, insertCrewApi, selectCrewLeaderListApi };
