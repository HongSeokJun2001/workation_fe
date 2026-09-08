import "./common/styles/Login.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginMemberApi } from "./auth/api/authApi";
import { extractErrorMessage } from "./common/api/errorUtils";
import { selectDashboardStatsApi, selectPlatformStatsApi } from "./common/api/platformApi";
import "./common/styles/Dashboard.css";
import EmployeeAccountRecoveryModal from "./member/components/EmployeeAccountRecoveryModal";
import EmployeeSignupModal from "./member/components/EmployeeSignupModal";

function Index(props) {

    // 실행할 구문
    const {accessToken, setAccessToken, setLoginRole, loginRole} = props;
    const navigate = useNavigate();

    // 입력받은 id, pw 저장용 State 형 변수
    const [member, setMember] = useState({loginId : "",
                                          password : "",
                                          loginType : "ADMIN"});
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [stats, setStats] = useState({ companyCount: 0, facilityCount: 0 });
    const [dashboardStats, setDashboardStats] = useState({});

    useEffect(() => {
        selectPlatformStatsApi()
            .then(response => setStats({
                companyCount: response.data.companyCount ?? 0,
                facilityCount: response.data.facilityCount ?? 0
            }))
            .catch(error => console.error("플랫폼 통계 조회 실패:", error));
    }, []);

    useEffect(() => {
        if (!accessToken || !loginRole) {
            return;
        }

        selectDashboardStatsApi(loginRole)
            .then(response => setDashboardStats(response.data || {}))
            .catch(error => console.error("대시보드 통계 조회 실패:", error));
    }, [accessToken, loginRole]);

    // 10 단위로 내림 후 + 표기
    const formatCount = count => `${Math.floor((count ?? 0) / 10) * 10}+`;

    // 입력값이 변할 때마다 실행할 이벤트 핸들러 함수
    const handleChange = e => {
        const newMember = {...member};
        newMember[e.target.name] = e.target.value;
        setMember(newMember);

    };

    // 로그인 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const loginMember = async e => {
        
        // 기본이벤트 제거
        e.preventDefault();

        try {
            const response = await loginMemberApi(member);

            const loginResponse = response.data;

            sessionStorage.setItem("accessToken", loginResponse.accessToken);
            sessionStorage.setItem("tokenType", loginResponse.tokenType);
            sessionStorage.setItem("loginRole", loginResponse.role);
            setAccessToken(loginResponse.accessToken);
            setLoginRole(loginResponse.role);

            if (loginResponse.role === "SUPER") {
                navigate("/admin/super");
            } else if (loginResponse.role === "COMPANY") {
                navigate("/admin/company");
            } else {
                navigate("/lobby");
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);

            if (error.response?.status === 401) {
                alert(extractErrorMessage(error, "아이디 또는 비밀번호가 올바르지 않습니다."));
            } else if (error.response) {
                alert(`로그인 요청 실패 (${error.response.status})`);
            } else if (error.request) {
                alert("서버와 통신할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
            } else {
                alert("로그인 요청을 보내는 중 오류가 발생했습니다.");
            }
            
        }
    };

    // 로그아웃 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const logoutMember = e => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("tokenType");
        sessionStorage.removeItem("loginRole");
        setAccessToken(null);
        setLoginRole(null);
        setMember({loginId : "", password : "", loginType : "ADMIN"});
        navigate("/");

    };

    const selectLoginType = loginType => {
        setMember({...member, loginType});

    };

    const moveToSignup = () => {
        setShowSignupModal(true);

    };

    const moveToFindAccount = () => {
        setShowRecoveryModal(true);

    };

    const renderStatCard = (icon, value, label, tone = "green") => (
        <div className={`dashboard-card dashboard-card-${tone}`}>
            <div className="dashboard-card-icon">{icon}</div>
            <div><strong>{value ?? 0}</strong><span>{label}</span></div>
        </div>
    );

    if(accessToken != null) {

        const isSuperAdmin = loginRole === "SUPER";
        const isCompanyAdmin = loginRole === "COMPANY";
        const isEmployee = loginRole === "EMPLOYEE";

        // return 구문 - 로그인 후에는 로그아웃 버튼만 보여주기
        return (
            <div className="dashboard-page">
                <div className="dashboard-heading">
                    <div>
                        <h2>{isSuperAdmin ? "최고관리자 대시보드" : isCompanyAdmin ? "대시보드" : "직원 대시보드"}</h2>
                        <p>{isSuperAdmin ? "플랫폼 전체 현황을 관리합니다" : isCompanyAdmin ? "소속 회사의 승인 현황을 관리합니다" : "내 워케이션 활동 현황을 확인합니다"}</p>
                    </div>
                    <button type="button" className="dashboard-logout" onClick={ logoutMember }>로그아웃</button>
                </div>

                {isSuperAdmin && (
                    <>
                        <div className="dashboard-grid">
                            {renderStatCard("🏠", dashboardStats.facilityCount, "등록 공간")}
                            {renderStatCard("🏢", dashboardStats.companyCount, "고객사", "purple")}
                            {renderStatCard("👥", dashboardStats.employeeCount, "전체 직원", "blue")}
                            {renderStatCard("📋", dashboardStats.reservationCount, "전체 예약")}
                        </div>
                        <section className="dashboard-panel dashboard-panel-notice">
                            <h3>⏳ 최초 계정 생성 신청 대기중</h3>
                            <p>고객사 및 관리자 계정 관리는 상단의 기존 내비게이션 메뉴에서 처리합니다.</p>
                        </section>
                    </>
                )}

                {isCompanyAdmin && (
                    <>
                        <div className="dashboard-grid">
                            {renderStatCard("👥", dashboardStats.employeeCount, "소속 직원")}
                            {renderStatCard("⏳", dashboardStats.pendingEmployeeCount, "승인 대기 직원", "amber")}
                            {renderStatCard("🏕️", dashboardStats.pendingApplicationCount, "워케이션 대기", "blue")}
                            {renderStatCard("✅", dashboardStats.approvedThisMonthCount, "이달 승인 완료")}
                        </div>
                        <section className="dashboard-panel">
                            <h3>🏕️ 처리 대기 중인 워케이션 신청</h3>
                            <p>신청 처리는 상단의 기존 워케이션신청내역 메뉴에서 진행합니다.</p>
                        </section>
                    </>
                )}

                {isEmployee && (
                    <>
                        <div className="dashboard-grid dashboard-grid-employee">
                            {renderStatCard("👥", dashboardStats.joinedCrewCount, "참여한 크루")}
                            {renderStatCard("⏳", dashboardStats.pendingApplicationCount, "승인 대기 워케이션", "amber")}
                            {renderStatCard("✅", dashboardStats.approvedReservationCount, "승인된 예약 내역", "blue")}
                        </div>
                        <section className="dashboard-panel dashboard-review-panel">
                            <h3>후기 작성 가능한 시설</h3>
                            <strong>{dashboardStats.reviewableFacilityCount ?? 0}</strong>
                            <span>개</span>
                        </section>
                    </>
                )}
            </div>
        );
    } else {

        // return 구문 - 로그인 전에는 로그인 폼만 보여주기
        return (
            <div className="login-page">
                <section className="login-visual">
                    <div>
                        <div className="login-brand">
                            <span className="login-brand-mark">W</span>
                            워케이션 크루
                        </div>
                        <p className="login-brand-caption">Crew-based B2B Workation Platform</p>
                    </div>

                    <div className="login-visual-copy">
                        <h1>
                            일과 쉼이 만나는
                            <span>크루 워케이션</span>
                        </h1>
                        <p>
                            함께 떠날 크루를 먼저 만들고, 검증된 공간을<br />
                            기업 복지로 무료 대여하세요.
                        </p>

                        <div className="login-stats">
                            <div>
                                <div className="login-stat-value">{formatCount(stats.companyCount)}</div>
                                <div className="login-stat-label">협약 기업</div>
                            </div>
                            <div>
                                <div className="login-stat-value">{formatCount(stats.facilityCount)}</div>
                                <div className="login-stat-label">검증 공간</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="login-panel">
                    <div className="login-form-area">
                        <h2>로그인</h2>
                        <p className="login-form-caption">계정에 로그인하여 워케이션을 시작하세요</p>

                        <div className="login-type-group">
                            <button type="button"
                                    className={member.loginType === "ADMIN" ? "active" : ""}
                                    onClick={() => selectLoginType("ADMIN")}>
                                관리자 로그인
                            </button>
                            <button type="button"
                                    className={member.loginType === "EMPLOYEE" ? "active" : ""}
                                    onClick={() => selectLoginType("EMPLOYEE")}>
                                직원 로그인
                            </button>
                        </div>

                        <form id="login-form" onSubmit={loginMember}>
                            <div className="login-field">
                                <label htmlFor="loginId">아이디</label>
                                <input id="loginId"
                                       type="text"
                                       name="loginId"
                                       value={member.loginId}
                                       onChange={handleChange}
                                       placeholder="아이디를 입력하세요" />
                            </div>

                            <div className="login-field">
                                <label htmlFor="password">비밀번호</label>
                                <input id="password"
                                       type="password"
                                       name="password"
                                       value={member.password}
                                       onChange={handleChange}
                                       placeholder="비밀번호를 입력하세요" />
                            </div>

                            <button type="submit" className="login-submit">
                                로그인
                            </button>
                        </form>

                        <div className="login-links">
                            계정이 없으신가요?
                            <button type="button" onClick={moveToSignup}>직원 계정 만들기</button>
                            <span className="divider">|</span>
                            <button type="button" onClick={moveToFindAccount}>아이디/비밀번호 찾기</button>
                        </div>
                    </div>
                </section>

                {showSignupModal && (
                    <EmployeeSignupModal onClose={() => setShowSignupModal(false)} />
                )}
                {showRecoveryModal && (
                    <EmployeeAccountRecoveryModal onClose={() => setShowRecoveryModal(false)} />
                )}
            </div>
        );
    }
}

export default Index;