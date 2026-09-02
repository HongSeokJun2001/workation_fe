import axios from "axios";

import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/notices"

// 공지사항 목록조회

const selectNoticeListApi = cpage => {

    const response = axios({

        url : `${BASE_URL}`,
        params : { cpage },
        method:"get",
        headers: {
            Authorization: getAuthorization()
        }
    });

    return response;

}

// 공지사항 작성
const insertNoticeApi = notice => {

    const response = axios({

        url : `${BASE_URL}`,
        method : "post",
        data : notice,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization()
        }
    });

    return response;
}
// 공지사항 상세 조회
const selectNoticeApi = noticeId => {

    const response = axios({

        url : `${BASE_URL}/${noticeId}`,
        method : "get",
        headers: {
            Authorization: getAuthorization()
        }
        // headers 추가
    });

    return response;

}

// 공지사항 수정
const updateNoticeApi = (noticeId, notice) =>{

    const response = axios({

        url : `${BASE_URL}/${noticeId}`,
        method : "put",
        data : notice,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization()
        }
        // 헤더 추가
    });

    return response;
}

//공지사항 삭제용

const deleteNoticeApi = noticeId => {

    const response = axios ({

        url : `${BASE_URL}/${noticeId}`,
        method: "delete",
        // 헤더 추가
        headers: {
            Authorization: getAuthorization()
        }
    });

    return response;
}

export {selectNoticeListApi, insertNoticeApi, selectNoticeApi,updateNoticeApi,deleteNoticeApi};