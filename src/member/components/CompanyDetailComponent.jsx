import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    selectCompanyDetailApi,
    updateCompanyApi
} from "../api/companyApi";
import { extractErrorMessage } from "../../common/api/errorUtils";
import "../styles/MemberManagement.css";
import "../styles/CompanyManagement.css";

function CompanyDetailComponent() {

    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState({});
    const loginRole = sessionStorage.getItem("loginRole");
    const isSuperAdmin = loginRole === "SUPER";
    
    useEffect(() => {

        const selectCompanyDetail = async () => {

            try {
                let response
                
                if (isSuperAdmin) {
                    response = await selectCompanyDetailApi(companyId);
                }

                setCompany(response.data);
            } catch (error) {
                console.error(error);
                alert("최고 관리자만 접근할 수 있습니다.");
            }

        };

        selectCompanyDetail();

    }, [isSuperAdmin, companyId]);

    const handleChange = e => {
        setCompany({...company, [e.target.name]: e.target.value});
    };

    const updateCompany = async () => {
        try {
            let response;
            const requestBody = {
                ...company,
                createdDate: undefined
            };

            response = await updateCompanyApi(companyId, requestBody);

            setCompany(response.data);
            alert("고객사 정보가 성공적으로 업데이트되었습니다.");
            navigate("/admin/super/company/list");
        } catch (error) {
            console.error(error);
            alert(extractErrorMessage(error, "고객사 정보 업데이트 중 오류가 발생했습니다."));
        }
    };

    const handleCancel = () => {
        navigate("/admin/super/company/list");
    };

    if (company == null || company === '') {
        return (
            <div className="company-detail-container">
                <div className="company-detail-header"><h2>고객사 상세 정보</h2></div>
                <p>고객사 정보를 불러오는 중 오류가 발생했습니다.</p>
            </div>
        );
    }

    return (
        <div className="company-detail-container">
            <div className="company-detail-header"><h2>고객사 상세 정보</h2></div>

            <form className="company-detail-form" onSubmit={(event) => { event.preventDefault(); updateCompany(); }}>
                <div className="form-group">
                    <label>회사명</label>
                    <input name="companyName" value={company.companyName || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>사업자 번호</label>
                    <input name="businessNo" value={company.businessNo || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>상태</label>
                    <select name="status" value={company.status || "ACTIVE"} onChange={handleChange}>
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>생성일</label>
                    <input value={company.createdDate || ""} disabled />
                </div>
                <div className="btn-group-detail">
                    <button type="button" className="btn-secondary-custom" onClick={handleCancel}>취소</button>
                    <button type="submit" className="btn-primary-custom">저장하기</button>
                </div>
            </form>
        </div>
    );
}

export default CompanyDetailComponent;