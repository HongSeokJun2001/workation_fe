import axios from "axios";
import { getAuthorization } from "../../common/api/commonApi";
import { BASE_URL } from "./facilityApi";

// 시설별 리뷰 목록 조회
const selectReviewListApi = (facilityId) => {

    const response = axios({
        url: `${BASE_URL}/facilities/${facilityId}/reviews`,
        method: "get",
        headers: {
            "Authorization": getAuthorization()
        }
    });

    return response;
};

export { selectReviewListApi };