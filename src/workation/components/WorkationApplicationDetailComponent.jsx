import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelApplicationApi,
  cancelReservationApi,
  approveApplicationApi,
  getApplicationDetailApi
} from "../api/workationApi";
import '../styles/WorkationCommon.css';
import "../styles/WorkationDetail.css";

function WorkationApplicationDetailComponent() {
  const navigate = useNavigate();
  const { workationId } = useParams();
  const [application, setApplication] = useState(null);

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

  useEffect(() => {
    getApplicationDetailApi(workationId)
      .then((response) => {
        setApplication(response.data);
      })
      .catch((error) => {
        console.error("상세 조회 실패:", error);

        // 권한 예외 처리 (관리자 권한이 없거나 403 반환 시)
        if (error.response && error.response.status === 403) {
          alert("해당 내역을 조회할 관리자 권한이 없습니다.");
          navigate(-1); // 이전 페이지로 이동
        } else {
          alert("상세 정보를 불러오는데 실패했습니다.");
        }
      });
  }, [workationId, navigate]);

  if (!application) {
    return <div className="detail-loading">데이터를 불러오는 중입니다...</div>;
  }

  // 취소/반려 핸들러
  const handleCancel = async (e) => {
    e.preventDefault();
    let reason = "";

    if (application.status === "APPLY") {
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
      if (application.status === "APPLY") {
        response = await cancelApplicationApi(workationId, reason);
        if (response.data === "success" || response.data === 1) {
          alert("워케이션 취소가 완료되었습니다.");
          navigate("/admin/application/list");
        }
      } else {
        response = await cancelReservationApi(workationId, reason);
        if (response.data === "success" || response.data === 1) {
          alert("예약 취소가 완료되었습니다.");
          navigate("/admin/application/list");
        }
      }
    } catch (error) {
      console.error("취소 실패:", error);
      alert("취소 처리 중 오류가 발생했습니다.");
    }
  };

  // 승인 핸들러
  const handleApproval = async (e) => {
    e.preventDefault();
    const isConfirm = window.confirm("워케이션 신청을 승인하시겠습니까?");
    if (!isConfirm) return;

    try {
      const response = await approveApplicationApi(workationId);
      if (response.data === "success" || response.data === 1) {
        alert("워케이션 승인이 완료되었습니다.");
        navigate("/admin/application/list");
      }
    } catch (error) {
      console.error("승인 실패:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  };

  // 타이틀 및 상태 배지 분기
  let title = "워케이션 신청 정보";
  let statusBadge = <span className="badge badge-status-pending">신청 대기</span>;

  if (application.status === "CONFIRM") {
    title = "워케이션 예약 정보";
    statusBadge = <span className="badge badge-status-active">예약 완료</span>;
  } else if (application.status === "CANCELLED" && application.approvedYn === "REJECT") {
    title = "워케이션 승인 취소 정보";
    statusBadge = <span className="badge badge-status-locked">승인 취소</span>;
  } else if (application.status === "CANCELLED" && application.approvedYn === "APPROVED") {
    title = "워케이션 예약 취소 정보";
    statusBadge = <span className="badge badge-status-locked">예약 취소</span>;
  } else if (application.status === "COMPLETED") {
    title = "워케이션 완료 정보";
    statusBadge = <span className="badge badge-role-admin">워케이션 완료</span>;
  }

  const facilityInfo = application.facilityName || application.region || "-";
  const purposeInfo = application.purpose || "-";

  return (
    <div className="detail-container">
      <div className="detail-card">
        {/* 상단 헤더 */}
        <div className="detail-header">
          <h2 className="detail-title">{title}</h2>
          <div>{statusBadge}</div>
        </div>

        {/* 상세 본문 */}
        <div className="detail-body">
          <table className="info-table">
            <tbody>
              <tr>
                <th className="info-label">크루명</th>
                <td className="info-value">{application.crewName || "-"}</td>
              </tr>
              <tr>
                <th className="info-label">크루장</th>
                <td className="info-value">{application.leaderName || "-"}</td>
              </tr>
              <tr>
                <th className="info-label">예약 날짜</th>
                <td className="info-value">
                  {`${formatDate(application.startDate)} ~ ${formatDate(application.endDate)}`}
                </td>
              </tr>
              <tr>
                <th className="info-label">시설 및 지역</th>
                <td className="info-value">{facilityInfo}</td>
              </tr>
              <tr>
                <th className="info-label">목적</th>
                <td className="info-value">{purposeInfo}</td>
              </tr>
              {application.status === "CANCELLED" && (
                <tr>
                  <th className="info-label">취소 사유</th>
                  <td className="info-value">
                    {application.approvedYn === "REJECT"
                      ? application.rejectReason
                      : application.cancelledReason}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 액션 버튼 그룹 */}
          <div className="action-buttons">

            <div className="left-space" />

              <button
                type="button"
                className="btn-detail btn-secondary"
                onClick={() => navigate("/admin/application/list")}
              >
                목록으로
              </button>
              
              {application.status === "APPLY" && (
                <>
                  <button
                    type="button"
                    className="btn-detail btn-danger"
                    onClick={handleCancel}
                  >
                    반려하기
                  </button>
                  <button
                    type="button"
                    className="btn-detail btn-primary"
                    onClick={handleApproval}
                  >
                    승인하기
                  </button>
                </>
              )}

              {application.status === "CONFIRM" && (
                <button
                  type="button"
                  className="btn-detail btn-danger"
                  onClick={handleCancel}
                >
                  취소하기
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkationApplicationDetailComponent;