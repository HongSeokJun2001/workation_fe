import { useState, useEffect } from "react";

import {
    selectMemberListApi,
    selectCompanyAdminListApi,
    selectEmployeeListApi
} from "../api/memberApi";

import MemberItemComponent from "./MemberItemComponent";

function MemberListComponent() {

    // 실행할 구문
    const [dataList, setDataList] = useState([]);
    const loginRole = sessionStorage.getItem("loginRole");
    const isSuperAdmin = loginRole === "SUPER";
    const [status, setStatus] = useState("ALL");
    const [target, setTarget] = useState(isSuperAdmin ? "ALL" : "EMPLOYEE");

    useEffect(() => {

        const selectMemberList = async () => {

            try {

                let response;

                if (isSuperAdmin) {
                    response = await selectMemberListApi(status, target);
                } else if (target === "COMPANY_ADMIN") {
                    response = await selectCompanyAdminListApi(status);
                } else {
                    response = await selectEmployeeListApi(status);
                }

                const items = response.data;

                const trArr = items.map((item, index) => {

                    return (
                        <MemberItemComponent key={ index } item={ item } />
                    );
                });

                setDataList(trArr);

            } catch(error) {

                console.log("회원 목록 조회용 ajax 통신 실패!");
            }
        };

        selectMemberList();
        
    }, [isSuperAdmin, status, target]);
    return (
        <div>
            <h2 align="center">계정 목록 조회</h2>

                <div align="center">
                    {isSuperAdmin ? (
                        <select value={target} onChange={event => setTarget(event.target.value)}>
                            <option value="ALL">최고관리자 + 본사관리자</option>
                            <option value="SUPER">최고관리자</option>
                            <option value="COMPANY">본사관리자</option>
                        </select>
                    ) : (
                        <select value={target} onChange={event => setTarget(event.target.value)}>
                            <option value="EMPLOYEE">직원</option>
                            <option value="COMPANY_ADMIN">본사관리자</option>
                        </select>
                    )}
                    <select value={status} onChange={event => setStatus(event.target.value)}>
                        <option value="ALL">전체</option>
                        <option value="ACTIVE">활성</option>
                        <option value="LOCKED">잠금</option>
                    </select>
                </div>

            <br/><br/>

            <table className="list-area table table-hover">
                <thead>
                    <tr>
                        <th width="180">아이디</th>
                        <th width="150">회사명</th>
                        <th width="150">권한</th>
                        <th width="100">상태</th>
                    </tr>
                </thead>
                <tbody>{ dataList }</tbody>
            </table>

            <br/><br/>
        </div>
    );
}

export default MemberListComponent;