import { useNavigate } from "react-router-dom";

function WorkationReservationItemComponent({ item }) {
  const navigate = useNavigate();

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return "-";
    if (Array.isArray(date)) {
      const y = date[0];
      const m = String(date[1]).padStart(2, "0");
      const d = String(date[2]).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return String(date).substring(0, 10);
  };

  // 예약상태 배지 및 텍스트 분기 처리
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

  // 시설 및 장소 처리
  let facilityInfo = "-";
  if (item?.facilityName) {
    facilityInfo = item.facilityName;
  } else if (item?.region) {
    facilityInfo = item.region;
  }

  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/reservation/detail/${item.workationId}`);
      }}
    >
      {/* 크루 이름 */}
        <td className="member-name ellipsis-cell">{item?.crewName || "-"}</td>

        {/* 크루장 */}
        <td className="ellipsis-cell">{item?.leaderName || "-"}</td>

        {/* 신청 기간 */}
        <td className="ellipsis-cell">
            {item?.startDate && item?.endDate 
                ? `${formatDate(item.startDate)} ~ ${formatDate(item.endDate)}` 
                : "일정 미정"}
        </td>

        {/* 시설 및 장소 */}
        <td className="ellipsis-cell">{facilityInfo}</td>

        {/* 예약 신청일 */}
        <td className="member-empno ellipsis-cell">{formatDate(item?.createdDate)}</td>

        {/* 예약 상태 (배지 스타일 적용) */}
        <td className="ellipsis-cell">
            {getStatusBadge(item?.status)}
        </td>
    </tr>
  );
}

export default WorkationReservationItemComponent;