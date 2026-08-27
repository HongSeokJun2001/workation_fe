import { useState, useEffect } from "react";

import {
    selectMemberListApi,
    selectCompanyAdminListApi,
    selectEmployeeListApi
} from "../api/memberApi";

import MemberItemComponent from "./MemberItemComponent";
import CompanyAdminCreateModal from "./CompanyAdminCreateModal";

function MemberListComponent() {

    // 실행할 구문
    const [dataList, setDataList] = useState([]);
    const loginRole = sessionStorage.getItem("loginRole");
    const isSuperAdmin = loginRole === "SUPER";
    const [status, setStatus] = useState("ALL");
    const [target, setTarget] = useState(isSuperAdmin ? "ALL" : "EMPLOYEE");
    const [isProgressed, setIsProgressed] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(null);
    const [showCompanyAdminCreateModal, setShowCompanyAdminCreateModal] = useState(false);
    const isEmployeeList = !isSuperAdmin && target === "EMPLOYEE";

    useEffect(() => {

        const selectMemberList = async () => {

            try {

                let response;

                if (isSuperAdmin) {
                    response = await selectMemberListApi(status, target, currentPage);
                } else if (target === "COMPANY_ADMIN") {
                    response = await selectCompanyAdminListApi(status, currentPage);
                } else {
                    response = await selectEmployeeListApi(status, isProgressed, currentPage);
                }

                const items = response.data.list || [];
                setPageInfo(response.data.pi);

                const trArr = items.map(item => {

                    return (
                        <MemberItemComponent
                            key={isEmployeeList ? item.employeeId : item.adminId}
                            item={item}
                            isEmployeeList={isEmployeeList}
                        />
                    );
                });

                setDataList(trArr);

            } catch(error) {

                console.log("회원 목록 조회용 ajax 통신 실패!");
            }
        };

        selectMemberList();
        
    }, [isSuperAdmin, status, target, isProgressed, currentPage]);

    const changeFilter = setter => event => {
        setter(event.target.value);
        setCurrentPage(1);
    };
    return (
        <div>
            <h2 align="center">계정 목록 조회</h2>

                <div align="center">
                    {isSuperAdmin ? (
                        <select value={target} onChange={changeFilter(setTarget)}>
                            <option value="ALL">최고관리자 + 본사관리자</option>
                            <option value="SUPER">최고관리자</option>
                            <option value="COMPANY">본사관리자</option>
                        </select>
                    ) : (
                        <select value={target} onChange={changeFilter(setTarget)}>
                            <option value="EMPLOYEE">직원</option>
                            <option value="COMPANY_ADMIN">본사관리자</option>
                        </select>
                    )}
                    <select value={status} onChange={changeFilter(setStatus)}>
                        <option value="ALL">전체</option>
                        <option value="ACTIVE">활성</option>
                        <option value="LOCKED">잠금</option>
                    </select>
                    {isEmployeeList && (
                        <select value={isProgressed} onChange={changeFilter(setIsProgressed)}>
                            <option value="ALL">회원가입 처리 여부 전체</option>
                            <option value="N">회원가입 처리 여부 N</option>
                            <option value="Y">회원가입 처리 여부 Y</option>
                        </select>
                    )}
                </div>

                {((!isSuperAdmin && target === "COMPANY_ADMIN") || (isSuperAdmin && (target === "SUPER" || target === "COMPANY"))) && (
                    <div align="center">
                        <button type="button" onClick={() => setShowCompanyAdminCreateModal(true)}>
                            {isSuperAdmin && target === "SUPER" ? "최고관리자 계정 추가" : "본사관리자 계정 추가"}
                        </button>
                    </div>
                )}

            <br/><br/>

            <table className="list-area table table-hover">
                <thead>
                    <tr>
                        {isEmployeeList ? (
                            <>
                                <th>사번</th>
                                <th>이름</th>
                                <th>부서</th>
                                <th>직급</th>
                                <th>상태</th>
                                <th>워케이션 사용 가능 일수</th>
                                <th>회원가입 처리 여부</th>
                            </>
                        ) : (
                            <>
                                <th>로그인 아이디</th>
                                <th>회사명</th>
                                <th>권한</th>
                                <th>상태</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>{ dataList }</tbody>
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

            <br/><br/>

            {showCompanyAdminCreateModal && (
                <CompanyAdminCreateModal
                    onClose={() => setShowCompanyAdminCreateModal(false)}
                    onCreated={() => setStatus("ALL")}
                    isSuperAdmin={isSuperAdmin}
                    isCompanyAdminCreation={target === "COMPANY" || target === "COMPANY_ADMIN"}
                />
            )}
        </div>
    );
}

export default MemberListComponent;