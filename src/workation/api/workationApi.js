import axios from "axios";

const BASE_URL = "http://localhost:8007/workation/application"

const RES_URL = "http://localhost:8007/workation/reservation"

const getApplicationListApi = cpage =>{

    const response = axios({

        url : `${BASE_URL}/List`,
        method:"get",
        params : {
            cpage : cpage
        }
    });

    return response;

}

const insertApplicationApi = application => {

    const response = axios({

        url : `${BASE_URL}/insert`,
        method : "post",
        data : application
    });

    return response;
}

const getReservationListApi = cpage => {

    const response = axios({

        url : `${RES_URL}/List`,
        method:"get",
        params : {
            cpage : cpage
        }
    });

    return response;
}

export {getApplicationListApi, insertApplicationApi, getReservationListApi};