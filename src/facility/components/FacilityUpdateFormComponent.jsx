import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { selectFacilityFormApi, updateFacilityApi } from "../api/facilityApi";
import "../css/FacilityUpdateFormComponent.css";

function FacilityUpdateFormComponent() {

    // 실행할 구문
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

    // 기존 이미지 경로 목록과 새 파일 업로드용 state
    const [existingImages, setExistingImages] = useState([]); // 기존 이미지 객체 목록 [{imageId, filePath}, ...]
    const [deleteImageIds, setDeleteImageIds] = useState([]); // 삭제할 이미지 ID 목록
    const [files, setFiles] = useState([]);

    // 컴포넌트 마운트 시 selectFacilityFormApi 호출
    useEffect(() => {
        if(!facilityId) {
            alert("잘못된 접근입니다.");
            navigate("/facility/list");
            return;
        }

        const selectFacilityForm = async() => {
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
            } catch(error) {
                console.log("수정용 상세 정보 조회 실패!", error);
            }
        };
        selectFacilityForm();
    }, [facilityId, navigate]);

    // 텍스트 입력 핸들러
    const handleChange = (e) => {
        const newFacility = {...facility};
        newFacility[e.target.name] = e.target.value;
        setFacility(newFacility);
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    // 기존 이미지 삭제 버튼 클릭 핸들러
    const handleDeleteExistingImage = (imageId, index) => {
        if(imageId) {
            // imageId가 있는 경우 삭제 목록에 추가
            setDeleteImageIds((prev) => [...prev, imageId]);
        }
        // 화면 UI 상에서 즉시 제거
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 폼 제출 핸들러
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

        // 삭제할 이미지 ID들을 FormData에 추가
        if(deleteImageIds.length > 0) {
            deleteImageIds.forEach((id) => {
                formData.append("deleteImageIds", id);
            });
        }

        // 새 이미지 파일 추가 (선택된 경우만)
        if (files && files.length > 0) {
            for(let i = 0; i < files.length; i++) {
                formData.append("upfiles", files[i]);
            }
        }

        try {
            const response = await updateFacilityApi(facilityId, formData);

            if(response.status === 200 || response.data > 0 || response.data === "success") {
                alert("시설 정보가 성공적으로 수정되었습니다.");
                navigate(`/facility/detail/${facilityId}`);
            } else {
                alert("시설 정보 수정에 실패했습니다.");
            }
        } catch(error) {
            console.log("시설 수정 오류 발생", error);
            alert("시설 수정 중 에러가 발생하였습니다.");
        }
    };

    // return 구문
    return (
        <div className="facility-update-container">
            <h2 className="update-title">시설 정보 수정</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label className="form-label">시설명</label>
                    <input type="text" 
                           className="form-control" 
                           name="facilityName" 
                           value={facility.facilityName} 
                           onChange={handleChange} 
                           placeholder="시설명을 입력하세요" required/>
                </div>

                <div className="form-group">
                    <label className="form-label">시설 유형</label>
                    <select className="form-select" name="facilityType" value={facility.facilityType} onChange={handleChange}>
                        <option value="RESORT">RESORT</option>
                        <option value="HOTEL">HOTEL</option>
                        <option value="OFFICE">OFFICE</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">지역 (예: 경남, 서울)</label>
                    <input type="text" 
                           className="form-control" 
                           name="region" 
                           value={facility.region} 
                           onChange={handleChange} 
                           placeholder="지역을 입력하세요" required/>
                </div>

                <div className="form-group">
                    <label className="form-label">상세 주소</label>
                    <input type="text" 
                           className="form-control" 
                           name="address" 
                           value={facility.address} 
                           onChange={handleChange} 
                           placeholder="상세주소를 입력하세요" required/>
                </div>

                <div className="form-group">
                    <label className="form-label">수용 객실 수</label>
                    <input type="number" 
                           className="form-control" 
                           name="roomCount" 
                           value={facility.roomCount} 
                           onChange={handleChange} 
                           placeholder="객실 수를 입력하세요" required/>
                </div>

                <div className="form-group">
                    <label className="form-label">시설 설명</label>
                    <textarea className="form-control" 
                              name="description" rows="4" 
                              value={facility.description} 
                              onChange={handleChange} 
                              placeholder="시설 상세 설명을 입력하세요">        
                    </textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">운영 상태</label>
                    <select className="form-select" name="status" value={facility.status} onChange={handleChange}>
                        <option value="ACTIVE">운영중</option>
                        <option value="INACTIVE">휴업 또는 점검</option>
                    </select>
                </div>

                {/* 기존 등록 이미지 표시 및 삭제 버튼 */}
                <div className="form-group">
                    <label className="form-label">현재 등록된 이미지</label>
                    <div>
                        {existingImages.length > 0 ? (
                            <div className="existing-img-area">
                                {existingImages.map((imgItem, index) => {
                                    const imagePath = typeof imgItem === 'string' ? imgItem : imgItem.filePath;
                                    const imageId = typeof imgItem === 'object' ? imgItem.imageId : null;

                                    return (
                                        <div key={index} className="img-item">
                                            <img src={`http://localhost:8007/workation${imagePath}`} alt={`기존 이미지 ${index + 1}`} className="img-preview"/>
                                            <button type="button" className="img-delete-btn" onClick={() => handleDeleteExistingImage(imageId, index)}>X</button>
                                        </div>    
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-muted small">등록된 이미지가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 새 이미지 첨부 */}
                <div className="form-group">
                    <label className="form-label">새 이미지 파일 추가 첨부</label>
                    <input type="file" 
                           className="form-control" 
                           multiple accept="image/*" 
                           onChange={handleFileChange}/>
                </div>

                <div className="btn-group">
                    <button type="submit" className="btn btn-warning">
                        수정완료
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FacilityUpdateFormComponent;