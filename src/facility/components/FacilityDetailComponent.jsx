import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectFacilityApi, deleteFacilityApi, BASE_URL } from "../api/facilityApi";
import "../css/FacilityDetailComponent.css";

function FacilityDetailComponent() {
    const { facilityId } = useParams();
    const navigate = useNavigate();

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

    const loginRole = sessionStorage.getItem("loginRole");

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
        selectFacility();
    }, [facilityId, navigate]);

    const getImages = () => {
        const rawImages = facility.imageList || facility.imagePaths || [];
        return rawImages.map((item) => {
            const path = typeof item === "object" && item !== null ? item.filePath : item;
            if (!path) return "";
            return path.startsWith("http")
                ? path
                : `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
        }).filter(Boolean);
    };

    const images = getImages();

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
                            <span className="type-tag">
                                {FACILITY_TYPE_MAP[facility.facilityType] || facility.facilityType}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">지역</th>
                        <td className="info-value">{facility.region}</td>
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

            {/* 3. 하단 작업 버튼 영역 */}
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

            {/* 4. 이미지 전체화면 확대 모달 */}
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