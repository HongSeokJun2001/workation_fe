import { useState, useEffect, useCallback } from "react";
import { getApplicationListApi } from "../api/workationApi";
import WorkationApplicationItemComponent from "./WorkationApplicationItemComponent";
import { WorkationFilterBar } from './WorkationFilterBar';
import '../styles/WorkationCommon.css';
import "../styles/WorkationList.css";

function WorkationApplicationListComponent() {
    const [cpage, setCpage] = useState(1);
    const [filters, setFilters] = useState({
        keyword: '',
        status: 'ALL',
        facility: 'ALL'
    });

    const [rawList, setRawList] = useState([]);
    const [pageInfo, setPageInfo] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await getApplicationListApi(cpage, filters);
            setRawList(response.data.list || []);

            if (response.data.pi) {
                setPageInfo(response.data.pi);
            } else if (response.data.totalPages !== undefined) {
                setPageInfo({
                    startPage: 1,
                    endPage: response.data.totalPages,
                    maxPage: response.data.totalPages
                });
            }
        } catch (error) {
            console.error("워케이션 신청 리스트 불러오기 실패:", error);
        }
    }, [cpage, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCpage(1);
    }, []);

    // 렌더링용 테이블 데이터
    let dataList = [];
    if (rawList.length > 0) {   
        dataList = rawList.map((item, index) => (
            <WorkationApplicationItemComponent key={item.workationId || index} item={item}/>
        ));
    } else {
        dataList = (
            <tr>
                <td colSpan="6" className="no-data-cell">조회된 데이터가 없습니다.</td>
            </tr>
        );
    }

    // 페이징 버튼 생성
    let pageList = [];
    if (pageInfo) {
        // 이전 버튼
        pageList.push(
            <button 
                key="prev" 
                className="page-btn"
                disabled={cpage === 1}
                onClick={() => setCpage(cpage - 1)}
            >
                이전
            </button>
        );

        // 페이지 번호 버튼
        for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
            pageList.push(
                <button 
                    key={p} 
                    className={`page-btn ${cpage === p ? 'active' : ''}`}
                    onClick={() => setCpage(p)}
                >
                    {p}
                </button>
            );
        }

        // 다음 버튼
        pageList.push(
            <button 
                key="next" 
                className="page-btn"
                disabled={cpage >= pageInfo.maxPage}
                onClick={() => setCpage(cpage + 1)}
            >
                다음
            </button>
        );
    }

    return (
        <div className="workation-container">
            {/* Header Area */}
            <div className="workation-header">
                <h2>워케이션 신청/예약 목록</h2>
                <p className="workation-subtitle">신청된 워케이션 내역을 확인하고 관리합니다.</p>
            </div>

            {/* Filter Area */}
            <WorkationFilterBar onFilterChange={handleFilterChange} />

            {/* Table Area */}
            <div className="workation-table-card">
                <table className="workation-table">
                    <thead>
                        <tr>
                            <th style={{ width: "12%" }}>크루이름</th>
                            <th style={{ width: "12%" }}>크루장</th>
                            <th style={{ width: "32%" }}>신청기간</th>
                            <th style={{ width: "20%" }}>시설 및 장소</th>
                            <th style={{ width: "14%" }}>예약신청일</th>
                            <th style={{ width: "10%" }}>예약상태</th>
                        </tr>
                    </thead>
                    <tbody>{ dataList }</tbody>
                </table>
            </div>

            {/* Pagination Area */}
            <div className="pagination-container">
                { pageList }
            </div>
        </div>
    );
}

export default WorkationApplicationListComponent;