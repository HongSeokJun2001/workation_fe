import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertFacilityApi } from "../api/facilityApi";

function FacilityEnrollFormComponent() {

    // 실행할 구문
    const navigate = useNavigate();

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

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setFiles(e.target.files);
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

        // 이미지 파일 추가
        if(files && files.length > 0) {
            for(let i = 0; i < files.length; i++) {
                formData.append("upfiles", files[i]);
            }
        }

        try{
            const response = await insertFacilityApi(formData);

            if(response.status === 200 || response.data > 0) {
                alert("시설이 성공적으로 등록되었습니다.");
                navigate("/facility/list");
            } else {
                alert("시설 등록에 실패했습니다.");
            }
        } catch (error) {
            console.log("시설 등록 오류 발생", error);
            alert("시설 등록중 에러 발생하였습니다.");
        }
    };

    // return 구문
    return(
        <div className="container my-4" style={{maxWidth: "700px"}}>
            <h2 className="text-center mb-4">시설 등록</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label fw-bold">시설명</label>
                    <input type="text" className="form-control" name="facilityName" value={facility.facilityName} onChange={handleChange} placeholder="시설명을 입력하세요" required/>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">시설 유형</label>
                    <select className="form-select" name="facilityType" value={facility.facilityType} onChange={handleChange}>
                        <option value="RESORT">RESORT</option>
                        <option value="HOTEL">HOTEL</option>
                        <option value="OFFICE">OFFICE</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">지역 (예: 경남, 서울)</label>
                    <input type="text" className="form-control" name="region" value={facility.region} onChange={handleChange} placeholder="지역을 입력하세요" required/>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">상세 주소</label>
                    <input type="text" className="form-control" name="address" value={facility.address} onChange={handleChange} placeholder="상세주소를 입력하세요" required/> 
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">수용 객실 수</label>
                    <input type="number" className="form-control" name="roomCount" value={facility.roomCount} onChange={handleChange} placeholder="객실 수를 입력하세요" required/> 
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">시설 설명</label>
                    <textarea className="form-control" name="description" rows="4" value={facility.description} onChange={handleChange} placeholder="시설 상세 설명을 입력하세요"></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">수용 이미지 파일 첨부</label>
                    <input type="file" className="form-control" multiple accept="image/*" onChange={handleFileChange}/>
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                    <button type="submit" className="btn btn-primary">등록하기</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );

}

export default FacilityEnrollFormComponent;