import { useNavigate } from "react-router-dom";

function WorkationItemComponent({ item }) {

    let navigate = useNavigate();

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

    let statusInfo = "신청 대기";
    if(item?.status === "CONFIRM"){
        statusInfo = "예약 완료";
    } else if(item?.status === "CANCELLED"){
        statusInfo = "워케이션 취소";
    } else if(item?.status === "COMPLETED"){
        statusInfo = "워케이션 완료";
    }

    let facilityInfo = "-";
    if(item?.facilityName){
        facilityInfo = item?.facilityName;
    } else if (item?.region){
        facilityInfo = item?.region;
    }

    return (
        <tr 
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/admin/application/detail/${item.workationId}`);
            }}
        >
            <td>{item?.crewName}</td>

            <td>{item?.leaderName}</td>

            <td>
                {item?.startDate && item?.endDate 
                    ? `${formatDate(item.startDate)} ~ ${formatDate(item.endDate)}` 
                    : "일정 미정"}
            </td>

            <td>{facilityInfo}</td>

            <td>{formatDate(item?.createdDate)}</td>

            <td>{statusInfo}</td>

        </tr>
    );
}

export default WorkationItemComponent;