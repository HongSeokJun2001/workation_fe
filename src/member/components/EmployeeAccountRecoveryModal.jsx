import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import {
    requestEmployeeLoginIdApi,
    requestEmployeePasswordResetApi,
    resetEmployeePasswordApi,
    verifyEmployeeRecoveryApi
} from "../api/memberApi";
import "../styles/EmployeeSignup.css";

function EmployeeAccountRecoveryModal({ onClose }) {

    const [mode, setMode] = useState("LOGIN_ID");
    const [step, setStep] = useState("REQUEST");
    const [requestId, setRequestId] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [foundLoginId, setFoundLoginId] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        companyName: "",
        employeeName: "",
        phone: "",
        email: "",
        loginId: ""
    });

    useEffect(() => {
        if (step !== "VERIFY" || remainingSeconds <= 0) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setRemainingSeconds(seconds => Math.max(seconds - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [step, remainingSeconds]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage("");
    };

    const changeMode = nextMode => {
        setMode(nextMode);
        setStep("REQUEST");
        setMessage("");
        setVerificationCode("");
        setRemainingSeconds(0);
        setFoundLoginId("");
        setResetToken("");
    };

    const requestCode = async e => {
        e.preventDefault();

        try {
            const response = mode === "LOGIN_ID"
                ? await requestEmployeeLoginIdApi(form)
                : await requestEmployeePasswordResetApi({ loginId: form.loginId });

            setRequestId(response.data.requestId);
            setStep("VERIFY");
            setRemainingSeconds(5 * 60);
            setMessage("등록된 이메일로 인증번호를 전송했습니다.");
        } catch (error) {
            setMessage(error.response?.data || "인증번호 전송 중 오류가 발생했습니다.");
        }
    };

    const verifyCode = async e => {
        e.preventDefault();

        if (remainingSeconds <= 0) {
            setMessage("인증번호 유효시간이 만료되었습니다. 인증번호를 다시 받아주세요.");
            return;
        }

        try {
            const response = await verifyEmployeeRecoveryApi({ requestId, verificationCode });
            if (mode === "LOGIN_ID") {
                setFoundLoginId(response.data.loginId);
                setStep("RESULT");
            } else {
                setResetToken(response.data.resetToken);
                setStep("RESET");
            }
            setMessage("");
        } catch (error) {
            setMessage(error.response?.data || "인증번호 확인 중 오류가 발생했습니다.");
        }
    };

    const resetPassword = async e => {
        e.preventDefault();

        if (!/^(?=.*[^A-Za-z0-9]).{8,15}$/.test(password)) {
            setMessage("비밀번호는 8~15자이며 특수문자를 포함해야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await resetEmployeePasswordApi({ resetToken, password });
            alert("비밀번호가 변경되었습니다.");
            onClose();
        } catch (error) {
            setMessage(error.response?.data || "비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    const renderRequestForm = () => mode === "LOGIN_ID" ? (
        <>
            <Form.Group className="mb-3">
                <Form.Label>소속 기업</Form.Label>
                <Form.Control name="companyName" value={form.companyName} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>이름</Form.Label>
                <Form.Control name="employeeName" value={form.employeeName} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>전화번호</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>이메일</Form.Label>
                <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
            </Form.Group>
        </>
    ) : (
        <Form.Group className="mb-3">
            <Form.Label>직원 아이디</Form.Label>
            <Form.Control name="loginId" value={form.loginId} onChange={handleChange} />
        </Form.Group>
    );

    const formattedRemainingTime = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

    return (
        <Modal show onHide={onClose} centered scrollable className="employee-signup-modal employee-recovery-modal">
            <Form className="employee-signup-form" onSubmit={step === "REQUEST" ? requestCode : step === "VERIFY" ? verifyCode : resetPassword}>
                <Modal.Header closeButton>
                    <div>
                        <div className="employee-signup-brand"><span className="employee-signup-brand-mark">W</span>워케이션 크루</div>
                        <Modal.Title>직원 ID/PW 찾기</Modal.Title>
                        <p className="employee-signup-caption">등록된 이메일 인증 후 계정을 확인할 수 있습니다.</p>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="employee-recovery-mode">
                        <Button type="button" className={mode === "LOGIN_ID" ? "active" : ""} onClick={() => changeMode("LOGIN_ID")}>
                            아이디 찾기
                        </Button>
                        <Button type="button" className={mode === "PASSWORD" ? "active" : ""} onClick={() => changeMode("PASSWORD")}>
                            비밀번호 찾기
                        </Button>
                    </div>

                    {step === "REQUEST" && <div className="employee-signup-fields">{renderRequestForm()}</div>}

                    {step === "VERIFY" && (
                        <div className="employee-signup-fields"><Form.Group>
                            <Form.Label>이메일 인증번호</Form.Label>
                            <Form.Control value={verificationCode} onChange={e => setVerificationCode(e.target.value)} maxLength={6} />
                            <Form.Text className={`employee-signup-message ${remainingSeconds > 0 ? "text-success" : "text-danger"}`}>
                                인증번호 유효시간: {formattedRemainingTime}
                            </Form.Text>
                        </Form.Group></div>
                    )}

                    {step === "RESULT" && (
                        <Alert className="employee-recovery-result" variant="success">직원 아이디는 <strong>{foundLoginId}</strong> 입니다.</Alert>
                    )}

                    {step === "RESET" && (
                        <div className="employee-signup-fields">
                            <Form.Group className="mb-3">
                                <Form.Label>새 비밀번호</Form.Label>
                                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>새 비밀번호 확인</Form.Label>
                                <Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </Form.Group>
                        </div>
                    )}

                    {message && <Alert className="mt-3" variant={step === "VERIFY" || step === "REQUEST" ? "danger" : "success"}>{message}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="employee-signup-secondary" onClick={onClose}>닫기</Button>
                    {step === "REQUEST" && <Button type="submit" className="employee-signup-primary">인증번호 받기</Button>}
                    {step === "VERIFY" && <Button type="submit" className="employee-signup-primary">인증번호 확인</Button>}
                    {step === "VERIFY" && remainingSeconds <= 0 && (
                        <Button type="button" className="employee-signup-check" onClick={() => setStep("REQUEST")}>인증번호 다시 받기</Button>
                    )}
                    {step === "RESET" && <Button type="submit" className="employee-signup-primary">비밀번호 변경</Button>}
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EmployeeAccountRecoveryModal;