import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { insertFacilityApi } from "../api/facilityApi";
import "../css/FacilityEnrollFormComponent.css";

function FacilityEnrollFormComponent() {
    const navigate = useNavigate();

    // 50MB 용량 제한 (Byte 단위)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    // 입력 폼 상태 관리
    const [facility, setFacility] = useState({
        facilityName: "",
        facilityType: "RESORT",
        region: "",
        address: "",
        roomCount: 0,
        description: ""
    });

    // 파일 및 미리보기 상태
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    // 미리보기 URL 메모리 해제 (메모리 누수 방지)
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    // 텍스트 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacility((prev) => ({
            ...prev,
            [name]: name === "roomCount" ? (value === "" ? "" : Math.max(0, parseInt(value, 10) || 0)) : value
        }));
    };

    // 파일 선택 핸들러 (용량 체크 + 미리보기 URL 생성)
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        let totalSize = 0;

        for (let i = 0; i < selectedFiles.length; i++) {
            totalSize += selectedFiles[i].size;
        }

        // 선택한 파일 총량이 50MB 초과 시 차단
        if (totalSize > MAX_FILE_SIZE) {
            alert("첨부파일 전체 용량이 50MB를 초과할 수 없습니다. \n현재 선택한 용량 : " + (totalSize / (1024 * 1024)).toFixed(2) + "MB");
            e.target.value = ""; // 선택 파일 초기화
            setFiles([]);
            setPreviewUrls([]);
            return;
        }

        // 이전 미리보기 URL 메모리 해제 후 새 URL 설정
        previewUrls.forEach((url) => URL.revokeObjectURL(url));

        setFiles(selectedFiles);
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 입력 유효성 검증
        if (facility.facilityName.length > 100) return alert("시설명은 최대 100자까지 입력 가능합니다.");
        if (facility.region.length > 20) return alert("지역은 최대 20자까지 입력 가능합니다.");
        if (facility.address.length > 255) return alert("상세 주소는 최대 255자까지 입력 가능합니다.");
        if (facility.description && facility.description.length > 900) return alert("시설 설명은 최대 900자까지 입력 가능합니다.");

        // 파일 용량 2차 검증
        if (files && files.length > 0) {
            let totalSize = 0;
            for (let i = 0; i < files.length; i++) {
                totalSize += files[i].size;
            }

            if (totalSize > MAX_FILE_SIZE) {
                return alert("첨부파일 총 용량이 50MB를 초과하여 등록할 수 없습니다.");
            }
        }

        const formData = new FormData();
        formData.append("facilityName", facility.facilityName);
        formData.append("facilityType", facility.facilityType);
        formData.append("region", facility.region);
        formData.append("address", facility.address);
        formData.append("roomCount", facility.roomCount === "" ? 0 : facility.roomCount);
        formData.append("description", facility.description);

        // 이미지 파일 추가
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append("upfiles", files[i]);
            }
        }

        try {
            const response = await insertFacilityApi(formData);

            if (response.status === 200 || response.data > 0) {
                alert("시설이 성공적으로 등록되었습니다.");
                navigate("/facility/list");
            } else {
                alert("시설 등록에 실패했습니다.");
            }
        } catch (error) {
            console.log("시설 등록 오류 발생", error);

            if (error.response && (error.response.status === 413 || error.response.status === 500)) {
                alert("업로드 용량 제한(50MB)을 초과했습니다.");
            } else {
                alert("시설 등록 중 에러가 발생하였습니다.");
            }
        }
    };

    return (
        <div className="detail-container enroll-container">
            <h2 className="detail-title">신규 시설 등록</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label className="form-label">시설명 <span className="required-star">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        name="facilityName"
                        value={facility.facilityName}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="시설명을 입력하세요 (최대 100자)"
                        required
                    />
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">시설 유형 <span className="required-star">*</span></label>
                        <select className="form-select" name="facilityType" value={facility.facilityType} onChange={handleChange}>
                            <option value="RESORT">리조트</option>
                            <option value="HOTEL">호텔</option>
                            <option value="OFFICE">오피스</option>
                            <option value="GLAMPING/CAMPING">글램핑/캠핑</option>
                            <option value="HANOK">한옥</option>
                            <option value="PENSION">펜션</option>
                            <option value="SHARE_HOUSE">쉐어하우스</option>
                            <option value="COWORKING_SPACE">코워킹스페이스</option>
                            <option value="CAFE">워크 카페</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">지역 <span className="required-star">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            name="region"
                            value={facility.region}
                            onChange={handleChange}
                            maxLength={20}
                            placeholder="예: 서울, 강원, 경남"
                            required
                        />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group flex-2">
                        <label className="form-label">상세 주소 <span className="required-star">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={facility.address}
                            onChange={handleChange}
                            maxLength={255}
                            placeholder="상세주소를 입력하세요 (최대 255자)"
                            required
                        />
                    </div>

                    <div className="form-group flex-1">
                        <label className="form-label">수용 객실 수 <span className="required-star">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            name="roomCount"
                            value={facility.roomCount}
                            onChange={handleChange}
                            min={0}
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">시설 설명</label>
                    <textarea
                        className="form-control textarea-control"
                        name="description"
                        rows="5"
                        value={facility.description}
                        onChange={handleChange}
                        maxLength={900}
                        placeholder="시설 상세 설명을 입력하세요 (최대 900자)"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">시설 이미지 첨부</label>
                    <input
                        type="file"
                        className="form-file-input"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <p className="file-info-text">※ 최대 50MB까지 여러 이미지 파일 첨부가 가능합니다.</p>

                    {previewUrls.length > 0 && (
                        <div className="preview-container">
                            <span className="preview-title">선택된 이미지 ({previewUrls.length}개)</span>
                            <div className="preview-grid">
                                {previewUrls.map((url, idx) => (
                                    <img key={idx} src={url} alt={`미리보기 ${idx + 1}`} className="preview-img" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="action-buttons">
                    <button type="submit" className="btn-submit">등록하기</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default FacilityEnrollFormComponent;