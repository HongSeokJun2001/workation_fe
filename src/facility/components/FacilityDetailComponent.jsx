import { selectReviewListApi } from "../api/reviewApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectFacilityApi, deleteFacilityApi, BASE_URL } from "../api/facilityApi";
import "../css/FacilityDetailComponent.css";

function FacilityDetailComponent() {
    const { facilityId } = useParams();
    const navigate = useNavigate();

    // ----------------------------------------------------
    // 이미지 예외 처리 (via.placeholder 대체용 안전 SVG)
    // ----------------------------------------------------
    const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%23e9ecef'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23868e96' font-size='12'>이미지 없음</text></svg>";

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = FALLBACK_IMAGE;
    };

    // 시설 유형
    const FACILITY_TYPE_MAP = {
        RESORT: "리조트",
        HOTEL: "호텔",
        OFFICE: "오피스",
        "GLAMPING/CAMPING": "글램핑/캠핑",
        HANOK: "한옥",
        PENSION: "펜션",
        SHARE_HOUSE: "쉐어하우스",
        COWORKING_SPACE: "코워킹스페이스",
        CAFE: "워크 카페"
    };

    // ----------------------------------------------------
    // 태그 클래스 매핑 Helper (List Component와 통일)
    // ----------------------------------------------------
    const getTypeTagClass = (type) => {
        switch (type) {
            case "RESORT": return "tag-type-resort";
            case "HOTEL": return "tag-type-hotel";
            case "OFFICE": return "tag-type-office";
            case "GLAMPING/CAMPING": return "tag-type-camping";
            case "HANOK": return "tag-type-hanok";
            case "PENSION": return "tag-type-pension";
            case "SHARE_HOUSE": return "tag-type-sharehouse";
            case "COWORKING_SPACE": return "tag-type-coworking";
            case "CAFE": return "tag-type-cafe";
            default: return "tag-type-default";
        }
    };

    const getRegionTagClass = (region) => {
        if (!region) return "tag-region-default";
        if (["서울", "경기", "인천"].some(r => region.includes(r))) return "tag-region-capital";
        if (region.includes("강원")) return "tag-region-gangwon";
        if (["부산", "대구", "울산", "경북", "경남"].some(r => region.includes(r))) return "tag-region-gyeongsang";
        if (["광주", "전북", "전남"].some(r => region.includes(r))) return "tag-region-jeolla";
        if (["대전", "세종", "충북", "충남"].some(r => region.includes(r))) return "tag-region-chungcheong";
        if (region.includes("제주")) return "tag-region-jeju";
        return "tag-region-default";
    };

    const loginRole = sessionStorage.getItem("loginRole");
    const loginMemberId = sessionStorage.getItem("loginMemberId"); // 댓글 작성자/삭제 권한 확인용 (팀원 구현용)

    // ----------------------------------------------------
    // State 관리
    // ----------------------------------------------------
    const [facility, setFacility] = useState({
        facilityId: "",
        facilityType: "",
        facilityName: "",
        region: "",
        address: "",
        description: "",
        status: "",
        roomCount: "",
        imageList: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 댓글/리뷰 관련 State
    const [reviewList, setReviewList] = useState([]);

    // 댓글 작성 입력 Form State
    const [newReview, setNewReview] = useState({
        rating: 5,
        content: "",
        images: []
    });

    // ----------------------------------------------------
    // API 연동 & Effect
    // ----------------------------------------------------
    useEffect(() => {
        const selectFacility = async () => {
            try {
                const response = await selectFacilityApi(facilityId);
                if (response.data) {
                    setFacility(response.data);
                } else {
                    alert("존재하지 않거나 삭제된 시설입니다.");
                    navigate("/facility/list");
                }
            } catch (error) {
                console.log("시설 상세 조회 실패!", error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await selectReviewListApi(facilityId);
                setReviewList(response.data);
            } catch (error) {
                console.log("리뷰 목록 조회 실패!", error);
            }
        };

        selectFacility();
        fetchReviews();
        }, [facilityId, navigate]);

    // ----------------------------------------------------
    // 이미지 처리 Helper
    // ----------------------------------------------------
    const getImages = () => {
        const rawImages = facility.imageList || facility.imagePaths || [];
        return rawImages.map((item) => {
            const path = typeof item === "object" && item !== null ? item.filePath : item;
            if (!path) return "";
            if (path.includes("via.placeholder.com")) return FALLBACK_IMAGE;
            return path.startsWith("http")
                ? path
                : `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
        }).filter(Boolean);
    };

    const images = getImages();

    // ----------------------------------------------------
    // 모달 핸들러
    // ----------------------------------------------------
    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // ----------------------------------------------------
    // 시설 삭제 핸들러
    // ----------------------------------------------------
    const deleteFacility = async () => {
        if (!window.confirm("정말로 이 시설을 삭제하시겠습니까?")) return;

        try {
            const response = await deleteFacilityApi(facilityId);
            if (response.status === 200 && response.data) {
                alert("시설 정보가 성공적으로 삭제되었습니다.");
                navigate("/facility/list");
            } else {
                alert("시설 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.log("시설 삭제 실패!", error);
        }
    };

    // ----------------------------------------------------
    // 댓글(리뷰) 관련 이벤트 핸들러 (팀원이 백엔드 API 연동할 부분)
    // ----------------------------------------------------
    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.content.trim()) {
            alert("댓글 내용을 입력해 주세요.");
            return;
        }

        // TODO (팀원 구현 영역): 댓글 등록 API 요청 처리 (Axios)
        // const formData = new FormData(); ...
        
        console.log("등록할 댓글 데이터:", newReview);
        alert("댓글 등록 스텁 함수입니다. 백엔드 API를 연동해 주세요.");
        setNewReview({ rating: 5, content: "", images: [] });
    };

    const handleReviewDelete = async (reviewId) => {
        if (!window.confirm("이 댓글을 삭제하시겠습니까?")) return;

        // TODO (팀원 구현 영역): 댓글 삭제 API 요청 처리
        console.log("삭제할 리뷰 ID:", reviewId);
        setReviewList((prev) => prev.filter((item) => item.reviewId !== reviewId));
    };

    return (
        <div className="detail-container">
            <h2 className="detail-title">워케이션 시설 상세 정보</h2>

            {/* 1. 이미지 표시 영역 */}
            <div className="image-section">
                {images.length > 0 ? (
                    <div>
                        {/* 대표 메인 이미지 */}
                        <div className="main-image-box" onClick={() => openModal(0)}>
                            <img 
                                src={images[0]} 
                                alt="대표 시설 이미지" 
                                className="main-image"
                                onError={handleImageError}
                            />
                            <div className="image-count-badge">
                                📷 사진 전체보기 ({images.length})
                            </div>
                        </div>

                        {/* 하단 썸네일 리스트 */}
                        {images.length > 1 && (
                            <div className="thumbnail-list">
                                {images.map((imgSrc, idx) => (
                                    <img
                                        key={idx}
                                        src={imgSrc}
                                        alt={`썸네일 ${idx + 1}`}
                                        className={`thumbnail-item ${idx === 0 ? "active" : ""}`}
                                        onClick={() => openModal(idx)}
                                        onError={handleImageError}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-image-box">
                        등록된 시설 이미지가 없습니다.
                    </div>
                )}
            </div>

            {/* 2. 시설 상세 정보 테이블 */}
            <table className="info-table">
                <tbody>
                    <tr>
                        <th className="info-label">시설명</th>
                        <td className="info-value">{facility.facilityName}</td>
                        <th className="info-label">시설 유형</th>
                        <td className="info-value">
                            <span className={`tag-type ${getTypeTagClass(facility.facilityType)}`}>
                                {FACILITY_TYPE_MAP[facility.facilityType] || facility.facilityType}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">지역</th>
                        <td className="info-value">
                            <span className={`tag-region ${getRegionTagClass(facility.region)}`}>
                                {facility.region}
                            </span>
                        </td>
                        <th className="info-label">수용 객실 수</th>
                        <td className="info-value">{facility.roomCount}개</td>
                    </tr>
                    <tr>
                        <th className="info-label">상세 주소</th>
                        <td className="info-value" colSpan="3">{facility.address}</td>
                    </tr>
                    <tr>
                        <th className="info-label">등록일</th>
                        <td className="info-value" colSpan="3">
                            {facility.createdDate ? facility.createdDate.substring(0, 10) : "-"}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">시설 설명</th>
                        <td className="info-value" colSpan="3">
                            <p className="description-text">
                                {facility.description || "등록된 상세 설명이 없습니다."}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* 3. 댓글 / 리뷰 영역 (팀원 개발용 인터페이스 구축) */}
            <div className="review-section">
                <h3 className="review-title">💬 이용 후기 ({reviewList.length})</h3>

                {/* 댓글 작성 폼 */}
                <form className="review-form" onSubmit={handleReviewSubmit}>
                    <div className="review-form-header">
                        <label htmlFor="rating">평점: </label>
                        <select 
                            id="rating"
                            name="rating" 
                            value={newReview.rating} 
                            onChange={handleReviewChange}
                            className="review-select"
                        >
                            <option value={5}>⭐⭐⭐⭐⭐ (5점)</option>
                            <option value={4}>⭐⭐⭐⭐ (4점)</option>
                            <option value={3}>⭐⭐⭐ (3점)</option>
                            <option value={2}>⭐⭐ (2점)</option>
                            <option value={1}>⭐ (1점)</option>
                        </select>
                    </div>
                    <div className="review-form-body">
                        <textarea
                            name="content"
                            value={newReview.content}
                            onChange={handleReviewChange}
                            placeholder="시설 이용 후기를 남겨주세요."
                            className="review-textarea"
                            rows={3}
                        />
                        <button type="submit" className="btn-review-submit">등록</button>
                    </div>
                </form>

                {/* 댓글 목록 */}
                {reviewList.length > 0 ? (
                    <div className="review-list">
                        {reviewList.map((review) => (
                            <div key={review.reviewId} className="review-card">
                                <div className="review-header">
                                    <span className="review-author">{review.employeeName}</span>
                                    <span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                                    <span className="review-date">{review.createdDate}</span>
                                    
                                    {/* 본인 작성 댓글이거나 SUPER 관리자일 경우 삭제 버튼 표시 */}
                                    {(loginMemberId === review.memberId || loginRole === "SUPER") && (
                                        <button 
                                            className="btn-review-delete" 
                                            onClick={() => handleReviewDelete(review.reviewId)}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                                <p className="review-content">{review.content}</p>

                                {/* 댓글 첨부 이미지 목록 */}
                                {review.images && review.images.length > 0 && (
                                    <div className="review-images">
                                        {review.images.map((img, i) => (
                                            <img 
                                                key={i} 
                                                src={img} 
                                                alt={`후기 이미지 ${i + 1}`} 
                                                className="review-img" 
                                                onError={handleImageError} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-review">등록된 후기가 없습니다. 첫 후기를 작성해 보세요!</p>
                )}
            </div>

            {/* 4. 하단 작업 버튼 영역 */}
            <div className="action-buttons">
                <button className="btn-list" onClick={() => navigate("/facility/list")}>
                    목록으로
                </button>

                {/* 최고관리자일 때만 수정/삭제 버튼 표시 */}
                {loginRole === "SUPER" && (
                    <>
                        <button 
                            className="btn-update" 
                            onClick={() => navigate("/facility/update", { state: { facilityId } })}
                        >
                            수정하기
                        </button>
                        <button className="btn-delete" onClick={deleteFacility}>
                            삭제하기
                        </button>
                    </>
                )}
            </div>

            {/* 5. 이미지 전체화면 확대 모달 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-counter">
                                {currentIndex + 1} / {images.length}
                            </span>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            <img
                                src={images[currentIndex]}
                                alt={`확대 이미지 ${currentIndex + 1}`}
                                className="modal-image"
                                onError={handleImageError}
                            />

                            {images.length > 1 && (
                                <>
                                    <button className="modal-prev-btn" onClick={handlePrev}>
                                        &#10094;
                                    </button>
                                    <button className="modal-next-btn" onClick={handleNext}>
                                        &#10095;
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FacilityDetailComponent;