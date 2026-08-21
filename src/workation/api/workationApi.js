import axios from "axios";

const BASE_URL = "http://localhost:8007/workation"

const selectApplicationListApi = cpage =>{

    const response = axios({

        url : `${BASE_URL}/applicationList`,
        method:"get",
        params : {
            cpage : cpage
        }
    });

    return response;

}

export {selectApplicationListApi};