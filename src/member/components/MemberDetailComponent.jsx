import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    approveEmployeeApi,
    rejectEmployeeApi,
    selectCompanyAdminDetailApi,
    selectEmployeeDetailApi,
    selectMyEmployeeDetailApi,
    selectSuperAdminDetailApi,
    updateCompanyAdminApi,
    updateEmployeeApi,
    updateMyEmployeeApi,
    updateSuperAdminApi
} from "../api/memberApi";
import { selectActiveCompanyListApi } from "../api/companyApi";
import "../styles/MemberDetail.css";

function MemberDetailComponent({ memberType, selfMode }) {
    const { adminId, employeeId } = useParams();
    const navigate = useNavigate();
    const loginRole = sessionStorage.getItem("loginRole");

    const isEmployee = memberType === "EMPLOYEE" || selfMode;
    const isSuperAdmin = loginRole === "SUPER";
    const targetId = isEmployee ? employeeId : adminId;

    const [member, setMember] = useState({});
    const [companyList, setCompanyList] = useState([]);
    const isTargetCompanyAdmin = member.role === "COMPANY";
    
    // 비밀번호 제어 State
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(false);

    // 1. 상세 정보 및 회사 목록 조회
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                let res;
                if (selfMode) {
                    res = await selectMyEmployeeDetailApi();
                } else if (isEmployee) {
                    res = await selectEmployeeDetailApi(targetId);
                } else if (isSuperAdmin) {
                    res = await selectSuperAdminDetailApi(targetId);
                } else {
                    res = await selectCompanyAdminDetailApi(targetId);
                }
                setMember(res.data);
            } catch (error) {
                console.error("상세 정보 조회 실패:", error);
            }
        };

        const fetchCompanies = async () => {
            if (isSuperAdmin && !isEmployee) {
                try {
                    const res = await selectActiveCompanyListApi();
                    setCompanyList(Array.isArray(res.data) ? res.data : []);
                } catch (err) {
                    console.error("회사 목록 조회 실패:", err);
                }
            }
        };

        if (targetId || selfMode) {
            fetchDetail();
            fetchCompanies();
        }
    }, [targetId, isEmployee, selfMode, isSuperAdmin]);

    // 2. 실시간 비밀번호 유효성 및 일치 여부 검증
    useEffect(() => {
        const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,15}$/;

        if (!password) {
            setPasswordMessage("");
            setIsValidPassword(true);
        } else if (!pwdRegex.test(password)) {
            setPasswordMessage("비밀번호는 8~15자이며, 특수문자를 최소 1개 포함해야 합니다.");
            setIsValidPassword(false);
        } else {
            setPasswordMessage("유효한 비밀번호 형식입니다.");
            setIsValidPassword(true);
        }

        if (!confirmPassword) {
            setConfirmMessage("");
        } else if (password !== confirmPassword) {
            setConfirmMessage("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmMessage("비밀번호가 일치합니다.");
        }
    }, [password, confirmPassword]);

    const handleChange = (e) => {
        setMember({ ...member, [e.target.name]: e.target.value });
    };

    // 3. 직원 계정 승인
    const handleApprove = async () => {
        if (!window.confirm("가입 신청을 승인하시겠습니까? 승인 후 직원 계정이 활성화됩니다.")) {
            return;
        }

        try {
            await approveEmployeeApi(targetId);
            alert("계정이 승인되었습니다.");
            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "계정 승인에 실패했습니다.");
        }
    };

    const handleReject = async () => {
        if (!window.confirm("가입 신청을 거부하면 직원 계정 정보가 삭제됩니다. 계속하시겠습니까?")) {
            return;
        }

        try {
            await rejectEmployeeApi(targetId);
            alert("가입 신청을 거부했습니다.");
            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "가입 신청 거부에 실패했습니다.");
        }
    };

    // 4. 정보 수정 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password) {
            if (!isValidPassword) {
                alert("비밀번호 조건을 확인해주세요.");
                return;
            }
            if (password !== confirmPassword) {
                alert("비밀번호 확인이 일치하지 않습니다.");
                return;
            }
        }

        try {
            const requestBody = { ...member, password: password || undefined };

            if (selfMode) {
                await updateMyEmployeeApi(requestBody);
            } else if (isEmployee) {
                await updateEmployeeApi(targetId, requestBody);
            } else if (isSuperAdmin) {
                await updateSuperAdminApi(member.adminId, requestBody);
            } else {
                await updateCompanyAdminApi(member.adminId, requestBody);
            }

            alert("정보가 변경되었습니다.");
            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="detail-container">
            <div className="detail-header">
                <h2>{selfMode ? "내 정보 수정" : isEmployee ? "직원 계정 상세 정보" : "관리자 계정 상세 정보"}</h2>
            </div>

            <form className="detail-form" onSubmit={handleSubmit}>
                {isEmployee ? (
                    <>
                        <div className="form-group">
                            <label>이름</label>
                            <input
                                type="text"
                                name="employeeName"
                                value={member.employeeName || ""}
                                onChange={handleChange}
                                disabled={selfMode}
                            />
                        </div>

                        {/* 로그인 ID (직원 본인 및 관리자 모두 수정 가능) */}
                        <div className="form-group">
                            <label>로그인 ID</label>
                            <input
                                type="text"
                                name="loginId"
                                value={member.loginId || ""}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 사번 (본인은 수정 불가) */}
                        <div className="form-group">
                            <label>사번</label>
                            <input
                                type="text"
                                name="empNo"
                                value={member.empNo || ""}
                                onChange={handleChange}
                                disabled={selfMode}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>부서</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={member.department || ""}
                                    onChange={handleChange}
                                    disabled={selfMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>직급</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={member.position || ""}
                                    onChange={handleChange}
                                    disabled={selfMode}
                                />
                            </div>
                        </div>

                        {/* 전화번호 (본인 및 관리자 수정 가능) */}
                        <div className="form-group">
                            <label>전화번호</label>
                            <input
                                type="text"
                                name="phone"
                                value={member.phone || ""}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                            />
                        </div>

                        <div className="form-group">
                            <label>이메일</label>
                            <input
                                type="email"
                                name="email"
                                value={member.email || ""}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 입사일 / 퇴사일 (본인은 수정 불가) */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>입사일</label>
                                <input
                                    type="date"
                                    name="hireDate"
                                    value={member.hireDate || ""}
                                    onChange={handleChange}
                                    disabled={selfMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>퇴사일</label>
                                <input
                                    type="date"
                                    name="resignDate"
                                    value={member.resignDate || ""}
                                    onChange={handleChange}
                                    disabled={selfMode}
                                />
                            </div>
                        </div>

                        {/* 워케이션 사용가능일수 (관리자만 수정) */}
                        {!selfMode && (
                            <div className="form-group">
                                <label>워케이션 사용가능일수</label>
                                <input
                                    type="number"
                                    name="workationAvailDays"
                                    value={member.workationAvailDays ?? 0}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        )}

                        {/* 회원가입 승인 상태 */}
                        {!selfMode && (
                            <div className="form-group">
                                <label>회원가입 승인 상태</label>
                                <input
                                    type="text"
                                    value={member.isProgressed === "Y" ? "승인 완료 (Y)" : "미승인 (N)"}
                                    disabled
                                />
                            </div>
                        )}
                    </>
                ) : (
                    /* 관리자 계정 정보 수정 영역 */
                    <>
                        <div className="form-group">
                            <label>로그인 아이디</label>
                            <input
                                type="text"
                                name="loginId"
                                value={member.loginId || ""}
                                onChange={handleChange}
                            />
                        </div>

                        {isSuperAdmin && isTargetCompanyAdmin && (
                            <>
                                <div className="form-group">
                                    <label>소속 회사</label>
                                    <select
                                        name="companyId"
                                        value={member.companyId || ""}
                                        onChange={handleChange}
                                    >
                                        {!companyList.some((comp) => String(comp.companyId) === String(member.companyId)) && member.companyId && (
                                            <option value={member.companyId}>{member.companyName || member.companyLabel}</option>
                                        )}
                                        {companyList.map((comp) => (
                                            <option key={comp.companyId} value={comp.companyId}>
                                                {comp.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>계정 권한</label>
                                    <input
                                        type="text"
                                        value={member.role || "COMPANY_ADMIN"}
                                        disabled
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* 비밀번호 변경 영역 */}
                <div className="form-group">
                    <label>비밀번호 변경 (변경시에만 입력)</label>
                    <input
                        type="password"
                        placeholder="8~15자, 특수문자 포함"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordMessage && (
                        <span className={`msg-comment ${isValidPassword ? "success" : "error"}`}>
                            {passwordMessage}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="새 비밀번호 재입력"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmMessage && (
                        <span className={`msg-comment ${password === confirmPassword ? "success" : "error"}`}>
                            {confirmMessage}
                        </span>
                    )}
                </div>

                {!selfMode && (
                    <div className="form-group">
                        <label>계정 상태</label>
                        <select
                            name="status"
                            value={member.status || "ACTIVE"}
                            onChange={handleChange}
                            disabled={isEmployee && member.isProgressed === "N"}
                        >
                            <option value="ACTIVE">활성 (ACTIVE)</option>
                            <option value="LOCKED">잠금 (LOCKED)</option>
                        </select>
                    </div>
                )}

                <div className="btn-group-detail">
                    {isEmployee && member.isProgressed === "N" && !selfMode && (
                        <>
                            <button
                                type="button"
                                className="btn-reject-custom"
                                onClick={handleReject}
                            >
                                승인 거부
                            </button>
                            <button
                                type="button"
                                className="btn-approve-custom"
                                onClick={handleApprove}
                            >
                                승인하기
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        className="btn-secondary-custom"
                        onClick={() => navigate(-1)}
                    >
                        취소
                    </button>
                    <button type="submit" className="btn-primary-custom">
                        저장하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MemberDetailComponent;