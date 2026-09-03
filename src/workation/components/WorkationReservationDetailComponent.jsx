import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { cancelReservationApi, getReservationDetailApi } from "../api/workationApi";

function WorkationReservationDetailComponent() {

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

        getReservationDetailApi(workationId)
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

    const handleCancel = async (e) => {
        e.preventDefault();

        const reason = prompt("예약 취소 사유를 입력해주세요:");

            if (reason === null) return;

            if (!reason.trim()) {
                alert("예약 취소 사유를 입력해야 합니다.");
                return;
            }

        if(!reason){
            return;
        }

        try {
            const response = await cancelReservationApi(workationId, reason);
            if( response.data === "success" || response.data === 1 ){
                alert("예약 취소가 완료되었습니다.");
                navigate("/reservation/list");
            }
        } catch (error) {
            console.error("취소 실패:", error);
            alert("예약 취소 처리 중 오류가 발생했습니다.");
        }
        
    };

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
                    onClick={() => navigate("/reservation/list")}
                >
                    목록으로
                </button>   
                {application.status === "CONFIRM" && (
                    <button type="button" onClick={handleCancel}>취소하기</button>
                )}
            </div>
        </div>

    );
}

export default WorkationReservationDetailComponent;