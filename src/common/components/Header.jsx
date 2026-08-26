import { Link } from "react-router-dom";

import "../styles/Header.css";

// 헤더를 나타내는 컴포넌트 - 모든 페이지 상단에 위치
// (기존의 menubar.jsp 에 대응됨)
function Header({ loginRole }) {

    const isAdmin = loginRole === "SUPER" || loginRole === "COMPANY";
    const isSuperAdmin = loginRole === "SUPER";

    const lobbyPath = loginRole === "SUPER"
        ? "/admin/super"
        : loginRole === "COMPANY"
            ? "/admin/company"
            : "/lobby";

    const memberListPath = loginRole === "SUPER"
        ? "/admin/super/member/list"
        : loginRole === "COMPANY"
            ? "/admin/company/member/list"
            : "/lobby";

    // 실행할 구문

    // return 구문
    return (
        <div>
            <h1 align="center">Welcome to React Manager</h1>

            <br/><br/>

            <div className="navi">
                <div>
                    <Link to={lobbyPath}>HOME</Link>
                </div>

                {isAdmin && (
                    <div>
                        <Link to={memberListPath}>회원관리</Link>
                    </div>
                )}

                {isSuperAdmin && (
                    <>
                        <div>
                            <Link to="/admin/notice/list">공지사항관리</Link>
                        </div>
                        <div>
                            <Link to="/facility/list">시설목록</Link>
                        </div>
                        <div>
                            <Link to="/admin/crew/list">크루관리</Link>
                        </div>
                    </>
                    
                )}

                {!isSuperAdmin && (
                    <>
                        <div>
                            <Link to="/facility/list">시설목록</Link>
                        </div>
                    </>
                    
                )}
            </div>
        </div>
    );
}

// 내보내기
export default Header;