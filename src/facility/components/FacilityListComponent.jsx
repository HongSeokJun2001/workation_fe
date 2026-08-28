import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { selectFacilityListApi, searchFacilityListApi } from "../api/facilityApi";
import FacilityItemComponent from "./FacilityItemComponent";
import "../css/FacilityListComponent.css";

function FacilityListComponent() {

    // 실행할 구문
    let navigate = useNavigate();

    const loginRole = sessionStorage.getItem("loginRole");

    // 입력된 검색어를 담아둘 State
    const [keyword, setKeyword] = useState("");

    // URL QueryString 조작을 위한 useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();

    // QueryString에서 검색어 및 페이징 번호 추출
    const searchKeyword = searchParams.get("keyword") || "";
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    const sort = searchParams.get("sort") || "LATEST";
    

    // 데이터 목록 및 페이징 버튼 UI를 담을 State
    const [dataList, setDataList] = useState([]);
    const [pageList, setPageList] = useState([]);

    // cpage 및 searchKeyword, sort가 변경될 때마다 자동 재조회
    useEffect(() => {
        if(searchKeyword === "") {
            // 일반 목록 조회 처리
            selectFacilityList();
        } else {
            // 검색 목록 조회 처리
            searchFacilityList();
        }
    }, [cpage, searchKeyword, sort]);

    // 일반 시설 목록 조회 함수
    const selectFacilityList = async () => {
        try {
            const response = await selectFacilityListApi(cpage, sort);
            handleResponse(response);
        } catch (error) {
            console.log("시설 목록 조회용 ajax 통신 실패!", error);
        }
    };

    // 시설 검색 요청용 함수
    const searchFacilityList = async () => {
        try {
            const response = await searchFacilityListApi(cpage, searchKeyword, sort);
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

        // 검색시 1페이지로 이동하며 URL QueryString 변경
        setSearchParams({cpage : 1, keyword : keyword, sort: sort});
    };

    // 정렬 변경 핸들러
    const handleSortChange = (newSort) => {
        // 정렬 변경 시 1페이지로 이동하며 QueryString 변경
        setSearchParams({cpage: 1, keyword: searchKeyword, sort: newSort});
    }

    // 서버 응답 데이터(list, pi) 후처리 공통 함수
    const handleResponse = (response) => {
        // 1. 시설 목록 데이터 매핑 (가져온 데이터 목록)
        const items = response.data.list || response.data; // 페이징 안 되어있고 리스트만 올 경우 대비

        if (Array.isArray(items)) {
            const itemArr = items.map((item, index) => {
                return (
                    <FacilityItemComponent key={item.facilityId || index} item={item} />
                );
            });
            setDataList(itemArr);
        }

        // 2. 페이징바 영역 데이터 후처리
        const pageInfo = response.data.pi;

        // 서버에서 PageInfo가 넘어오는 경우 페이징바 생성
        if (pageInfo) {
            const btnArr = [];

            // [이전] 버튼
            if (cpage === 1) {
                btnArr.push(
                    <button key="prev" className="btn btn-info btn-sm" disabled>
                        &lt;
                    </button>
                );
            } else {
                btnArr.push(
                    <button
                        key="prev"
                        className="btn btn-outline-info btn-sm"
                        onClick={() => {
                            setSearchParams({ cpage: cpage - 1, keyword: searchKeyword, sort: sort });
                        }}
                    >
                        &lt;
                    </button>
                );
            }

            // [숫자 페이지] 버튼
            for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
                if (cpage === p) {
                    btnArr.push(
                        <button key={p} className="btn btn-info btn-sm">
                            {p}
                        </button>
                    );
                } else {
                    btnArr.push(
                        <button
                            key={p}
                            className="btn btn-outline-info btn-sm"
                            onClick={() => {
                                setSearchParams({ cpage: p, keyword: searchKeyword, sort: sort });
                            }}
                        >
                            {p}
                        </button>
                    );
                }
            }

            // [다음] 버튼
            if (cpage === pageInfo.maxPage || pageInfo.maxPage === 0) {
                btnArr.push(
                    <button key="next" className="btn btn-info btn-sm" disabled>
                        &gt;
                    </button>
                );
            } else {
                btnArr.push(
                    <button
                        key="next"
                        className="btn btn-outline-info btn-sm"
                        onClick={() => {
                            setSearchParams({ cpage: cpage + 1, keyword: searchKeyword, sort: sort });
                        }}
                    >
                        &gt;
                    </button>
                );
            }

            setPageList(btnArr);
        }
    };

    // return 구문
    return (
        <div className="facility-list-container">
            <h2 className="facility-list-title">워케이션 시설 목록</h2>

            {/* 검색창 영역 */}
            <div className="search-area">
                <form onSubmit={handleClick}>
                    <input 
                        type="text" 
                        name="keyword" 
                        placeholder="시설명 또는 지역을 입력하세요" 
                        value={keyword} 
                        onChange={handleChange} 
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-primary btn-sm">검색</button>
                </form>
            </div>

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

            {/* 시설 등록 버튼(최고관리자용) */}
            {loginRole === "SUPER" && (
                <div className="enroll-btn-area">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => {navigate("/facility/enroll");}}>
                        시설 등록
                    </button>
                </div>
            )}

            {/* 워케이션 시설 목록 */}
            <div className="facility-list-area">
                {dataList}
            </div>

            {/* 페이징바 영역 */}
            <div className="paging-area">
                {pageList}
            </div>
        </div>
    );
}

export default FacilityListComponent;