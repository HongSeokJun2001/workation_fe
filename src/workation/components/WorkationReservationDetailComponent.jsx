import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { cancelReservationApi, getReservationDetailApi } from "../api/workationApi";

function WorkationReservationDetailComponent() {

    const navigate = useNavigate();

    const { reservationId } = useParams();

    const [reservation, setReservation] = useState(null);

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

        getReservationDetailApi(reservationId)
            .then(response => {

                console.log("신청 상세 데이터:", response.data);

                setReservation(response.data);

            })
            .catch(error => {

                console.error("상세 조회 실패:", error);

            });

    }, [reservationId]);

    if (!reservation) {
        return <div>Loading...</div>;
    }

    let facilityInfo = "-";
    if(reservation.facilityName){
        facilityInfo = reservation.facilityName;
    } else if (reservation.region){
        facilityInfo = reservation.region;
    }

    let purposeInfo = reservation.purpose || "-";

    const handelCancel = async (e) => {
        e.preventDefault();

        const isConfirm = window.confirm("예약을 정말 취소하시겠습니까?",);

        if(!isConfirm){
            return;
        }

        try {
            const response = await cancelReservationApi(reservationId);
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

            <br />
            <br />

            <table className="info-table">
                <tbody>
                    <tr>
                        <th className="info-label">크루명</th>
                        <td className="info-value">
                            {reservation.crewName}
                        </td>
                        <th className="info-label">크루장</th>
                        <td className="info-value">
                            {reservation.leaderName}
                        </td>
                    </tr>
                    <tr>
                        <th className="info-label">
                            예약날짜
                        </th>
                        <td className="info-value" colSpan={3}>
                            {`${formatDate(reservation.startDate)} ~ ${formatDate(reservation.endDate)}`}
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
                    <tr>
                        <th className="info-label">
                            예약상태
                        </th>
                        <td className="info-value">
                            {reservation.status}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="action-buttons">
                <button
                    className="btn btn-sm"
                    onClick={() => navigate("/reservation/list")}
                >
                    목록으로
                </button>   
                {(reservation.status === 'RESERVED') && (
                    <button type="button" onClick={handelCancel}>취소하기</button>
                )}
            </div>
        </div>
    );
}

export default WorkationReservationDetailComponent;