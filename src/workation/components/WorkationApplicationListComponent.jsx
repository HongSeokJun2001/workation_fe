import { useState, useEffect, useCallback } from "react"; // useCallback 추가
import { getApplicationListApi } from "../api/workationApi";
import WorkationApplicationItemComponent from "./WorkationApplicationItemComponent";
import { WorkationFilterBar } from './WorkationFilterBar';

function WorkationApplicationListComponent() {

    const [cpage, setCpage] = useState(1);

    const [filters, setFilters] = useState({
        keyword: '',
        status: 'ALL',
        facility: 'ALL'
    });

    const [rawList, setRawList] = useState([]);
    const [pageInfo, setPageInfo] = useState(null);

    // 1. API 호출 시 filters 객체도 함께 백엔드로 전달
    const fetchData = useCallback(async () => {
        try {
            const response = await getApplicationListApi(cpage, filters);
            
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
            console.error("워케이션 신청 리스트 불러오기 실패:", error);
        }
    }, [cpage, filters]); // cpage나 filters가 변경될 때 함수 재생성

    // 2. 페이지 번호(cpage) 또는 필터(filters)가 바뀌면 데이터 재조회
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 3. 필터 변경 핸들러
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCpage(1); // 필터가 바뀌면 1페이지부터 다시 조회
    }, []);

    let dataList = [];

    if (rawList.length > 0) {   
        dataList = rawList.map((item, index) => (
            <WorkationApplicationItemComponent key={item.workationId || index} item={item}/>
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
        if (cpage === 1) {
            pageList.push(
                <button key="prev" className="btn btn-info btn-sm" disabled>
                    &lt;
                </button>
            );
        } else {
            pageList.push(
                <button 
                    key="prev" 
                    className="btn btn-info btn-sm"
                    onClick={() => setCpage(cpage - 1)}
                >
                    &lt;
                </button>
            );
        }

        for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
            if (cpage === p) {
                pageList.push(
                    <button key={p} className="btn btn-info btn-sm">
                        {p}
                    </button>
                );
            } else {
                pageList.push(
                    <button 
                        key={p} 
                        className="btn btn-outline-info btn-sm"
                        onClick={() => setCpage(p)}
                    >
                        {p}
                    </button>
                );
            }
        }

        if (cpage >= pageInfo.maxPage) {
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
        <div>
            <br /><br />
            <h2 align="center">워케이션 신청/예약 목록</h2>
            <br /><br />

            <WorkationFilterBar onFilterChange={handleFilterChange} />

            <br /><br />

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

export default WorkationApplicationListComponent;