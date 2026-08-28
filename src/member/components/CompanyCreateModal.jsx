import { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";

import { createCompanyApi } from "../api/companyApi";
import { checkCompanyApi } from "../api/memberApi";

function CompanyCreateModal(props) {

  const { onClose } = props;
  const [company, setCompany] = useState({
    companyName: "",
    businessNo: ""
  });
  const [companyChecked, setCompanyChecked] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleChange = e => {
    const newCompany = {...company};
    newCompany[e.target.name] = e.target.value;
    setCompany(newCompany);

    if (e.target.name === "businessNo" || e.target.name === "companyName") {
      setCompanyChecked(false);
      setMessages(messages => [{...messages, company: ""}]);
    }
  };

  const checkCompany = async () => {
    if (!company.businessNo || !company.companyName) {
      setMessages(messages => [{...messages, company: "사업자번호와 회사명을 모두 입력해주세요."}]);
      setCompanyChecked(false);
      return;
    }

    try {
      const response = await checkCompanyApi(company.businessNo, company.companyName);

      if (response.data === true) {
        setMessages(messages => [{...messages, company: "이미 존재하는 회사입니다."}]);
        setCompanyChecked(false);
      } else {
        setMessages(messages => [{...messages, company: "회사 등록이 가능합니다."}]);
        setCompanyChecked(true);
      }
    } catch (error) {
      console.error("회사 확인 실패:" ,error);
      setMessages(messages => [{...messages, company: "회사 확인 중 오류가 발생했습니다."}]);
      setCompanyChecked(false);
    }
  };

  const createCompany = async e => {
    e.preventDefault();

    if (!companyChecked) {
      setMessages(messages => [{...messages, company: "회사 확인을 먼저 해주세요."}]);
      return;
    }

    try {
      await createCompanyApi(company);

      alert("회사 등록이 완료되었습니다.");
      onClose();
    } catch (error) {
      console.error("회사 등록 실패:", error);
      setMessages(messages => [{
        ...messages, 
        company: error.response?.data || "회사 등록 중 오류가 발생했습니다."
      }]);
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>회사 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {messages.length > 0 && messages[0].company && (
          <Alert variant={companyChecked ? "success" : "danger"}>
            {messages[0].company}
          </Alert>
        )}
        <Form onSubmit={createCompany}>
          <Form.Group as={Row} className="mb-3" controlId="formCompanyName">
            <Form.Label column sm={3}>회사명</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formBusinessNo">
            <Form.Label column sm={3}>사업자번호</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="businessNo"
                value={company.businessNo}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Button variant="primary" onClick={checkCompany} className="me-2">
            회사 확인
          </Button>
          <Button variant="success" type="submit">
            회사 등록
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CompanyCreateModal;