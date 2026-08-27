
import axios from "axios";

const BASE_URL = "http://localhost:8007/workation/crews";

// 크루 목록 조회
const selectCrewListApi = () =>{

    const response = axios({

        url: `${BASE_URL}`,
        method: "GET"
        // headers: {
        //     "Content-Type": "application/json",
        // }
        
    });

    return response;
}

export { selectCrewListApi };

