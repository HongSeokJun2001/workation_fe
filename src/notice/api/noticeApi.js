import axios from "axios";


const BASE_URL = "http://localhost:8006/workation/notices"

// 공지사항 목록조회

const selectNoticeListApi=()=>{

    const response = axios({

        url : `${BASE_URL}`,
        method:"get"
        // headers : 추가 ***
    });

    return response;

}

export {selectNoticeListApi};