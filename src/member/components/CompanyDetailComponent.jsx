import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    selectCompanyDetailApi,
    updateCompanyApi
} from "../api/companyApi";

function CompanyDetailComponent() {

    const { companyId } = useParams();
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
                alert("Only SUPER admin can access the company details.");
            }

        };

        selectCompanyDetail();

    }, [isSuperAdmin, companyId]);

    const handleChange = e => {
        setCompany({...company, [e.target.name]: e.target.value});
    };

    const updateMember = async () => {
        try {
            let response;
            const requestBody = {
                ...company,
                createdDate: undefined
            };

            response = await updateCompanyApi(companyId, requestBody);

            setCompany(response.data);
            alert("고객사 정보가 성공적으로 업데이트되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error.response?.data || "고객사 정보 업데이트 중 오류가 발생했습니다.");
        }
    };

    const handelCancel = () => {
        window.location.href = "/admin/super/company/list";
    };

    if (company == null || company === '') {
        return (
            <div>
                <h2 align="center">고객사 상세 조회</h2>
                <p>고객사 정보를 불러오는 중 오류가 발생했습니다.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 align="center">고객사 상세 조회</h2>

            <table>
                <tbody>
                    <tr>
                        <th>회사명</th>
                        <td><input name="companyName" value={company.companyName} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <th>사업자 번호</th>
                        <td><input name="businessNo" value={company.businessNo} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <th>상태</th>
                        <td>
                            <select name="status" value={company.status} onChange={handleChange}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>생성일</th>
                        <td><input value={company.createdDate} disabled /></td>
                    </tr>
                </tbody>
            </table>

            <br />
            <button type="button" onClick={updateMember}>정보 수정</button>
            <button type="button" onClick={handelCancel}>취소</button>
        </div>
    );
}

export default CompanyDetailComponent;