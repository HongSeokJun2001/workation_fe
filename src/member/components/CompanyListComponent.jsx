import { useState, useEffect } from "react";

import { selectCompanyListApi } from "../api/companyApi";

import CompanyItemComponent from "./CompanyItemComponent";
import CompanyCreateModal from "./CompanyCreateModal";

function CompanyListComponent() {
    const [dataList, setDataList] = useState([]);
    const loginRole = sessionStorage.getItem("loginRole");
    const isSuperAdmin = loginRole === "SUPER";
    const [status, setStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(null);
    const [showCompanyCreateModal, setShowCompanyCreateModal] = useState(false);

    useEffect(() => {
    
        const selectCompanyList = async () => {

            try {

                let response;

                if (isSuperAdmin) {
                    response = await selectCompanyListApi(status, currentPage);
                } else {
                    alert("Only SUPER admin can access the company list.");
                }

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

    }, [isSuperAdmin, status, currentPage]);

    const changeFilter = setter => event => {
        setter(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <h2 align="center">고객사 목록 조회</h2>

                <div align="center">
                    {isSuperAdmin && (
                        <select value={status} onChange={changeFilter(setStatus)}>
                            <option value="ALL">All</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    )}
                </div>

                {(isSuperAdmin) && (
                    <div align="center">
                        <button onClick={() => setShowCompanyCreateModal(true)}>
                            고객사 등록
                        </button>
                    </div>
                )}

            <br /><br />

            <table className="list-area table table-hover">
                <thead>
                    <tr>
                        <th>회사명</th>
                        <th>사업자 번호</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList}
                </tbody>
            </table>

            {pageInfo && pageInfo.maxPage > 0 && (
                <div align="center">
                    <button type="button" disabled={currentPage === 1}
                            onClick={() => setCurrentPage(pageInfo.currentPage - 1)}>
                        이전
                    </button>
                    {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                        const page = pageInfo.startPage + index;
                        return (
                            <button type="button" key={page} disabled={page === currentPage}
                                    onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        );
                    })}
                    <button type="button" disabled={currentPage === pageInfo.maxPage}
                            onClick={() => setCurrentPage(pageInfo.currentPage + 1)}>
                        다음
                    </button>
                </div>
            )}

            <br /><br />

            {showCompanyCreateModal && (
                <CompanyCreateModal
                    onClose={() => setShowCompanyCreateModal(false)}
                    onCreated={() => setStatus("ALL")}
                />
            )}

        </div>
    );
}

export default CompanyListComponent;