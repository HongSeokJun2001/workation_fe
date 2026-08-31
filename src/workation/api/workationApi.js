import axios from "axios";
import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/application"

const RES_URL = "http://localhost:8007/workation/reservation"

const getApplicationListApi = cpage =>{

    const response = axios({

        url : `${BASE_URL}/list`,
        method:"get",
        params : {
            cpage : cpage
        },
        headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;

}

const getApplicationDetailApi = workationId => {

    const response = axios({
        url : `${BASE_URL}/${workationId}`,
        method : "get", 
        headers : {
            "Authorization" : getAuthorization()
        }

    });
    
    return response
}

const insertApplicationApi = application => {

    const response = axios({

        url : `${BASE_URL}/insert`,
        method : "post",
        data : application,
        headers: {
            "Authorization": getAuthorization()
        }
    });

    return response;
}

const getReservationListApi = cpage => {

    const response = axios({

        url : `${RES_URL}/list`,
        method:"get",
        params : {
            cpage : cpage
        }, headers : {
            "Authorization" : getAuthorization()
        }
    });

    return response;
}


export {getApplicationListApi, getApplicationDetailApi, insertApplicationApi, getReservationListApi};