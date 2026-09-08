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

    const getStatusBadge = (status) => {
        switch (status) {
            case "CONFIRM":
                return <span className="badge badge-status-active">예약 완료</span>;
            case "CANCELLED":
                return <span className="badge badge-status-locked">워케이션 취소</span>;
            case "COMPLETED":
                return <span className="badge badge-role-admin">워케이션 완료</span>;
            default:
                return <span className="badge badge-status-pending">신청 대기</span>;
        }
    };

    let facilityInfo = "-";
    if (item?.facilityName) {
        facilityInfo = item?.facilityName;
    } else if (item?.region) {
        facilityInfo = item?.region;
    }

    return (
        <tr 
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/admin/application/detail/${item.workationId}`);
            }}
        >
            {/* 크루 이름 */}
            <td className="member-name">{item?.crewName || "-"}</td>

            {/* 크루장 */}
            <td>{item?.leaderName || "-"}</td>

            {/* 신청 기간 */}
            <td>
                {item?.startDate && item?.endDate 
                    ? `${formatDate(item.startDate)} ~ ${formatDate(item.endDate)}` 
                    : "일정 미정"}
            </td>

            {/* 시설 및 장소 */}
            <td>{facilityInfo}</td>

            {/* 예약 신청일 */}
            <td className="member-empno">{formatDate(item?.createdDate)}</td>

            {/* 예약 상태 (배지 스타일 적용) */}
            <td>
                {getStatusBadge(item?.status)}
            </td>
        </tr>
    );
}

export default WorkationItemComponent;