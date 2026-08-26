import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectFacilityApi, deleteFacilityApi, BASE_URL } from "../api/facilityApi";

function FacilityDetailComponent() {

    // 실행할 구문
    // URL 파라미터에서 facilityId 추출
    const {facilityId} = useParams();
    const navigate = useNavigate();

    // FacilityResponseDto 구조에 맞춘 State 초기화
    const [facility, setFacility] = useState({
        facilityId : "",
        facilityType : "",
        facilityName : "",
        region : "",
        address : "",
        description : "",
        status : "",
        roomCount : "",
        imageList : []
    });

    // 컴포넌트 마운트 시 단일 시설 정보 조회
    useEffect(() => {
        const selectFacility = async () => {
            try {
                const response = await selectFacilityApi(facilityId);

                if(response.data) {
                    setFacility(response.data);
                } else {
                    alert("존재하지 않거나 삭제된 시설입니다.");
                    navigate("/facility/list");
                }
            } catch(error) {
                console.log("시설 상세 조회용 ajax 통신 실패!", error);
            }
        };
        selectFacility();
    }, [facilityId, navigate]);

    // 시설 삭제 처리 함수
    const deleteFacility = async () => {
        if(!window.confirm("정말로 이 시설을 삭제하시겠습니까?")) return;

        try {
            const response = await deleteFacilityApi(facilityId);

            if (response.status === 200 && response.data) {
                alert("시설 정보가 성공적으로 삭제되었습니다.");
                navigate("/facility/list");
            } else {
                alert("시설 삭제에 실패했습니다.");
            }
        } catch(error) {
            console.log("시설 삭제용 ajax 통신 실패!", error);
        }
    };

    // return 구문
    return (
        <div className="container mt-4">
            <h2 align="center">워케이션 시설 상세 정보</h2>

            <br /><br />

            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th width="150" className="table-light">시설명</th>
                        <td>{facility.facilityName}</td>
                        <th width="150" className="table-light">시설 유형</th>
                        <td>{facility.facilityType}</td>
                    </tr>
                    <tr>
                        <th className="table-light">지역</th>
                        <td>{facility.region}</td>
                        <th className="table-light">수용 객실 수</th>
                        <td>{facility.roomCount}개</td>
                    </tr>
                    <tr>
                        <th className="table-light">등록일</th>
                        <td colSpan="3">
                            {facility.createdDate ? facility.createdDate.substring(0, 10) : ""}
                        </td>
                    </tr>
                    <tr>
                        <th className="table-light">시설 설명</th>
                        <td colSpan="3">
                            <p style={{minHeight: "150px" , whiteSpace: "pre-line"}}>
                                {facility.description}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th className="table-light">시설 이미지</th>
                        <td colSpan="3">
                            {(() => {
                                const images = facility.imageList || facility.imagePaths || [];

                                if (images.length === 0) return "등록된 시설 이미지가 없습니다.";

                                return (
                                    <div style={{display: "flex", gap: "15px", flexWrap: "wrap"}}>
                                        {images.map((item, index) => {
                                            const path = typeof item === 'object' && item !== null ? item.filePath : item;
                                            if (!path) return null;

                                            const src = path.startsWith("http") 
                                                ? path 
                                                : `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;

                                            return (
                                                <img 
                                                    key={index} 
                                                    src={src} 
                                                    alt={`시설 이미지 ${index + 1}`} 
                                                    style={{width: "200px", height: "150px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd"}}
                                                />
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </td>
                    </tr>
                </tbody>
            </table>

            <br /><br />

            {/*하단 버튼 영역 */}
            <div align="center">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/facility/list")}>
                    목록으로
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-outline-warning btn-sm" onClick={() => navigate("/facility/update", {state : {facilityId}})}>
                    수정하기
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-outline-danger btn-sm" onClick={deleteFacility}>
                    삭제하기
                </button>
            </div>

            <br /><br />
        </div>
    );
}

export default FacilityDetailComponent;