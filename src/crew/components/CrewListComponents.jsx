import { useState,useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import CrewItemComponent from "./CrewItemComponent";

import {
    selectCrewListApi,
    searchCrewListApi,
    joinCrewApi,
    leaveCrewApi,
    selectMyCrewListApi
} from "../api/CrewApi";

function CrewListComponents() {

    const navigate = useNavigate();
    const loginRole = sessionStorage.getItem("loginRole") || "EMPLOYEE";
    const canCreateCrew = loginRole === "EMPLOYEE";

    // 크루 신청 중인 크루 ID
    // 내가 참여한 크루
    const [joinedCrews, setJoinedCrews] = useState([]);
    const [joinedCrewDetails, setJoinedCrewDetails] = useState([]);

    // 검색어
    const [keyword, setKeyword] = useState("");
    // 검색어 또한 쿼리스트링으로 처리해야 페이징 처리까지 완전히 적용 된다.
    const [searchParams, setSearchParams] = useSearchParams();

    // 검색어 또한 쿼리스트링으로 처리
    const searchKeyword = searchParams.get("keyword") || "";
    const sort = searchParams.get("sort") || "registered";
    // or 연산자로 최초 진입시 "" 로 초기화

    // 워케이션 신청 중인 크루 ID
    const [applyingWorkcation, setApplyingWorkcation] = useState(null);

    // 알림 메시지
    const [toast, setToast] = useState("");

    // 크루 목록을 저장할 상태값 설정
    const [crews,setCrews] = useState([]); // 크루 목록을 저장할 상태값 설정

    // 상황에 맞는 페이징바를 나타내는 Link컴포넌트를 배열에 차곡차곡 담아둘 State형 변수
    const [pageList,setPageList] = useState([]); // 페이징바를 나타내는 Link컴포넌트를 배열에 차곡차곡 담아둘 State형 변수

    // cpage 값이 새로고침 되는것을 막기 위해 queryString을 사용하여 cpage 값을 가져오기
    const cpage = parseInt(searchParams.get("cpage")) || 1;

    // Toast 출력
    const showToast = (msg) => {

        setToast(msg);

        setTimeout(() => {
            setToast("");
        }, 3000);
    };

    useEffect(() => {
        selectMyCrewListApi()
            .then(response => {
                const histories = response.data || [];
                setJoinedCrews(histories.map(history => history.crew?.crewId).filter(Boolean));
                setJoinedCrewDetails(histories.map(history => history.crew).filter(Boolean));
            })
            .catch(error => {
                console.log("가입 크루 조회 ajax 통신 실패", error);
            });
    }, []);


    // 크루 목록 조회 함수
    const setCrewList = async () => {

        try {

            const response = await selectCrewListApi(cpage, sort);

            handleResponse(response);

        } catch (error) {
            
            console.log("크루 조회 ajax 통신 실패 !");
            console.log(error);
        }
    };

    // 검색어 입력 내용이 변경 될 때 마다 실행할 이벤트 핸들러 함수
    const handleChange = (e) => {

        setKeyword(e.target.value);
    };

    // 검색 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const handleClick = (e) => {

        e.preventDefault();
        setSearchParams({ cpage: 1, keyword: keyword, sort });

    };

    // 검색 요청 함수
    const searchCrewList = async () => {
        try{

            const response = await searchCrewListApi(cpage, searchKeyword, sort);

            handleResponse(response);

        }catch{

            console.log("검색어 포함 크루 조회 ajax 통신 실패 !");

        }
    }

    // 크루 모집 글 수정 함수
    const handleUpdate = crewId => {

        navigate("/crew/update", {
        state: {
            crewId: crewId
        }
    });
        
    }

    // 크루 모집 글 삭제될 때 자동으로 새로고침 될 수 있는 함수
    const handleDeleteSuccess = crewId => {

    setCrews(prev =>
        prev.filter(crew => crew.crewId !== crewId)
    );

    };


    // 크루 참여 함수
    const handleJoin = async crewId => {
    try {
        const response = await joinCrewApi(crewId);
        if (response.data == "success") {
            alert("크루 신청 성공");
            // 가입한 크루 목록에 추가
            setJoinedCrews((prev) => [...prev, crewId]);
            const joinedCrew = crews.find(crew => crew.crewId === crewId);
            if (joinedCrew) {
                setJoinedCrewDetails(prev => [...prev, joinedCrew]);
            }
        } else {
            alert("크루 신청 실패");
        }
    } catch (error) {
        console.log("크루 신청 ajax 통신 실패", error);
        }
    };

    // 크루 탈퇴 함수
    const handleLeave = async crewId => {
        try {
            const response = await leaveCrewApi(crewId);

            if (response.data === "success") {
                setJoinedCrews(prev => prev.filter(id => id !== crewId));
                setJoinedCrewDetails(prev => prev.filter(crew => crew.crewId !== crewId));
                showToast("크루에서 탈퇴했습니다.");
            } else {
                alert("크루 탈퇴 실패");
            }
        } catch (error) {
            console.log("크루 탈퇴 ajax 통신 실패", error);
        }
    };

    // list, pi값을 각각 출력해주는 후처리 공통 함수

    const handleResponse = response => {

        // console.log("서버에 들어온 데이터 : " + response.data);

        const items = response.data?.list || [];

        const pageInfo = response.data?.pi;
        
        // 서버에서 받은 list 데이터를 그대로 crews 상태값에 저장
        setCrews(items);

        // pagination 처리
        // paging-area에 들어갈 데이터 후처리
        // console.log("pageInfo : " + pageInfo);
        // pageInfo.starPage ~ pageInfo.endPage까지 1씩 증가시키면서 페이징바 버튼 생성        
        const btnArr = [];

        if(cpage ==1 ){

            btnArr.push(
                <button
                    key="prev"
                    className="btn btn-info btn-sm  "
                    disabled
                >
                    &lt;
                </button>
            );
        }else {

            btnArr.push(
                <button
                    key="prev"
                    className="btn btn-info btn-sm  "
                    onClick={() => {
                        setSearchParams({ cpage: cpage - 1, keyword: searchKeyword, sort });
                    }}
                >
                    &lt;
                </button>
            );
        }

        for(let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
            if(cpage == p) {
                btnArr.push(
                    <button
                        key={p}
                        className="btn btn-info btn-sm  "
                        disabled
                    >
                        {p}
                    </button>
                );
                
            } else {

                btnArr.push(
                    <button
                        key={p}
                        className="btn btn-outline-info btn-sm  "
                        onClick={() => {
                            setSearchParams({ cpage: p, keyword: searchKeyword, sort });
                        }}
                    >
                        {p}
                    </button>
                );
            }
        }

        if(cpage == pageInfo.maxPage) {

            btnArr.push(
                <button
                    key="next"
                    className="btn btn-info btn-sm  "
                    disabled
                >
                    &gt;
                </button>
            );
        }else {

            btnArr.push(
                <button
                    key="next"
                    className="btn btn-outline-info btn-sm  "
                    onClick={() => {
                        setSearchParams({ cpage: cpage + 1, keyword: searchKeyword, sort });
                    }}
                >
                    &gt;
                </button>
            );
        }
        setPageList(btnArr);
    };

    useEffect(() => {
        if (searchKeyword === "") {
            setCrewList();
        } else {
            searchCrewList();
        }
    }, [cpage, searchKeyword, sort]);

    return (
        <div>

            {/* Toast */}
            {toast && (
                <div>
                    ✓ {toast}
                </div>
            )}

            {/* 제목 + 크루 만들기 */}
            <div>

                <div>
                    <h2>
                        크루 커뮤니티
                    </h2>

                    <p>
                        함께 워케이션을 떠날 크루를 찾거나 만들어보세요
                    </p>
                </div>

            </div>

            {/* 검색창 */}
            <div align="center" className="search-area">
                <form>
                    <input
                    type="text" name="keyword"
                    value={ keyword }
                    onChange={handleChange}
                    placeholder="크루명 또는 크루 소개를 검색해주세요."
                    />
                    <button type="submit" onClick={handleClick}>
                        검색
                    </button>
                    <button
                        type="button"
                        onClick={() => setKeyword("")}>
                        검색 초기화
                    </button>
                    <select
                        value={sort}
                        onChange={(e) => setSearchParams({ cpage: 1, keyword: searchKeyword, sort: e.target.value })}
                    >
                        <option value="registered">등록순</option>
                        <option value="deadline">마감일 순</option>
                    </select>
                </form>
                
            </div>

            {/* 크루 모집 작성 폼 */}

            {canCreateCrew && (
                <div>
                    <button
                        onClick={() => navigate("/crew/enroll")}
                    >
                        + 크루 만들기
                    </button>
                </div>
            )}

            {/* 내가 참여한 크루 */}
            {joinedCrews.length > 0 && (
                <div>
                    <p>
                        내가 가입한 크루
                    </p>
                    <div>
                        {joinedCrewDetails
                            .map((crew) => (
                                <div key={crew.crewId}>

                                    <div>
                                        <p>
                                            {crew.crewName}
                                        </p>
                                        <p>
                                            회사 :{" "}
                                            {crew.company?.companyName ?? "-"}
                                        </p>
                                        <p>
                                            마감일 :{" "}
                                            {crew.endDate?.substring(0, 10) ?? "-"}
                                        </p>
                                    </div>

                                    <div>

                                        <button
                                            onClick={() =>
                                                handleLeave(crew.crewId)
                                            }
                                        >
                                            탈퇴
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* 모집 중인 크루 */}
            <div>
                <p>
                    모집 중인 크루
                </p>
                <div>
                    {crews.map((crew) => (
                        <CrewItemComponent
                            key={crew.crewId}
                            item={crew}
                            joinedCrews={joinedCrews}
                            onJoin={handleJoin}
                            onLeave={handleLeave}
                            onUpdate={handleUpdate}
                            onDeleteSuccess={handleDeleteSuccess}
                        />
                    ))}
                </div>
            </div>
            {/* 페이징바 */}
            <div align="center" className="paging-area">
                {pageList}
            </div>
            <br /><br />

        </div>
    );
}


export default CrewListComponents;