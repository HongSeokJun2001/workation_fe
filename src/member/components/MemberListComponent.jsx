import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    selectMemberListApi,
    selectCompanyAdminListApi,
    selectEmployeeListApi
} from "../api/memberApi";

import CompanyAdminCreateModal from "./CompanyAdminCreateModal";
import "../styles/MemberManagement.css";

function MemberListComponent() {
    const navigate = useNavigate();
    const [dataList, setDataList] = useState([]);
    const loginRole = sessionStorage.getItem("loginRole");
    const isSuperAdmin = loginRole === "SUPER";
    
    const [status, setStatus] = useState("ALL");
    const [target, setTarget] = useState(isSuperAdmin ? "ALL" : "EMPLOYEE");
    const [isProgressed, setIsProgressed] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(null);
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const isEmployeeList = !isSuperAdmin && target === "EMPLOYEE";

    const fetchMemberList = async () => {
        try {
            let response;
            if (isSuperAdmin) {
                response = await selectMemberListApi(status, target, currentPage);
            } else if (target === "COMPANY_ADMIN") {
                response = await selectCompanyAdminListApi(status, currentPage);
            } else {
                response = await selectEmployeeListApi(status, isProgressed, currentPage);
            }

            const items = response.data.list || [];
            setPageInfo(response.data.pi);
            setDataList(items);
        } catch (error) {
            console.error("회원 목록 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchMemberList();
    }, [isSuperAdmin, status, target, isProgressed, currentPage]);

    const changeFilter = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    // 상세페이지 라우터 이동 처리
    const handleNavigateDetail = (item) => {
        if (isEmployeeList) {
            navigate(`/admin/company/member/employee/${item.employeeId}`);
        } else {
            if (isSuperAdmin) {
                navigate(`/admin/super/member/admin/${item.adminId}`);
            } else {
                navigate(`/admin/company/member/admin/${item.adminId}`);
            }
        }
    };

    const getInitial = (name) => (name ? name.charAt(0) : "김");

    return (
        <div className="member-container">
            {/* 상단 헤더 */}
            <div className="member-header">
                <div className="member-title-area">
                    <h2>계정 관리</h2>
                    <p className="member-subtitle">(주)테크브릿지 소속 계정 목록 관리</p>
                </div>
                
                {((!isSuperAdmin && target === "COMPANY_ADMIN") || (isSuperAdmin && (target === "SUPER" || target === "COMPANY"))) && (
                    <button className="btn-add-account" onClick={() => setShowCreateModal(true)}>
                        + 계정 추가
                    </button>
                )}
            </div>

            {/* 필터 영역 */}
            <div className="member-filter-bar">
                {isSuperAdmin ? (
                    <select className="filter-select" value={target} onChange={changeFilter(setTarget)}>
                        <option value="ALL">최고관리자 + 본사관리자</option>
                        <option value="SUPER">최고관리자</option>
                        <option value="COMPANY">본사관리자</option>
                    </select>
                ) : (
                    <select className="filter-select" value={target} onChange={changeFilter(setTarget)}>
                        <option value="EMPLOYEE">직원</option>
                        <option value="COMPANY_ADMIN">본사관리자</option>
                    </select>
                )}

                <select className="filter-select" value={status} onChange={changeFilter(setStatus)}>
                    <option value="ALL">상태 전체</option>
                    <option value="ACTIVE">활성</option>
                    <option value="LOCKED">잠금</option>
                </select>

                {isEmployeeList && (
                    <select className="filter-select" value={isProgressed} onChange={changeFilter(setIsProgressed)}>
                        <option value="ALL">회원가입 처리 여부 전체</option>
                        <option value="N">미승인 (N)</option>
                        <option value="Y">승인 완료 (Y)</option>
                    </select>
                )}
            </div>

            {/* 메인 리스트 테이블 */}
            <div className="member-table-card">
                <table className="member-table">
                    <thead>
                        <tr>
                            {isEmployeeList ? (
                                <>
                                    <th>이름 / 사번</th>
                                    <th>이메일 / 부서</th>
                                    <th>직급</th>
                                    <th>역할 / 상태</th>
                                    <th>승인여부</th>
                                    <th className="text-center">관리</th>
                                </>
                            ) : (
                                <>
                                    <th>로그인 아이디</th>
                                    <th>회사명</th>
                                    <th>역할 / 상태</th>
                                    <th className="text-center">관리</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((item) => {
                            const itemId = isEmployeeList ? item.employeeId : item.adminId;
                            return (
                                <tr key={itemId}>
                                    {isEmployeeList ? (
                                        <>
                                            <td>
                                                <div className="member-profile-cell">
                                                    <div className="avatar-circle">{getInitial(item.employeeName)}</div>
                                                    <div>
                                                        <div className="member-name">{item.employeeName}</div>
                                                        <div className="member-empno">사번: {item.empNo}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="member-email">{item.email || "email@techbridge.kr"}</div>
                                                <div className="member-dept">{item.department || "인사팀"}</div>
                                            </td>
                                            <td>{item.position || "-"}</td>
                                            <td>
                                                <div className="badge-group">
                                                    <span className="badge badge-role-emp">직원</span>
                                                    <span className={`badge ${item.status === "ACTIVE" ? "badge-status-active" : "badge-status-locked"}`}>
                                                        {item.status === "ACTIVE" ? "활성" : "잠금"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${item.isProgressed === "Y" ? "badge-status-active" : "badge-status-pending"}`}>
                                                    {item.isProgressed === "Y" ? "승인 완료" : "대기 중"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn-action-edit"
                                                    onClick={() => handleNavigateDetail(item)}
                                                >
                                                    수정/상세
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <div className="member-profile-cell">
                                                    <div className="avatar-circle">{getInitial(item.loginId)}</div>
                                                    <span className="member-name">{item.loginId}</span>
                                                </div>
                                            </td>
                                            <td>{item.companyLabel || "(주)테크브릿지"}</td>
                                            <td>
                                                <div className="badge-group">
                                                    <span className="badge badge-role-admin">{item.role || "관리자"}</span>
                                                    <span className={`badge ${item.status === "ACTIVE" ? "badge-status-active" : "badge-status-locked"}`}>
                                                        {item.status === "ACTIVE" ? "활성" : "잠금"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn-action-edit"
                                                    onClick={() => handleNavigateDetail(item)}
                                                >
                                                    수정/상세
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            {pageInfo && pageInfo.maxPage > 0 && (
                <div className="pagination-container">
                    <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        이전
                    </button>
                    {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                        const page = pageInfo.startPage + index;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`page-btn ${page === currentPage ? "active" : ""}`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button className="page-btn" disabled={currentPage === pageInfo.maxPage} onClick={() => setCurrentPage(currentPage + 1)}>
                        다음
                    </button>
                </div>
            )}

            {/* 계정 생성 모달 (기존 컴포넌트 호출) */}
            {showCreateModal && (
                <CompanyAdminCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={fetchMemberList}
                    isSuperAdmin={isSuperAdmin}
                    isCompanyAdminCreation={target === "COMPANY" || target === "COMPANY_ADMIN"}
                />
            )}
        </div>
    );
}

export default MemberListComponent;