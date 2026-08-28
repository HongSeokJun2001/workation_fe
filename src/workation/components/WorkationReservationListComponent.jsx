import { useState, useEffect } from "react";
import { getReservationListApi } from "../api/workationApi";
import WorkationReservationItemComponent from "./WorkationReservationItemComponent";

function WorkationReservationListComponent() {

    const [cpage, setCpage] = useState(1);

    const [rawList, setRawList] = useState([]);

    const [pageInfo, setPageInfo] = useState(null);

    const fetchData = async () => {
        try {

            const response = await getReservationListApi(cpage);
        
            //console.log("백엔드에서 넘어온 전체 response.data:", response.data);
            
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
    };

    useEffect(() => {
        fetchData();
    }, [cpage]);

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
        const maxPage = pageInfo.maxPage || pageInfo.endPage; // maxPage 예외 방어
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
        <div>

            <br /><br />

            <h2 align="center">워케이션 예약 목록</h2>

            <br /><br />

            <div align="center">
                <table className="list-area table table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "15%" }}>크루</th>
                            <th style={{ width: "35%" }}>신청기간</th>
                            <th style={{ width: "20%" }}>시설</th>
                            <th style={{ width: "15%" }}>예약상태</th>
                            <th style={{ width: "15%" }}>예약신청일</th>
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