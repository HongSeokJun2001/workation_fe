import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { selectFacilityListApi, searchFacilityListApi } from "../api/facilityApi";
import FacilityItemComponent from "./FacilityItemComponent";
import "../css/FacilityListComponent.css";
import AiChatbot from "./AiChatbot";

// 지역 카테고리 목록 정의 (전국 17개 시·도)
const REGION_LIST = [
    { label: "전체 지역", value: "ALL" },
    { label: "서울특별시", value: "서울" },
    { label: "경기도", value: "경기" },
    { label: "인천광역시", value: "인천" },
    { label: "강원특별자치도", value: "강원" },
    { label: "부산광역시", value: "부산" },
    { label: "대구광역시", value: "대구" },
    { label: "울산광역시", value: "울산" },
    { label: "경상북도", value: "경북" },
    { label: "경상남도", value: "경남" },
    { label: "광주광역시", value: "광주" },
    { label: "전북특별자치도", value: "전북" },
    { label: "전라남도", value: "전남" },
    { label: "대전광역시", value: "대전" },
    { label: "세종특별자치시", value: "세종" },
    { label: "충청북도", value: "충북" },
    { label: "충청남도", value: "충남" },
    { label: "제주특별자치도", value: "제주" }
];

function FacilityListComponent() {

    let navigate = useNavigate();

    const loginRole = sessionStorage.getItem("loginRole");

    // 입력된 검색어를 담아둘 State
    const [keyword, setKeyword] = useState("");

    // URL QueryString 조작을 위한 useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();

    // QueryString에서 검색어, 페이징, 정렬, 지역값 추출
    const searchKeyword = searchParams.get("keyword") || "";
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    const sort = searchParams.get("sort") || "LATEST";
    const region = searchParams.get("region") || "ALL"; // 기본값 ALL

    // 데이터 목록 및 페이징 버튼 UI를 담을 State
    const [dataList, setDataList] = useState([]);
    const [pageList, setPageList] = useState([]);

    // cpage 및 searchKeyword, sort, region 변경 시 자동 재조회
    useEffect(() => {
        if(searchKeyword === "") {
            selectFacilityList();
        } else {
            searchFacilityList();
        }
    }, [cpage, searchKeyword, sort, region]);

    // 일반 시설 목록 조회 함수
    const selectFacilityList = async () => {
        try {
            const response = await selectFacilityListApi(cpage, sort, region);
            handleResponse(response);
        } catch (error) {
            console.log("시설 목록 조회용 ajax 통신 실패!", error);
        }
    };

    // 시설 검색 요청용 함수
    const searchFacilityList = async () => {
        try {
            const response = await searchFacilityListApi(cpage, searchKeyword, sort, region);
            handleResponse(response);
        } catch(error) {
            console.log("시설 검색용 ajax 통신 실패!", error);
        }
    };

    // 검색어 입력 변경 핸들러
    const handleChange = (e) => {
        setKeyword(e.target.value);
    }

    // 검색 버튼 클릭 핸들러
    const handleClick = (e) => {
        e.preventDefault();
        setSearchParams({ cpage: 1, keyword: keyword, sort: sort, region: region });
    };

    // 정렬 변경 핸들러
    const handleSortChange = (newSort) => {
        setSearchParams({ cpage: 1, keyword: searchKeyword, sort: newSort, region: region });
    }

    // 드롭다운 지역 변경 선택 시
    const handleRegionChange = (e) => {
        const newRegion = e.target.value;
        setSearchParams({ cpage: 1, keyword: searchKeyword, sort: sort, region: newRegion });
    }

    // 서버 응답 데이터(list, pi) 후처리 공통 함수
    const handleResponse = (response) => {
        // 1. 시설 목록 데이터 매핑
        const items = response.data.list || response.data;

        if (Array.isArray(items)) {
            const itemArr = items.map((item, index) => {
                return (
                    <FacilityItemComponent key={item.facilityId || index} item={item} />
                );
            });
            setDataList(itemArr);
        } else {
            // 데이터가 없거나 빈 배열인 경우
            setDataList([]);
        }

        // 2. 페이징바 영역 데이터 후처리
        const pageInfo = response.data.pi;

        // 데이터가 없으면 페이징바도 비움
        if(!pageInfo || items.length === 0) {
            setPageList([]);
            return;
        }
        if (pageInfo) {
            const btnArr = [];

            // [이전] 버튼
            btnArr.push(
                <button
                    key="prev"
                    className="page-btn"
                    disabled={cpage === 1}
                    onClick={() => {
                        setSearchParams({ cpage: cpage - 1, keyword: searchKeyword, sort: sort, region: region });
                    }}
                >
                    이전
                </button>
            );

            // [숫자 페이지] 버튼
            for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
                btnArr.push(
                    <button
                        key={p}
                        className={`page-btn ${cpage === p ? "active" : ""}`}
                        onClick={() => {
                            setSearchParams({ cpage: p, keyword: searchKeyword, sort: sort, region: region });
                        }}
                    >
                        {p}
                    </button>
                );
            }

            // [다음] 버튼
            btnArr.push(
                <button
                    key="next"
                    className="page-btn"
                    disabled={cpage === pageInfo.maxPage || pageInfo.maxPage === 0}
                    onClick={() => {
                        setSearchParams({ cpage: cpage + 1, keyword: searchKeyword, sort: sort, region: region });
                    }}
                >
                    다음
                </button>
            );

            setPageList(btnArr);
        }
    };

    return (
        <div className="facility-list-container">
            <h2 className="facility-list-title">워케이션 시설 목록</h2>

            {/* 통합 검색 & 지역 드롭다운 영역 */}
            <div className="search-area">
                <form onSubmit={handleClick} className="search-form">
                    <select 
                        value={region} 
                        onChange={handleRegionChange} 
                        className="region-select-inline"
                    >
                        {REGION_LIST.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="text" 
                        name="keyword" 
                        placeholder="시설명 또는 키워드를 입력하세요" 
                        value={keyword} 
                        onChange={handleChange} 
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">검색</button>
                </form>
            </div>
            <div className="list-toolbar">
                {/* 정렬 버튼 영역 */}
                <div className="sort-btn-area">
                    <button className={`sort-btn ${sort === "LATEST" ? "active" : ""}`}
                            onClick={() => handleSortChange("LATEST")}>
                        최신순
                    </button>
                    <span className="sort-divider">|</span>
                    <button className={`sort-btn ${sort === "OLDEST" ? "active" : ""}`}
                            onClick={() => handleSortChange("OLDEST")}>
                        오래된순
                    </button>
                </div>

                {/* 시설 등록 버튼 (최고관리자용) */}
                {loginRole === "SUPER" && (
                    <div className="enroll-btn-area">
                        <button className="btn-enroll" onClick={() => {navigate("/facility/enroll");}}>
                            시설 등록
                        </button>
                    </div>
                )}
            </div>

            {/* 워케이션 시설 목록 */}
            {dataList.length > 0 ? (
                <div className="facility-list-area">
                    {dataList}
                </div>
            ) : (
                <div className="no-data-area">
                    <p className="no-data-msg">
                        {searchKeyword || region !== "ALL"
                            ? "조건에 맞는 워케이션 시설 검색 결과가 없습니다."
                            : "등록된 워케이션 시설이 없습니다."}
                    </p>
                </div>
            )}

            {/* 페이징바 영역 */}
            <div className="paging-area">
                {pageList}
            </div>

            {/* AI 챗봇 */}
            <AiChatbot/>
        </div>
    );
}

export default FacilityListComponent;