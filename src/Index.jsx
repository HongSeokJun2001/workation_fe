import "./index.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginMemberApi } from "./auth/api/authApi";
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
                alert(error.response.data || "아이디 또는 비밀번호가 올바르지 않습니다.");
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
        navigate("/");

    };

    const selectLoginType = loginType => {
        setMember({...member, loginType});

    };

    const moveToSignup = () => {
        setShowSignupModal(true);

    };

    const moveToFindAccount = () => {
        alert("아이디/비밀번호 찾기 기능은 아직 연결되지 않았습니다.");

    };

    if(accessToken != null) {

        const loginTitle = loginRole === "EMPLOYEE"
            ? "직원 로그인"
            : "관리자 로그인";

        // return 구문 - 로그인 후에는 로그아웃 버튼만 보여주기
        return (
            <div>
                <h2 align="center">{loginTitle}</h2>
                <div align="center">
                    {loginRole === "EMPLOYEE" && (
                        <button className="btn btn-primary"
                                onClick={() => navigate('/employee/my-info')}>
                            정보 수정
                        </button>
                    )}
                    <button className="btn btn-danger"
                            onClick={ logoutMember }>
                        로그아웃
                    </button>
                </div>
            </div>
        );
    } else {

        // return 구문 - 로그인 전에는 로그인 폼만 보여주기
        return (
            <div>
                <h2 align="center">{member.loginType === "ADMIN" ? "관리자 로그인" : "직원 로그인"}</h2>

                <br /><br />

                <div align="center">
                    <button type="button" onClick={() => selectLoginType("ADMIN")}>관리자로그인</button>
                    <button type="button" onClick={() => selectLoginType("EMPLOYEE")}>직원로그인</button>
                    <button type="button" onClick={moveToSignup}>직원 계정 생성</button>
                    <button type="button" onClick={moveToFindAccount}>아이디/비번 찾기</button>
                </div>

                <br /><br />

                <form id="login-form">
                    <table>
                        <tbody>
                            <tr>
                                <th>아이디</th>
                                <td>
                                    <input type="text" name="loginId" 
                                            value={member.loginId}
                                            onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <th>비밀번호</th>
                                <td>
                                    <input type="password" name="password" 
                                            value={member.password}
                                            onChange={handleChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <br /><br />

                    <div align="center">
                        <button className="btn btn-primary"
                                onClick={ loginMember }>
                            로그인
                        </button>
                    </div>

                    <br /><br />
                </form>

                {showSignupModal && (
                    <EmployeeSignupModal onClose={() => setShowSignupModal(false)} />
                )}
            </div>
        );
    }
}

export default Index;