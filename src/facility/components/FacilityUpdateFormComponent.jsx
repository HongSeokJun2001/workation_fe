import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { selectFacilityFormApi, updateFacilityApi } from "../api/facilityApi";
import "../css/FacilityUpdateFormComponent.css";

function FacilityUpdateFormComponent() {
    const navigate = useNavigate();
    const location = useLocation();

    // 상세 페이지에서 navigate로 넘겨준 facilityId 추출
    const facilityId = location.state?.facilityId;

    // 입력 폼 상태 관리
    const [facility, setFacility] = useState({
        facilityId: "",
        facilityName: "",
        facilityType: "RESORT",
        region: "",
        address: "",
        roomCount: "",
        description: "",
        status: "ACTIVE"
    });

    // 기존 이미지 및 새 파일 상태
    const [existingImages, setExistingImages] = useState([]);
    const [deleteImageIds, setDeleteImageIds] = useState([]);
    const [files, setFiles] = useState([]);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        if (!facilityId) {
            alert("잘못된 접근입니다.");
            navigate("/facility/list");
            return;
        }

        const selectFacilityForm = async () => {
            try {
                const response = await selectFacilityFormApi(facilityId);
                if (response.data) {
                    const data = response.data;
                    setFacility({
                        facilityId: data.facilityId,
                        facilityName: data.facilityName || "",
                        facilityType: data.facilityType || "RESORT",
                        region: data.region || "",
                        address: data.address || "",
                        roomCount: data.roomCount || 0,
                        description: data.description || "",
                        status: data.status || "ACTIVE"
                    });
                    setExistingImages(data.imageList || data.imagePaths || []);
                }
            } catch (error) {
                console.log("수정용 상세 정보 조회 실패!", error);
            }
        };
        selectFacilityForm();
    }, [facilityId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacility((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleDeleteExistingImage = (imageId, index) => {
        if (imageId) {
            setDeleteImageIds((prev) => [...prev, imageId]);
        }
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("facilityName", facility.facilityName);
        formData.append("facilityType", facility.facilityType);
        formData.append("region", facility.region);
        formData.append("address", facility.address);
        formData.append("roomCount", facility.roomCount);
        formData.append("description", facility.description);
        formData.append("status", facility.status);

        if (deleteImageIds.length > 0) {
            deleteImageIds.forEach((id) => {
                formData.append("deleteImageIds", id);
            });
        }

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append("upfiles", files[i]);
            }
        }

        try {
            const response = await updateFacilityApi(facilityId, formData);

            if (response.status === 200 || response.data > 0 || response.data === "success") {
                alert("시설 정보가 성공적으로 수정되었습니다.");
                navigate(`/facility/detail/${facilityId}`);
            } else {
                alert("시설 정보 수정에 실패했습니다.");
            }
        } catch (error) {
            console.log("시설 수정 오류 발생", error);
            alert("시설 수정 중 에러가 발생하였습니다.");
        }
    };

    return (
        <div className="facility-update-container">
            <div className="update-card">
                <div className="update-header">
                    <h2 className="update-title">시설 정보 수정</h2>
                    <p className="update-subtitle">등록된 시설의 정보를 최신 상태로 업데이트하세요.</p>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="update-form">
                    
                    {/* 기본 정보 카드 */}
                    <div className="form-section">
                        <h3 className="section-title">기본 정보</h3>
                        
                        <div className="form-group">
                            <label className="form-label">시설명 <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="facilityName" 
                                value={facility.facilityName} 
                                onChange={handleChange} 
                                placeholder="시설명을 입력하세요" 
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label className="form-label">시설 유형</label>
                                <select className="form-select" name="facilityType" value={facility.facilityType} onChange={handleChange}>
                                    <option value="RESORT">RESORT</option>
                                    <option value="HOTEL">HOTEL</option>
                                    <option value="OFFICE">OFFICE</option>
                                </select>
                            </div>

                            <div className="form-group half">
                                <label className="form-label">운영 상태</label>
                                <select className="form-select" name="status" value={facility.status} onChange={handleChange}>
                                    <option value="ACTIVE">운영중</option>
                                    <option value="INACTIVE">휴업 / 점검</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label className="form-label">지역 <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="region" 
                                    value={facility.region} 
                                    onChange={handleChange} 
                                    placeholder="예: 서울, 강원" 
                                    required
                                />
                            </div>

                            <div className="form-group half">
                                <label className="form-label">수용 객실 수 <span className="required">*</span></label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="roomCount" 
                                    value={facility.roomCount} 
                                    onChange={handleChange} 
                                    placeholder="객실 수" 
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">상세 주소 <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="address" 
                                value={facility.address} 
                                onChange={handleChange} 
                                placeholder="상세 주소를 입력하세요" 
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">시설 설명</label>
                            <textarea 
                                className="form-control textarea" 
                                name="description" 
                                rows="4" 
                                value={facility.description} 
                                onChange={handleChange} 
                                placeholder="시설 상세 설명을 입력하세요"
                            ></textarea>
                        </div>
                    </div>

                    {/* 이미지 관리 카드 */}
                    <div className="form-section">
                        <h3 className="section-title">이미지 관리</h3>

                        {/* 기존 이미지 영역 */}
                        <div className="form-group">
                            <label className="form-label">현재 등록된 이미지</label>
                            {existingImages.length > 0 ? (
                                <div className="existing-img-grid">
                                    {existingImages.map((imgItem, index) => {
                                        const imagePath = typeof imgItem === 'string' ? imgItem : imgItem.filePath;
                                        const imageId = typeof imgItem === 'object' ? imgItem.imageId : null;

                                        return (
                                            <div key={index} className="img-item-card">
                                                <img 
                                                    src={`http://localhost:8007/workation${imagePath}`} 
                                                    alt={`기존 이미지 ${index + 1}`} 
                                                    className="img-preview"
                                                />
                                                <button 
                                                    type="button" 
                                                    className="img-delete-btn" 
                                                    onClick={() => handleDeleteExistingImage(imageId, index)}
                                                    title="이미지 삭제"
                                                >
                                                    ✕
                                                </button>
                                            </div>    
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="no-img-box">
                                    <p className="no-img-text">등록된 이미지가 없습니다.</p>
                                </div>
                            )}
                        </div>

                        {/* 새 이미지 첨부 */}
                        <div className="form-group">
                            <label className="form-label">새 이미지 파일 추가</label>
                            <div className="file-upload-wrapper">
                                <input 
                                    type="file" 
                                    id="file-input"
                                    className="file-input-hidden" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-input" className="file-upload-btn">
                                    📁 파일 추가 선택
                                </label>
                                <span className="file-count-text">
                                    {files.length > 0 ? `${files.length}개 파일 선택됨` : "추가 선택된 파일 없음"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="btn-group">
                        <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                            취소
                        </button>
                        <button type="submit" className="btn-submit">
                            수정 완료
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default FacilityUpdateFormComponent;