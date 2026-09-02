import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { cancelApplicationApi, cancelReservationApi, approveApplicationApi, getApplicationDetailApi} from "../api/workationApi";

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

    // 취소하기 핸들러
    const handleCancel = async (e) => {

        e.preventDefault();

        let reason = "";
        
        if(application.status === "APPLY"){

            reason = prompt("반려 사유를 입력해주세요:");

            if (reason === null) return;

            if (!reason.trim()) {
                alert("반려 사유를 입력해야 합니다.");
                return;
            }
        } else {

            reason = prompt("예약 취소 사유를 입력해주세요:");

            if (reason === null) return;

            if (!reason.trim()) {
                alert("예약 취소 사유를 입력해야 합니다.");
                return;
            }
        }

        try {

            let response = "";

            if(application.status === "APPLY"){
                response = await cancelApplicationApi(workationId, reason);
                if( response.data === "success" || response.data === 1 ){
                    alert("워케이션 취소가 완료되었습니다.");
                    navigate("/admin/application/list");
                }
            } else {
                response = await cancelReservationApi(workationId, reason);
                if( response.data === "success" || response.data === 1 ){
                    alert("예약 취소가 완료되었습니다.");
                    navigate("/admin/application/list");
                }
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

    let title = "워케이션 신청 정보";

    let statusInfo = "신청 대기";

    if(application.status === "CONFIRM"){
        title = "워케이션 예약 정보";
        statusInfo = "예약 완료";
    } else if(application.status === "CANCELLED" && application.approvedYn === "REJECT"){
        title = "워케이션 승인 취소 정보";
        statusInfo = "워케이션 승인 취소";
    } else if(application.status === "CANCELLED" && application.approvedYn === "APPROVED"){
        title = "워케이션 예약 취소 정보"; 
        statusInfo = "워케이션 예약 취소"; 
    } else if(application.status === "COMPLETED"){
        title = "워케이션 완료 정보";
        statusInfo = "워케이션 완료";
    }

    let facilityInfo = "-";
    if(application.facilityName){
        facilityInfo = application.facilityName;
    } else if (application.region){
        facilityInfo = application.region;
    }

    let purposeInfo = application.purpose || "-";

    return (

        <div>

            <br /><br />

            <h2 align="center">{title}</h2>

            <br /><br />

            <table className="info-table">
                <tbody>
                    <tr>
                        <th className="info-label">크루명</th>
                        <td className="info-value">
                            {application.crewName}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">크루장</th>
                        <td className="info-value">
                            {application.leaderName}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">
                            예약상태
                        </th>
                        <td className="info-value">
                            {statusInfo}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">
                            예약날짜
                        </th>
                        <td className="info-value">
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
                    </tr>
                    <tr>
                        <th className="info-label">
                            목적
                        </th>
                        <td className="info-value">
                            {purposeInfo}
                        </td>
                    </tr>
                    {(application.status === 'CANCELLED') && (
                        <tr>
                            <th className="info-label">
                                취소 사유
                            </th>
                            {(application.approvedYn === "REJECT") && (
                                <td className="info-value">
                                    {application.rejectReason}
                                </td>
                            )}
                            {(application.approvedYn === "APPROVED") && (
                                <td className="info-value">
                                    {application.cancelledReason}
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="action-buttons">
                <button
                    className="btn btn-sm"
                    onClick={() => navigate("/admin/application/list")}
                >
                    목록으로
                </button>   
                {application.status === "APPLY" && (
                    <>
                        <button type="button" onClick={handleCancel}>반려하기</button>
                        <button type="button" onClick={handleApproval}>승인하기</button> 
                    </>
                )}

                {application.status === "CONFIRM" && (
                    <button type="button" onClick={handleCancel}>취소하기</button>
                )}
            </div>
        </div>

    );
}

export default WorkationApplicationDetailComponent;