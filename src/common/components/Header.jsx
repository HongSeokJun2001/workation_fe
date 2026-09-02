import { Link } from "react-router-dom";
import "../styles/Header.css";
// assets 폴더의 로고 이미지 import
import logoImg from "../../assets/새로운 로고.png";

function Header({ loginRole }) {
    const isAdmin = loginRole === "SUPER" || loginRole === "COMPANY";
    const isSuperAdmin = loginRole === "SUPER";
    const isCompanyAdmin = loginRole === "COMPANY";
    const isMember = loginRole === "EMPLOYEE";
    // const isGuest = loginRole === null;

    const lobbyPath = loginRole === "SUPER"
        ? "/admin/super"
        : loginRole === "COMPANY"
            ? "/admin/company"
                : loginRole === "EMPLOYEE"
                    ? "/lobby"
                : "/";

    const memberListPath = loginRole === "SUPER"
        ? "/admin/super/member/list"
        : loginRole === "COMPANY"
            ? "/admin/company/member/list"
            : "/lobby";

    return (
        <header className="header-container">
            <div className="header-inner">
                {/* 1. 로고 영역 */}
                <div className="header-logo">
                    <Link to={lobbyPath}>
                        <img src={logoImg} alt="근휴일 로고" className="logo-img" />
                    </Link>
                </div>
                {/* 2. 네비게이션 메뉴 영역 */}
                <nav className="header-nav">
                    <Link to="/facility/list" className="nav-item">시설</Link>

                    {isAdmin && (
                        <>
                            <div>
                                <Link to={memberListPath} className="nav-item">계정관리</Link>
                            </div>
                            <div>
                                <Link to="/admin/application/list" className="nav-item">워케이션신청내역</Link>
                            </div>
                            <div>
                                <Link to="/admin/notice/list" className="nav-item">공지사항</Link>
                            </div>
                        </>
                    )}

                    {isSuperAdmin && (
                        <>
                            <div>
                                <Link to="/admin/super/company/list" className="nav-item">고객사관리</Link>
                            </div>
                        </>
                    )}

                    {isCompanyAdmin && (
                        <>
                            <div>
                                <Link to="/crew/list" className="nav-item">크루</Link>
                            </div>
                        </>
                    )}

                    {isMember && (
                        <>
                            <div>
                                <Link to="/crew/list" className="nav-item">크루</Link>
                            </div>
                            <div>
                                <Link to="/application" className="nav-item">워케이션신청</Link>
                            </div>
                            <div>
                                <Link to="/reservation/list" className="nav-item">예약내역</Link>
                            </div>
                            <div>
                                <Link to="/admin/notice/list" className="nav-item">공지사항</Link>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;