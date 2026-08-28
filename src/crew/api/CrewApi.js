
import axios from "axios";

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

export { selectCrewListApi, searchCrewListApi, insertCrewApi };
