import axios from "axios";
import { getAuthorization } from "../../common/api/commonApi";

const BASE_URL = "http://localhost:8007/workation/crews";

// 댓글 조회
const selectReplyList = (crewId) => axios({
    url: `${BASE_URL}/${crewId}/replies`,
    method: "get",
    headers: { Authorization: getAuthorization() }

    
});

// 댓글 작성
const insertReplyApi = (crewId, replyData) => axios({
    url: `${BASE_URL}/${crewId}/replies`,
    method: "post",
    data: replyData,
    headers: {
        "Content-Type": "application/json",
        Authorization: getAuthorization()
    }

});

const deleteReplyApi = (replyId) => axios({
    url: `${BASE_URL}/replies/${replyId}`,
    method: "delete",
    headers: {
        "Content-Type": "application/json",
        Authorization: getAuthorization()
    }
});

export { selectReplyList, insertReplyApi, deleteReplyApi };
