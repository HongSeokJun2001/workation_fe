import { useState, useEffect, useCallback } from "react";
import { getReservationListApi } from "../api/workationApi";
import WorkationReservationItemComponent from "./WorkationReservationItemComponent";
import { WorkationFilterBar } from './WorkationFilterBar';

import '../styles/WorkationCommon.css';
import "../styles/WorkationList.css"; 

function WorkationReservationListComponent() {
  const [cpage, setCpage] = useState(1);

  const [filters, setFilters] = useState({
    keyword: '',
    status: 'ALL',
    facility: 'ALL'
  });

  const [rawList, setRawList] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCpage(1); // 검색조건 변경 시 1페이지로 리셋
  }, []);

  const fetchData = async () => {
    try {
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

  useEffect(() => {
    fetchData();
  }, [cpage, filters]);

  // 테이블 내 바디 리스트 생성
  let dataList = [];
  if (rawList.length > 0) {
    dataList = rawList.map((item, index) => (
      <WorkationReservationItemComponent key={item.reservationId || index} item={item} />
    ));
  } else {
    dataList = (
      <tr>
        <td colSpan="6" className="no-data-cell">
          조회된 데이터가 없습니다.
        </td>
      </tr>
    );
  }

  // 페이지네이션 버튼 생성
  let pageList = [];
  if (pageInfo) {
    // [이전] 버튼
    pageList.push(
      <button
        key="prev"
        className="page-btn"
        disabled={cpage === 1}
        onClick={() => setCpage((prev) => prev - 1)}
      >
        &lt;
      </button>
    );

    // [페이지 번호] 버튼들
    for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
      pageList.push(
        <button
          key={p}
          className={`page-btn ${cpage === p ? "active" : ""}`}
          onClick={() => setCpage(p)}
        >
          {p}
        </button>
      );
    }

    // [다음] 버튼
    const maxPage = pageInfo.maxPage || pageInfo.endPage;
    pageList.push(
      <button
        key="next"
        className="page-btn"
        disabled={cpage >= maxPage}
        onClick={() => setCpage((prev) => prev + 1)}
      >
        &gt;
      </button>
    );
  }

  return (
    <div className="workation-container">
      {/* 헤더 영역 */}
      <div className="workation-header">
        <h2>워케이션 예약 목록</h2>
        <p className="workation-subtitle">신청된 워케이션 내역을 확인하고 관리합니다.</p>
      </div>

      {/* 필터바 */}
      <WorkationFilterBar onFilterChange={handleFilterChange} />

      {/* 리스트 테이블 카드 */}
      <div className="workation-table-card">
        <table className="workation-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>크루이름</th>
              <th style={{ width: "10%" }}>크루장</th>
              <th style={{ width: "28%" }}>신청기간</th>
              <th style={{ width: "22%" }}>시설 및 장소</th>
              <th style={{ width: "14%" }}>예약신청일</th>
              <th style={{ width: "14%" }}>예약상태</th>
            </tr>
          </thead>
          <tbody>{dataList}</tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination-container">{pageList}</div>
    </div>
  );
}

export default WorkationReservationListComponent;