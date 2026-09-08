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
  let statusInfo = "신청 대기";
  let statusBadgeClass = "badge-status-pending";

  if (item?.status === "CONFIRM") {
    statusInfo = "예약 완료";
    statusBadgeClass = "badge-status-active";
  } else if (item?.status === "CANCELLED") {
    statusInfo = "예약 취소";
    statusBadgeClass = "badge-status-locked";
  } else if (item?.status === "COMPLETED") {
    statusInfo = "이용 완료";
    statusBadgeClass = "badge-status-active";
  }

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
      <td>{item?.crewName || "-"}</td>

      <td>{item?.leaderName || "-"}</td>

      <td>
        {item?.startDate && item?.endDate
          ? `${formatDate(item.startDate)} ~ ${formatDate(item.endDate)}`
          : "일정 미정"}
      </td>

      <td>{facilityInfo}</td>

      <td>{formatDate(item?.createdDate)}</td>

      <td>
        <span className={`badge ${statusBadgeClass}`}>{statusInfo}</span>
      </td>
    </tr>
  );
}

export default WorkationReservationItemComponent;