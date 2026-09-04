import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import {
    checkEmployeeLoginIdApi,
    signupEmployeeApi
} from "../api/memberApi";
import { checkCompanyApi } from "../api/companyApi";
import { extractErrorMessage } from "../../common/api/errorUtils";
import "../styles/EmployeeSignup.css";

function EmployeeSignupModal(props) {

    const { onClose } = props;
    const [employee, setEmployee] = useState({
        businessNo: "",
        companyName: "",
        loginId: "",
        password: "",
        confirmPassword: "",
        empNo: "",
        employeeName: "",
        phone: "",
        email: "",
        department: "",
        position: ""
    });
    const [companyChecked, setCompanyChecked] = useState(false);
    const [loginIdChecked, setLoginIdChecked] = useState(false);
    const [messages, setMessages] = useState({});
    const [step, setStep] = useState(1);

    const handleChange = e => {
        const newEmployee = {...employee};
        newEmployee[e.target.name] = e.target.value;
        setEmployee(newEmployee);

        if (e.target.name === "businessNo" || e.target.name === "companyName") {
            setCompanyChecked(false);
            setMessages(messages => ({...messages, company: ""}));
        }

        if (e.target.name === "loginId") {
            setLoginIdChecked(false);
            setMessages(messages => ({...messages, loginId: ""}));
        }

        if (e.target.name === "password") {
            const isValidPassword = /^(?=.*[^A-Za-z0-9]).{8,15}$/.test(e.target.value);
            setMessages(messages => ({
                ...messages,
                password: isValidPassword || e.target.value === "" ? "" : "비밀번호는 8~15자이며 특수문자를 포함해야 합니다.",
                confirmPassword: newEmployee.confirmPassword === "" || e.target.value === newEmployee.confirmPassword
                    ? ""
                    : "비밀번호가 일치하지 않습니다."
            }));
        }

        if (e.target.name === "confirmPassword") {
            setMessages(messages => ({
                ...messages,
                confirmPassword: e.target.value === "" || employee.password === e.target.value
                    ? ""
                    : "비밀번호가 일치하지 않습니다."
            }));
        }
    };

    const checkCompany = async () => {
        if (!employee.businessNo || !employee.companyName) {
            setMessages(messages => ({...messages, company: "사업자번호와 회사명을 모두 입력해주세요."}));
            setCompanyChecked(false);
            return;
        }

        try {
            const response = await checkCompanyApi(employee.businessNo, employee.companyName);

            if (response.data === true) {
                setMessages(messages => ({...messages, company: "회사 정보가 확인되었습니다."}));
                setCompanyChecked(true);
            } else {
                setMessages(messages => ({...messages, company: "사업자번호와 회사명이 일치하는 회사가 없습니다."}));
                setCompanyChecked(false);
            }
        } catch (error) {
            console.error("회사 확인 실패:", error);
            setMessages(messages => ({...messages, company: "회사 확인 중 오류가 발생했습니다."}));
            setCompanyChecked(false);
        }
    };

    const checkLoginId = async () => {
        if (!employee.loginId) {
            setMessages(messages => ({...messages, loginId: "로그인 아이디를 입력해주세요."}));
            setLoginIdChecked(false);
            return;
        }

        try {
            const response = await checkEmployeeLoginIdApi(employee.loginId);

            if (response.data === true) {
                setMessages(messages => ({...messages, loginId: "사용 가능한 아이디입니다."}));
                setLoginIdChecked(true);
            } else {
                setMessages(messages => ({...messages, loginId: "이미 사용 중인 아이디입니다."}));
                setLoginIdChecked(false);
            }
        } catch (error) {
            console.error("아이디 중복 확인 실패:", error);
            setMessages(messages => ({...messages, loginId: "아이디 중복 확인 중 오류가 발생했습니다."}));
            setLoginIdChecked(false);
        }
    };

    const moveToAccountStep = event => {
        event.preventDefault();

        if (!employee.businessNo || !employee.companyName) {
            setMessages(messages => ({ ...messages, basic: "사업자번호와 소속 기업을 입력해주세요." }));
            return;
        }

        if (!companyChecked) {
            setMessages(messages => ({ ...messages, company: "회사 확인을 먼저 진행해주세요." }));
            return;
        }

        setMessages(messages => ({ ...messages, basic: "" }));
        setStep(2);
    };

    const signupEmployee = async e => {
        e.preventDefault();

        if (!companyChecked) {
            setMessages(messages => ({...messages, company: "회사 확인을 먼저 진행해주세요."}));
            return;
        }

        if (!loginIdChecked) {
            setMessages(messages => ({...messages, loginId: "아이디 중복 확인을 먼저 진행해주세요."}));
            return;
        }

        if (!/^(?=.*[^A-Za-z0-9]).{8,15}$/.test(employee.password)) {
            setMessages(messages => ({...messages, password: "비밀번호는 8~15자이며 특수문자를 포함해야 합니다."}));
            return;
        }

        if (employee.password !== employee.confirmPassword) {
            setMessages(messages => ({...messages, confirmPassword: "비밀번호가 일치하지 않습니다."}));
            return;
        }

        try {
            const { confirmPassword, ...signupRequest } = employee;

            await signupEmployeeApi({
                ...signupRequest,
                empNo: Number(signupRequest.empNo)
            });

            alert("직원 회원가입 신청이 완료되었습니다.");
            onClose();
        } catch (error) {
            console.error("직원 회원가입 신청 실패:", error);
            setMessages(messages => ({
                ...messages,
                submit: extractErrorMessage(error, "직원 회원가입 신청 중 오류가 발생했습니다.")
            }));
        }
    };

    const messageVariant = message => {
        if (!message) {
            return undefined;
        }

        return message.includes("확인되었습니다") || message.includes("사용 가능한")
            ? "success"
            : "danger";
    };

    const renderMessage = message => {
        if (!message) {
            return null;
        }

        return <Form.Text className={`employee-signup-message text-${messageVariant(message)}`}>{message}</Form.Text>;
    };

    return (
        <Modal show onHide={onClose} centered scrollable className="employee-signup-modal">
            <Form className="employee-signup-form" onSubmit={signupEmployee}>
                <Modal.Header closeButton>
                    <div>
                        <div className="employee-signup-brand"><span className="employee-signup-brand-mark">W</span>워케이션 크루</div>
                        <Modal.Title>직원 계정 만들기</Modal.Title>
                        <p className="employee-signup-caption">관리자 승인 후 서비스를 이용할 수 있습니다.</p>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="employee-signup-steps">
                        <div className={`employee-signup-step ${step === 1 ? "active" : ""}`}><span className="employee-signup-step-number">1</span>회사 정보</div>
                        <span className="employee-signup-step-line" />
                        <div className={`employee-signup-step ${step === 2 ? "active" : ""}`}><span className="employee-signup-step-number">2</span>기본 정보</div>
                    </div>

                    <div className="employee-signup-fields">
                        {step === 1 ? (
                            <>
                                <Form.Group className="mb-3"><Form.Label className="required">사업자번호</Form.Label><Form.Control name="businessNo" value={employee.businessNo} onChange={handleChange} /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label className="required">소속 기업</Form.Label><div className="employee-signup-inline"><Form.Control name="companyName" value={employee.companyName} onChange={handleChange} /><Button type="button" className="employee-signup-check" onClick={checkCompany}>회사 확인</Button></div>{renderMessage(messages.company)}</Form.Group>
                                <Form.Group className="mb-3"><Form.Label>부서</Form.Label><Form.Control name="department" value={employee.department} onChange={handleChange} /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>직급</Form.Label><Form.Control name="position" value={employee.position} onChange={handleChange} /></Form.Group>
                                <Form.Group><Form.Label className="required">사번</Form.Label><Form.Control name="empNo" value={employee.empNo} onChange={handleChange} /></Form.Group>
                            </>
                        ) : (
                            <>
                                <Form.Group className="mb-3"><Form.Label className="required">이름</Form.Label><Form.Control name="employeeName" value={employee.employeeName} onChange={handleChange} /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label className="required">이메일</Form.Label><Form.Control type="email" name="email" value={employee.email} onChange={handleChange} /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label className="required">로그인 아이디</Form.Label><div className="employee-signup-inline"><Form.Control name="loginId" value={employee.loginId} onChange={handleChange} /><Button type="button" className="employee-signup-check" onClick={checkLoginId}>중복 확인</Button></div>{renderMessage(messages.loginId)}</Form.Group>
                                <Form.Group className="mb-3"><Form.Label className="required">비밀번호</Form.Label><Form.Control type="password" name="password" value={employee.password} onChange={handleChange} />{renderMessage(messages.password)}</Form.Group>
                                <Form.Group className="mb-3"><Form.Label className="required">비밀번호 확인</Form.Label><Form.Control type="password" name="confirmPassword" value={employee.confirmPassword} onChange={handleChange} />{renderMessage(messages.confirmPassword)}</Form.Group>
                                <Form.Group className="mb-3"><Form.Label className="required">전화번호</Form.Label><Form.Control name="phone" value={employee.phone} onChange={handleChange} /></Form.Group>
                            </>
                        )}
                    </div>

                    {messages.basic && <Alert className="mt-3 mb-0" variant="danger">{messages.basic}</Alert>}

                    {messages.submit && <Alert variant="danger">{messages.submit}</Alert>}
                </Modal.Body>

                <Modal.Footer>
                    <Button type="button" className="employee-signup-secondary" onClick={step === 1 ? onClose : () => setStep(1)}>{step === 1 ? "닫기" : "이전"}</Button>
                    {step === 1 ? <Button type="button" className="employee-signup-primary" onClick={moveToAccountStep}>다음</Button> : <Button type="submit" className="employee-signup-primary">신청하기</Button>}
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EmployeeSignupModal;
