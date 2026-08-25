import { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";

import {
    checkCompanyApi,
    checkEmployeeLoginIdApi,
    signupEmployeeApi
} from "../api/memberApi";

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
                submit: error.response?.data || "직원 회원가입 신청 중 오류가 발생했습니다."
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

        return <Form.Text className={`text-${messageVariant(message)}`}>{message}</Form.Text>;
    };

    return (
        <Modal show onHide={onClose} centered>
            <Form onSubmit={signupEmployee}>
                <Modal.Header closeButton>
                    <Modal.Title>직원 계정 생성</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>사업자번호</Form.Label>
                        <Form.Control name="businessNo" value={employee.businessNo} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>회사명</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control name="companyName" value={employee.companyName} onChange={handleChange} />
                            </Col>
                            <Col xs="auto">
                                <Button type="button" variant="secondary" onClick={checkCompany}>회사 확인</Button>
                            </Col>
                        </Row>
                        {renderMessage(messages.company)}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>로그인 아이디</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control name="loginId" value={employee.loginId} onChange={handleChange} />
                            </Col>
                            <Col xs="auto">
                                <Button type="button" variant="secondary" onClick={checkLoginId}>중복 확인</Button>
                            </Col>
                        </Row>
                        {renderMessage(messages.loginId)}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" name="password" value={employee.password} onChange={handleChange} />
                        {renderMessage(messages.password)}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>비밀번호 확인</Form.Label>
                        <Form.Control type="password" name="confirmPassword" value={employee.confirmPassword} onChange={handleChange} />
                        {renderMessage(messages.confirmPassword)}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>사번</Form.Label>
                        <Form.Control name="empNo" value={employee.empNo} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>이름</Form.Label>
                        <Form.Control name="employeeName" value={employee.employeeName} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control name="phone" value={employee.phone} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control name="email" value={employee.email} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>부서</Form.Label>
                        <Form.Control name="department" value={employee.department} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>직급</Form.Label>
                        <Form.Control name="position" value={employee.position} onChange={handleChange} />
                    </Form.Group>

                    {messages.submit && <Alert variant="danger">{messages.submit}</Alert>}
                </Modal.Body>

                <Modal.Footer>
                    <Button type="button" variant="secondary" onClick={onClose}>닫기</Button>
                    <Button type="submit" variant="primary">신청</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EmployeeSignupModal;
