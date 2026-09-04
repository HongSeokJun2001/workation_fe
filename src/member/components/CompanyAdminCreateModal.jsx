import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import {
    createCompanyAdminApi,
    createCompanyAdminBySuperApi,
    createSuperAdminApi
} from "../api/memberApi";
import { selectActiveCompanyListApi } from "../api/companyApi";
import { extractErrorMessage } from "../../common/api/errorUtils";
import "../styles/AdminCreateModal.css";

function CompanyAdminCreateModal({ onClose, onCreated, isSuperAdmin = false, isCompanyAdminCreation = false }) {

    const [admin, setAdmin] = useState({ companyId: "", loginId: "", password: "", confirmPassword: "" });
    const [companies, setCompanies] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isSuperAdmin || !isCompanyAdminCreation) {
            return;
        }

        selectActiveCompanyListApi()
            .then(response => setCompanies(response.data))
            .catch(() => setMessage("회사 목록을 불러오지 못했습니다."));
    }, [isSuperAdmin, isCompanyAdminCreation]);

    const handleChange = event => {
        setAdmin({ ...admin, [event.target.name]: event.target.value });
        setMessage("");
    };

    const createCompanyAdmin = async event => {
        event.preventDefault();

        if (isSuperAdmin && isCompanyAdminCreation && !admin.companyId) {
            setMessage("회사를 선택해주세요.");
            return;
        }

        if (!admin.loginId.trim()) {
            setMessage("아이디를 입력해주세요.");
            return;
        }

        if (!/^(?=.*[^A-Za-z0-9]).{8,15}$/.test(admin.password)) {
            setMessage("비밀번호는 8~15자이며 특수문자를 포함해야 합니다.");
            return;
        }

        if (admin.password !== admin.confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const createApi = isSuperAdmin
                ? (isCompanyAdminCreation ? createCompanyAdminBySuperApi : createSuperAdminApi)
                : createCompanyAdminApi;
            await createApi({
                companyId: admin.companyId ? Number(admin.companyId) : undefined,
                loginId: admin.loginId,
                password: admin.password
            });
            alert(`${isCompanyAdminCreation ? "본사관리자" : "최고관리자"} 계정이 생성되었습니다.`);
            onCreated();
            onClose();
        } catch (error) {
            setMessage(extractErrorMessage(error, "본사관리자 계정 생성 중 오류가 발생했습니다."));
        }
    };

    return (
        <Modal show onHide={onClose} centered className="admin-create-modal">
            <Form className="admin-create-form" onSubmit={createCompanyAdmin}>
                <Modal.Header closeButton>
                    <div>
                        <span className="admin-create-kicker">ADMIN ACCOUNT</span>
                        <Modal.Title>{isCompanyAdminCreation ? "본사관리자" : "최고관리자"} 계정 추가</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="admin-create-fields">
                        {isSuperAdmin && isCompanyAdminCreation && (
                            <Form.Group className="mb-3">
                                <Form.Label>회사 선택</Form.Label>
                                <Form.Select name="companyId" value={admin.companyId} onChange={handleChange}>
                                    <option value="">회사를 선택해주세요</option>
                                    {companies.map(company => (
                                        <option key={company.companyId} value={company.companyId}>
                                            {company.companyName} ({company.businessNo})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>로그인 아이디</Form.Label>
                            <Form.Control name="loginId" value={admin.loginId} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" name="password" value={admin.password} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control type="password" name="confirmPassword" value={admin.confirmPassword} onChange={handleChange} />
                        </Form.Group>
                    </div>
                    {message && <Alert className="admin-create-alert mt-3" variant="danger">{message}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="admin-create-cancel" onClick={onClose}>닫기</Button>
                    <Button type="submit" className="admin-create-submit">생성</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CompanyAdminCreateModal;