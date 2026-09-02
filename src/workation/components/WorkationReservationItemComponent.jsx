import { useNavigate } from "react-router-dom";

function WorkationReservationItemComponent({ item }) {

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

    return (
        <tr 
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/reservation/detail/${item.workationId}`);
            }}
        >
            <td>{item?.leaderName}</td>

            <td>
                {item?.startDate && item?.endDate 
                    ? `${formatDate(item.startDate)} ~ ${formatDate(item.endDate)}` 
                    : "일정 미정"}
            </td>

            <td>{item?.facilityName || "시설 미선택"}</td>

            <td>{item?.status == "RESERVED" ? "예약완료" : item?.status == "CANCELLED" ? "예약취소" : "워케이션 종료"}</td>

            <td>{formatDate(item?.createdDate)}</td>
        </tr>
    );
}

export default WorkationReservationItemComponent;