import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    approveEmployeeApi,
    selectCompanyAdminDetailApi,
    selectEmployeeDetailApi,
    selectMyEmployeeDetailApi,
    selectSuperAdminDetailApi,
    updateCompanyAdminApi,
    updateEmployeeApi,
    updateMyEmployeeApi,
    updateSuperAdminApi
} from "../api/memberApi";

function MemberDetailComponent(props) {

    const { memberType, selfMode = false } = props;
    const { adminId, employeeId } = useParams();
    const [member, setMember] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const loginRole = sessionStorage.getItem("loginRole");

    useEffect(() => {

        const selectMemberDetail = async () => {
            try {
                let response;

                if (memberType === "EMPLOYEE") {
                    response = selfMode
                        ? await selectMyEmployeeDetailApi()
                        : await selectEmployeeDetailApi(employeeId);
                } else if (loginRole === "SUPER") {
                    response = await selectSuperAdminDetailApi(adminId);
                } else {
                    response = await selectCompanyAdminDetailApi(adminId);
                }

                setMember(response.data);
            } catch (error) {
                console.error("계정 상세 조회 실패:", error);
                alert("계정 상세 조회 중 오류가 발생했습니다.");
            }
        };

        selectMemberDetail();
    }, [adminId, employeeId, loginRole, memberType]);

    const handleChange = e => {
        setMember({...member, [e.target.name]: e.target.value});
    };

    const handlePasswordChange = e => {
        const value = e.target.value;
        setPassword(value);

        if (value === "") {
            setPasswordMessage("");
            return;
        }

        if (!/^(?=.*[^A-Za-z0-9]).{8,15}$/.test(value)) {
            setPasswordMessage("비밀번호는 8~15자이며 특수문자를 포함해야 합니다.");
            return;
        }

        if (confirmPassword !== "" && value !== confirmPassword) {
            setPasswordMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        setPasswordMessage("");
    };

    const handleConfirmPasswordChange = e => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (value === "" || password === "") {
            setPasswordMessage("");
            return;
        }

        if (password !== value) {
            setPasswordMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!/^(?=.*[^A-Za-z0-9]).{8,15}$/.test(password)) {
            setPasswordMessage("비밀번호는 8~15자이며 특수문자를 포함해야 합니다.");
            return;
        }

        setPasswordMessage("");
    };

    const approveMember = async () => {
        try {
            if (memberType === "EMPLOYEE") {
                await approveEmployeeApi(employeeId);
            }
            alert("계정이 승인되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("계정 승인 실패:", error);
            alert(error.response?.data || "계정 승인 중 오류가 발생했습니다.");
        }
    };

    const updateMember = async () => {
        if (password !== "" || confirmPassword !== "") {
            if (!/^(?=.*[^A-Za-z0-9]).{8,15}$/.test(password)) {
                setPasswordMessage("비밀번호는 8~15자이며 특수문자를 포함해야 합니다.");
                return;
            }

            if (password !== confirmPassword) {
                setPasswordMessage("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        try {
            let response;
            const requestBody = selfMode
                ? {
                    ...member,
                    password,
                    empNo: undefined,
                    employeeName: undefined,
                    department: undefined,
                    position: undefined,
                    workationAvailDays: undefined,
                    status: undefined,
                    hireDate: undefined,
                    resignDate: undefined,
                    isProgressed: undefined
                }
                : { ...member, password };

            if (memberType === "EMPLOYEE") {
                response = selfMode
                    ? await updateMyEmployeeApi(requestBody)
                    : await updateEmployeeApi(employeeId, requestBody);
            } else if (loginRole === "SUPER") {
                response = await updateSuperAdminApi(adminId, requestBody);
            } else {
                response = await updateCompanyAdminApi(adminId, requestBody);
            }

            setMember(response.data);
            setPassword("");
            setConfirmPassword("");
            setPasswordMessage("");
            alert("계정 정보가 수정되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("계정 수정 실패:", error);
            alert(error.response?.data || "계정 수정 중 오류가 발생했습니다.");
        }
    };

    const handleCancel = () => {
        if (selfMode) {
            window.location.href = "/lobby";
        } else if (memberType === "EMPLOYEE") {
            window.location.href = "/admin/company/member/list";
        } else if (loginRole === "SUPER") {
            window.location.href = "/admin/super/member/list";
        } else {
            window.location.href = "/admin/company/member/list";
        }
    };

    if (member == null) {
        return <div>조회 중입니다.</div>;
    }

    if (memberType === "EMPLOYEE") {
        const isSelfEmployeeEdit = selfMode;
        const isCompanyAdminEmployeeEdit = !selfMode && loginRole === "COMPANY";
        const isEmployeeReadOnlyField = isSelfEmployeeEdit;

        return (
            <div>
                <h2 align="center">직원 계정 상세 조회</h2>

                <table>
                    <tbody>
                        <tr>
                            <th>회사</th>
                            <td>
                                <input
                                    value={member.companyLabel || ""}
                                    disabled={isSelfEmployeeEdit || isCompanyAdminEmployeeEdit}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>로그인 아이디</th>
                            <td>
                                <input
                                    name="loginId"
                                    value={member.loginId || ""}
                                    onChange={isSelfEmployeeEdit ? undefined : handleChange}
                                    readOnly={isSelfEmployeeEdit}
                                    disabled={isSelfEmployeeEdit}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>새 비밀번호</th>
                            <td><input type="password" value={password} onChange={handlePasswordChange} /></td>
                        </tr>
                        <tr>
                            <th>비밀번호 확인</th>
                            <td><input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>{passwordMessage}</td>
                        </tr>
                        <tr>
                            <th>사번</th>
                            <td><input name="empNo" value={member.empNo || ""} onChange={isEmployeeReadOnlyField ? undefined : handleChange} disabled={isEmployeeReadOnlyField} /></td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td><input name="employeeName" value={member.employeeName || ""} onChange={isEmployeeReadOnlyField ? undefined : handleChange} disabled={isEmployeeReadOnlyField} /></td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td><input name="phone" value={member.phone || ""} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td><input name="email" value={member.email || ""} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <th>부서</th>
                            <td><input name="department" value={member.department || ""} onChange={isEmployeeReadOnlyField ? undefined : handleChange} disabled={isEmployeeReadOnlyField} /></td>
                        </tr>
                        <tr>
                            <th>직급</th>
                            <td><input name="position" value={member.position || ""} onChange={isEmployeeReadOnlyField ? undefined : handleChange} disabled={isEmployeeReadOnlyField} /></td>
                        </tr>
                        <tr>
                            <th>워케이션 사용 가능 일수</th>
                            <td><input name="workationAvailDays" value={member.workationAvailDays ?? ""} onChange={isEmployeeReadOnlyField ? undefined : handleChange} disabled={isEmployeeReadOnlyField} /></td>
                        </tr>
                        <tr>
                            <th>상태</th>
                            <td>
                                <select
                                    name="status"
                                    value={member.status || "ACTIVE"}
                                    onChange={isEmployeeReadOnlyField ? undefined : handleChange}
                                    disabled={isEmployeeReadOnlyField}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="LOCKED">LOCKED</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>입사일</th>
                            <td><input type="date" name="hireDate" value={member.hireDate || ""} onChange={isEmployeeReadOnlyField ? undefined : handleChange} disabled={isEmployeeReadOnlyField} /></td>
                        </tr>
                        {!selfMode && (
                            <>
                                <tr>
                                    <th>퇴사일</th>
                                    <td><input type="date" name="resignDate" value={member.resignDate || ""} onChange={handleChange} disabled={isEmployeeReadOnlyField} /></td>
                                </tr>
                                <tr>
                                    <th>회원가입 처리 여부</th>
                                    <td><input name="isProgressed" value={member.isProgressed || ""} disabled /></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>

                <br />
                {!selfMode && member.isProgressed === "N" && (
                    <button type="button" onClick={approveMember}>계정 승인</button>
                )}
                <button type="button" onClick={updateMember}>계정 수정</button>
                <button type="button" onClick={handleCancel}>취소</button>
            </div>
        );
    }

    return (
        <div>
            <h2 align="center">관리자 계정 상세 조회</h2>

            <table>
                <tbody>
                    <tr>
                        <th>회사</th>
                        <td><input value={member.companyLabel || ""} disabled /></td>
                    </tr>
                    <tr>
                        <th>로그인 아이디</th>
                        <td><input name="loginId" value={member.loginId || ""} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <th>새 비밀번호</th>
                        <td><input type="password" value={password} onChange={handlePasswordChange} /></td>
                    </tr>
                    <tr>
                        <th>비밀번호 확인</th>
                        <td><input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{passwordMessage}</td>
                    </tr>
                    <tr>
                        <th>권한</th>
                        <td><input value={member.role || ""} disabled /></td>
                    </tr>
                    <tr>
                        <th>상태</th>
                        <td>
                            <select name="status" value={member.status || "ACTIVE"} onChange={handleChange}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="LOCKED">LOCKED</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br />
            <button type="button" onClick={updateMember}>계정 수정</button>
            <button type="button" onClick={handleCancel}>취소</button>
        </div>
    );
}

export default MemberDetailComponent;
