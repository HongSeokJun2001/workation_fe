import { useState, useEffect, useCallback } from "react";
import { getReservationListApi } from "../api/workationApi";
import WorkationReservationItemComponent from "./WorkationReservationItemComponent";
import { WorkationFilterBar } from './WorkationFilterBar';

function WorkationReservationListComponent() {

    const [cpage, setCpage] = useState(1);

    const [filters, setFilters] = useState({
        keyword: '',
        status: 'ALL',
        facility: 'ALL'
    });

    const [rawList, setRawList] = useState([]);
    const [pageInfo, setPageInfo] = useState(null);

    // 필터바에서 검색/상태/시설 변경 시 실행될 함수
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCpage(1); // 조건 변경 시 첫 페이지로 리셋
    }, []);

    const fetchData = async () => {
        try {
            // filters 파라미터도 함께 백엔드로 전달
            const response = await getReservationListApi(cpage, filters);
        
            console.log("백엔드에서 넘어온 전체 response.data:", response.data);
            
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
            console.error("워케이션 예약 리스트 불러오기 실패:", error);
        }
    };

    // [중요] cpage 또는 filters 변경 시 데이터 재조회
    useEffect(() => {
        fetchData();
    }, [cpage, filters]);

    let dataList = [];

    if (rawList.length > 0) {
        dataList = rawList.map((item, index) => (
            <WorkationReservationItemComponent key={item.reservationId || index} item={item}/>
        ));
    } else {
        dataList = (
            <tr>
                <td colSpan="5" align="center">조회된 데이터가 없습니다.</td>
            </tr>
        );
    }

    let pageList = [];

    if (pageInfo) {
        // [이전] 버튼
        if (cpage === 1) {
            pageList.push(
                <button key="prev" className="btn btn-info btn-sm me-1" disabled>
                    &lt;
                </button>
            );
        } else {
            pageList.push(
                <button 
                    key="prev" 
                    className="btn btn-info btn-sm me-1"
                    onClick={() => setCpage(cpage - 1)}
                >
                    &lt;
                </button>
            );
        }

        // [페이지 번호] 버튼들
        for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
            if (cpage === p) {
                pageList.push(
                    <button key={p} className="btn btn-info btn-sm me-1">
                        {p}
                    </button>
                );
            } else {
                pageList.push(
                    <button 
                        key={p} 
                        className="btn btn-outline-info btn-sm me-1"
                        onClick={() => setCpage(p)}
                    >
                        {p}
                    </button>
                );
            }
        }

        // [다음] 버튼
        const maxPage = pageInfo.maxPage || pageInfo.endPage;
        if (cpage >= maxPage) {
            pageList.push(
                <button key="next" className="btn btn-info btn-sm" disabled>
                    &gt;
                </button>
            );
        } else {
            pageList.push(
                <button 
                    key="next" 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => setCpage(cpage + 1)}
                >
                    &gt;
                </button>
            );
        }
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>

            <h2 align="center">워케이션 예약 목록</h2>

            <br /><br />

            {/* 1. 필터 바 배치 */}
            <WorkationFilterBar onFilterChange={handleFilterChange} />

            <div align="center">
                <table className="list-area table table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>크루이름</th>
                            <th style={{ width: "10%" }}>크루장</th>
                            <th style={{ width: "35%" }}>신청기간</th>
                            <th style={{ width: "20%" }}>시설 및 장소</th>
                            <th style={{ width: "15%" }}>예약신청일</th>
                            <th style={{ width: "10%" }}>예약상태</th>
                        </tr>
                    </thead>
                    <tbody>{ dataList }</tbody>
                </table>
            </div>

            <br/>

            <div align="center" className="paging-area">{ pageList }</div>

            <br /><br />
        </div>
    );
}

export default WorkationReservationListComponent;