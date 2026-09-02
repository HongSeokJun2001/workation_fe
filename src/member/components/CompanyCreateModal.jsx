import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import { checkCompanyApi, createCompanyApi } from "../api/companyApi";
import "../styles/MemberManagement.css";
import "../styles/CompanyManagement.css";

function CompanyCreateModal(props) {

  const { onClose, onCreated } = props;
  const [company, setCompany] = useState({
    companyName: "",
    businessNo: ""
  });
  const [companyChecked, setCompanyChecked] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = e => {
    const newCompany = {...company};
    newCompany[e.target.name] = e.target.value;
    setCompany(newCompany);

    if (e.target.name === "businessNo" || e.target.name === "companyName") {
      setCompanyChecked(false);
      setMessage("");
    }
  };

  const checkCompany = async () => {
    if (!company.businessNo || !company.companyName) {
      setMessage("사업자번호와 회사명을 모두 입력해주세요.");
      setCompanyChecked(false);
      return;
    }

    try {
      const response = await checkCompanyApi(company.businessNo, company.companyName);

      if (response.data === true) {
        setMessage("이미 존재하는 회사입니다.");
        setCompanyChecked(false);
      } else {
        setMessage("회사 등록이 가능합니다.");
        setCompanyChecked(true);
      }
    } catch (error) {
      console.error("회사 확인 실패:" ,error);
      setMessage("회사 확인 중 오류가 발생했습니다.");
      setCompanyChecked(false);
    }
  };

  const createCompany = async e => {
    e.preventDefault();

    if (!companyChecked) {
      setMessage("회사 확인을 먼저 해주세요.");
      return;
    }

    try {
      await createCompanyApi(company);

      alert("회사 등록이 완료되었습니다.");
      onCreated?.();
      onClose();
    } catch (error) {
      console.error("회사 등록 실패:", error);
      setMessage(error.response?.data || "회사 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered className="company-create-modal">
      <Modal.Header closeButton>
        <div>
          <span className="company-create-kicker">COMPANY PROFILE</span>
          <Modal.Title>고객사 등록</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form className="company-create-form" onSubmit={createCompany}>
          <div className="company-create-fields">
            <Form.Group className="mb-3" controlId="formCompanyName">
              <Form.Label>회사명</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBusinessNo">
              <Form.Label>사업자번호</Form.Label>
              <Form.Control
                type="text"
                name="businessNo"
                value={company.businessNo}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          {message && (
            <Alert className="company-create-alert mt-3" variant={companyChecked ? "success" : "danger"}>
              {message}
            </Alert>
          )}
          <Modal.Footer>
            <Button type="button" className="company-create-cancel" onClick={onClose}>닫기</Button>
            <Button type="button" className="company-create-check" onClick={checkCompany}>회사 확인</Button>
            <Button type="submit" className="company-create-submit">등록</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CompanyCreateModal;