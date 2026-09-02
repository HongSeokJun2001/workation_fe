import { useState, useEffect } from "react";

import { selectCompanyListApi } from "../api/companyApi";

import CompanyItemComponent from "./CompanyItemComponent";
import CompanyCreateModal from "./CompanyCreateModal";
import "../styles/MemberManagement.css";
import "../styles/CompanyManagement.css";

function CompanyListComponent() {
    const [dataList, setDataList] = useState([]);
    const loginRole = sessionStorage.getItem("loginRole");
    const isSuperAdmin = loginRole === "SUPER";
    const [status, setStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(null);
    const [showCompanyCreateModal, setShowCompanyCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
    
        const selectCompanyList = async () => {

            if (!isSuperAdmin) {
                alert("최고 관리자만 접근할 수 있습니다.");
                return;
            }

            try {

                const response = await selectCompanyListApi(status, currentPage);

                const items = response.data.list || [];
                setPageInfo(response.data.pi);

                const trArr = items.map(item => {

                    return (
                        <CompanyItemComponent key={item.id} item={item} />
                    );
                });

                setDataList(trArr);

            } catch (error) {
                console.error(error);
            }

        };
        selectCompanyList();

    }, [isSuperAdmin, status, currentPage, refreshKey]);

    const changeFilter = setter => event => {
        setter(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="company-container">
            <div className="company-header">
                <div>
                    <h2>고객사 관리</h2>
                    <p className="company-subtitle">고객사 정보와 사용 상태를 관리합니다.</p>
                </div>
                {isSuperAdmin && (
                    <button className="btn-add-account" onClick={() => setShowCompanyCreateModal(true)}>
                        고객사 등록
                    </button>
                )}
            </div>

            <div className="company-filter-bar">
                {isSuperAdmin && (
                    <select className="company-filter-select" value={status} onChange={changeFilter(setStatus)}>
                        <option value="ALL">상태 전체</option>
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                    </select>
                )}
            </div>

            <div className="company-table-card">
                <table className="company-table">
                    <thead>
                        <tr>
                            <th>회사명</th>
                            <th>사업자 번호</th>
                            <th>상태</th>
                            <th className="text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList}
                    </tbody>
                </table>
            </div>

            {pageInfo && pageInfo.maxPage > 0 && (
                <div className="company-pagination">
                    <button type="button" disabled={currentPage === 1}
                            className="page-btn" onClick={() => setCurrentPage(pageInfo.currentPage - 1)}>
                        이전
                    </button>
                    {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                        const page = pageInfo.startPage + index;
                        return (
                                <button type="button" key={page} disabled={page === currentPage}
                                    className={`page-btn ${page === currentPage ? "active" : ""}`}
                                    onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        );
                    })}
                    <button type="button" disabled={currentPage === pageInfo.maxPage}
                            className="page-btn" onClick={() => setCurrentPage(pageInfo.currentPage + 1)}>
                        다음
                    </button>
                </div>
            )}

            {showCompanyCreateModal && (
                <CompanyCreateModal
                    onClose={() => setShowCompanyCreateModal(false)}
                    onCreated={() => {
                        setStatus("ALL");
                        setCurrentPage(1);
                        setRefreshKey(key => key + 1);
                    }}
                />
            )}

        </div>
    );
}

export default CompanyListComponent;