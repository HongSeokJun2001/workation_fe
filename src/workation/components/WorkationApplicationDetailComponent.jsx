import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { cancelApplicationApi, approveApplicationApi, getApplicationDetailApi } from "../api/workationApi";

function WorkationApplicationDetailComponent() {

    const navigate = useNavigate();

    const { workationId } = useParams();

    const [application, setApplication] = useState(null);

    const formatDate = (date) => {
        if (!date) return "-";
        if (Array.isArray(date)) {
            const y = date[0];
            const m = String(date[1]).padStart(2, '0');
            const d = String(date[2]).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
        return String(date).substring(0, 10);
    };

    useEffect(() => {

        getApplicationDetailApi(workationId)
            .then(response => {

                console.log("신청 상세 데이터:", response.data);

                setApplication(response.data);

            })
            .catch(error => {

                console.error("상세 조회 실패:", error);

            });

    }, [workationId]);

    if (!application) {
        return <div>Loading...</div>;
    }

    let facilityInfo = "-";
    if(application.facilityName){
        facilityInfo = application.facilityName;
    } else if (application.region){
        facilityInfo = application.region;
    }

    let purposeInfo = application.purpose || "-";

    // 취소하기 핸들러
    const handelCancel = async (e) => {
        e.preventDefault();

        const reason = prompt("반려 사유를 입력해주세요:");

        if (reason === null) return;

        if (!reason.trim()) {
            alert("반려 사유를 입력해야 합니다.");
            return;
        }

        try {
            const response = await cancelApplicationApi(workationId, reason);
            if( response.data === "success" || response.data === 1 ){
                alert("워케이션 취소가 완료되었습니다.");
                navigate("/admin/application/list");
            }
        } catch (error) {
            console.error("취소 실패:", error);
            alert("취소 처리 중 오류가 발생했습니다.");
        }
        
    };

    // 승인하기 핸들러
    const handleApproval = async (e) => {
        e.preventDefault();

        const isConfirm = window.confirm("워케이션 신청을 승인하시겠습니까?");

        if(!isConfirm){
            return;
        }

        try {
            const response = await approveApplicationApi(workationId);
            if( response.data === "success" || response.data === 1 ){
                alert("워케이션 승인이 완료되었습니다.");
                navigate("/admin/application/list");
            }
        } catch (error) {
            console.error("승인 실패:", error);
            alert("승인 처리 중 오류가 발생했습니다.");
        }

    }

    return (

        <div>

            <br />
            <br />

            <table className="info-table">
                <tbody>
                    <tr>
                        <th className="info-label">크루명</th>
                        <td className="info-value">
                            {application.crewName}
                        </td>
                        <th className="info-label">크루장</th>
                        <td className="info-value">
                            {application.leaderName}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">
                            예약날짜
                        </th>
                        <td className="info-value" colSpan={3}>
                            {`${formatDate(application.startDate)} ~ ${formatDate(application.endDate)}`}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">
                            시설 및 지역
                        </th>
                        <td className="info-value">
                            {facilityInfo}
                        </td>
                        <th className="info-label">
                            목적
                        </th>
                        <td className="info-value">
                            {purposeInfo}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="action-buttons">
                <button
                    className="btn btn-sm"
                    onClick={() => navigate("/admin/application/list")}
                >
                    목록으로
                </button>   
                <button type="button" onClick={handelCancel}>취소하기</button>
                <button type="button" onClick={handleApproval}>승인하기</button> 
            </div>
        </div>

    );
}

export default WorkationApplicationDetailComponent;