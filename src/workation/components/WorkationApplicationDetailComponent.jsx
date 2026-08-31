import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApplicationDetailApi } from "../api/workationApi";

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
                <button>취소하기</button>
                <button>승인하기</button> 
            </div>
        </div>

    );
}

export default WorkationApplicationDetailComponent;