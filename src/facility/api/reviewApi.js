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

// 리뷰 등록
const insertReviewApi = (facilityId, review) => {

    const formData = new FormData();

    formData.append("rating", review.rating);
    formData.append("content", review.content);

    if (review.images && review.images.length > 0) {
        review.images.forEach((file) => {
            formData.append("upfiles", file);
        });
    }

    const response = axios({
        url: `${BASE_URL}/facilities/${facilityId}/reviews`,
        method: "post",
        data: formData,
        headers: {
            "Authorization": getAuthorization()
        }
    });

    return response;
};

// 리뷰 삭제
const deleteReviewApi = (reviewId) => {

    const response = axios({
        url: `${BASE_URL}/reviews/${reviewId}`,
        method: "delete",
        headers: {
            "Authorization": getAuthorization()
        }
    });

    return response;
};

export { selectReviewListApi, insertReviewApi, deleteReviewApi };