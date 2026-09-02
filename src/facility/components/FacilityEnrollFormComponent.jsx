import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertFacilityApi } from "../api/facilityApi";
import "../css/FacilityEnrollFormComponent.css";

function FacilityEnrollFormComponent() {

    // 실행할 구문
    const navigate = useNavigate();

    // 50MB 용량 제한 (Byte 단위: 50 * 1024 * 1024)
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

    // 파일 상태
    const [files, setFiles] = useState([]);

    // 텍스트 입력 핸들러
    const handleChange = (e) => {
        const newFacility = { ...facility };
        newFacility[e.target.name] = e.target.value;
        setFacility(newFacility);
    };

    // 파일 선택 핸들러 (용량 체크)
    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        let totalSize = 0;
        if (selectedFiles && selectedFiles.length > 0) {
            
            for(let i = 0; i < selectedFiles.length; i++) {
                totalSize += selectedFiles[i].size;
            }
        }

        // 선택한 파일 총량이 50MB 초과 시 차단
        if(totalSize > MAX_FILE_SIZE) {
            alert("첨부파일 전체 용량이 50MB를 초과할 수 없습니다. \n현재 선택한 용량 : " + (totalSize / (1024 * 1024)).toFixed(2) + "MB");
            e.target.value = ""; //선택한 파일 초기화
            setFiles([]);
            return;
        }

        // 정상 용량일 떄 파일 상태 저정
        setFiles(selectedFiles);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 붙여넣기 등으로 발생할 수 있는 글자 수 초과 방어
        if (facility.facilityName.length > 100) return alert("시설명은 최대 100자까지 입력 가능합니다.");
        if (facility.region.length > 20) return alert("지역은 최대 20자까지 입력 가능합니다.");
        if (facility.address.length > 255) return alert("상세 주소는 최대 255자까지 입력 가능합니다.");
        if (facility.description && facility.description.length > 900) return alert("시설 설명은 최대 900자까지 입력 가능합니다.");

        // 파일 용량 2차 검증
        if(files && files.length > 0) {
            let totalSize = 0;
            for (let i = 0; i < files.length; i++) {
                totalSize += files[i].size;
            }

            if(totalSize > MAX_FILE_SIZE) {
                return alert("첨부파일 총 용량이 50MB를 초과하여 등록할 수 없습니다.");
            }
        }

        const formData = new FormData();

        formData.append("facilityName", facility.facilityName);
        formData.append("facilityType", facility.facilityType);
        formData.append("region", facility.region);
        formData.append("address", facility.address);
        formData.append("roomCount", facility.roomCount);
        formData.append("description", facility.description);

        // 이미지 파일 추가
        if(files && files.length > 0) {
            for(let i = 0; i < files.length; i++) {
                formData.append("upfiles", files[i]);
            }
        }

        try {
            const response = await insertFacilityApi(formData);

            if(response.status === 200 || response.data > 0) {
                alert("시설이 성공적으로 등록되었습니다.");
                navigate("/facility/list");
            } else {
                alert("시설 등록에 실패했습니다.");
            }
        } catch (error) {
            console.log("시설 등록 오류 발생", error);

            // 서버에서 MaxUploadSizeExceededException (413/500) 에러가 반환될 경우 처리
            if(error.response && (error.response.status === 413 || error.response.status === 500)) {
                alert("업로드 용량 제한(50MB)를 초과했습니다.");
            } else {
                alert("시설 등록중 에러 발생하였습니다.");
            }
        }
    };

    // return 구문
    return (
        <div className="facility-enroll-container">
            <h2 className="enroll-title">시설 등록</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label className="form-label">시설명</label>
                    <input type="text" 
                           className="form-control" 
                           name="facilityName" 
                           value={facility.facilityName} 
                           onChange={handleChange} 
                           maxLength={100} 
                           placeholder="시설명을 입력하세요(최대 100자)" required/>
                </div>

                <div className="form-group">
                    <label className="form-label">시설 유형</label>
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
                    <label className="form-label">지역 (예: 경남, 서울)</label>
                    <input type="text" 
                           className="form-control" 
                           name="region" 
                           value={facility.region} 
                           onChange={handleChange} 
                           maxLength={20} 
                           placeholder="지역을 입력하세요(최대 20자)" required/>
                </div>

                <div className="form-group">
                    <label className="form-label">상세 주소</label>
                    <input type="text" 
                           className="form-control" 
                           name="address" 
                           value={facility.address} 
                           onChange={handleChange} 
                           maxLength={255} 
                           placeholder="상세주소를 입력하세요 (최대 255자)" required/> 
                </div>

                <div className="form-group">
                    <label className="form-label">수용 객실 수</label>
                    <input type="number" 
                           className="form-control" 
                           name="roomCount" 
                           value={facility.roomCount} 
                           onChange={handleChange} 
                           min={0} 
                           placeholder="객실 수를 입력하세요" required/> 
                </div>

                <div className="form-group">
                    <label className="form-label">시설 설명</label>
                    <textarea className="form-control" 
                              name="description" 
                              rows="4" 
                              value={facility.description} 
                              onChange={handleChange} 
                              maxLength={900} 
                              placeholder="시설 상세 설명을 입력하세요 (최대 900자)">
                    </textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">수용 이미지 파일 첨부</label>
                    <input type="file" 
                           className="form-control" 
                           multiple accept="image/*" 
                           onChange={handleFileChange}/>
                </div>

                <div className="btn-group">
                    <button type="submit" className="btn btn-primary">등록하기</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default FacilityEnrollFormComponent;