import { useState, useEffect, useEffectEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CrewItemComponent from "./CrewItemComponent";
import { selectCrewListApi, searchCrewListApi, joinCrewApi, leaveCrewApi, selectMyCrewListApi, selectMyCreatedCrewListApi, selectMyActiveCreatedCrewListApi, selectCrewPageApi, selectCrewMemberNamesApi } from "../api/CrewApi";
import { selectMyEmployeeDetailApi } from "../../member/api/memberApi";
import "../styles/CrewCommunity.css";

function CrewListComponents() {

    const navigate = useNavigate();
    const loginRole = sessionStorage.getItem("loginRole") || "EMPLOYEE";
    const canCreateCrew = loginRole === "EMPLOYEE";

    // 크루 신청 중인 크루 ID
    // 내가 참여한 크루
    const [joinedCrews, setJoinedCrews] = useState([]);
    const [joinedCrewDetails, setJoinedCrewDetails] = useState([]);
    const [createdCrews, setCreatedCrews] = useState([]);
    const [showAllCreated, setShowAllCreated] = useState(false);
    const [showAllJoined, setShowAllJoined] = useState(false);
    const [memberCounts, setMemberCounts] = useState({});
    const [availableDays, setAvailableDays] = useState(null);

    // 검색어
    const [keyword, setKeyword] = useState("");
    // 검색어 또한 쿼리스트링으로 처리해야 페이징 처리까지 완전히 적용 된다.
    const [searchParams, setSearchParams] = useSearchParams();

    // 검색어 또한 쿼리스트링으로 처리
    const searchKeyword = searchParams.get("keyword") || "";
    const sort = searchParams.get("sort") || "createdDate";
    const targetCrewId = searchParams.get("crewId");

    // 알림 메시지
    const [toast, setToast] = useState("");

    // 크루 목록을 저장할 상태값 설정
    const [crews,setCrews] = useState([]);
    const [activeCrewCount, setActiveCrewCount] = useState(0);

    // 상황에 맞는 페이징바를 나타내는 Link컴포넌트를 배열에 차곡차곡 담아둘 State형 변수
    const [pageList,setPageList] = useState([]);

    const createdCrewIds = new Set(createdCrews.map(crew => crew.crewId));
    const joinedOnlyDetails = joinedCrewDetails.filter(crew => !createdCrewIds.has(crew.crewId));
    const joinedOnlyIds = joinedOnlyDetails.map(crew => crew.crewId);

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
        if (loginRole !== "EMPLOYEE") return;

        selectMyEmployeeDetailApi()
            .then(response => setAvailableDays(response.data?.workationAvailDays ?? 0))
            .catch(() => setAvailableDays(null));

        selectMyCrewListApi().then(response => {
            const responseData = response.data;
            const histories = Array.isArray(responseData)
                ? responseData
                : responseData?.list ?? responseData?.content ?? [];

            if (!Array.isArray(histories)) {
                console.error("가입 크루 조회 응답 형식 오류", responseData);
                return;
            }

            const crews = histories
                .map(item => item?.crew ?? item)
                .filter(crew => crew?.crewId);

            setJoinedCrews(crews.map(crew => crew.crewId));
            setJoinedCrewDetails(crews);


        }).catch(() => setJoinedCrewDetails([]));

        selectMyActiveCreatedCrewListApi()
            .then(response => setCreatedCrews(Array.isArray(response.data) ? response.data : []))
            .catch(() => setCreatedCrews([]));
    
    }, [loginRole]);

    useEffect(() => {
        const crewIds = [...joinedCrewDetails, ...createdCrews]
            .map(crew => crew.crewId)
            .filter((crewId, index, ids) => ids.indexOf(crewId) === index);

        if (crewIds.length === 0) return;

        Promise.all(crewIds.map(async crewId => {
            try {
                const response = await selectCrewMemberNamesApi(crewId);
                return [crewId, (response.data || []).length];
            } catch {
                return [crewId, 0];
            }
        })).then(entries => setMemberCounts(Object.fromEntries(entries)));
    }, [joinedCrewDetails, createdCrews]);


    // list, pi값을 각각 출력해주는 후처리 공통 함수
    function handleResponse(response) {

        const items = response.data?.list || [];
        const pageInfo = response.data?.pi;

        if (!Array.isArray(items)) {
            console.error("크루 목록 응답 형식 오류", response.data);
            setCrews([]);
            return;
        }

        setCrews(items);
        setActiveCrewCount(pageInfo?.listCount ?? items.length);

        if (!pageInfo) return;

        const btnArr = [];
        btnArr.push(<button key="prev" className="btn btn-info btn-sm" disabled={cpage == 1}
            onClick={() => setSearchParams({ cpage: cpage - 1, keyword: searchKeyword, sort })}>&lt;</button>);

        for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
            btnArr.push(<button key={p} className={cpage == p ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"}
                disabled={cpage == p}
                onClick={() => setSearchParams({ cpage: p, keyword: searchKeyword, sort })}>{p}</button>);
        }

        btnArr.push(<button key="next" className="btn btn-outline-info btn-sm" disabled={cpage == pageInfo.maxPage}
            onClick={() => setSearchParams({ cpage: cpage + 1, keyword: searchKeyword, sort })}>&gt;</button>);

        setPageList(btnArr);
    }



    // 검색 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const handleClick = e => { 
        e.preventDefault(); 
        
        setSearchParams({ cpage: 1, keyword: keyword, sort }); 
    
    };

    const openCreatedCrew = async crewId => {
        try {
            const response = await selectCrewPageApi(crewId);
            setSearchParams({ cpage: response.data, sort, crewId });
        } catch (error) {
            console.error("모집글 위치 조회 실패", error);
            setSearchParams({ cpage: 1, sort, crewId });
        }
    };



    // 크루 참여 함수
    const handleJoin = async crewId => { 
        const isConfirm = window.confirm("크루에 가입 하시겠습니까?");
        if (!isConfirm) return;
        
        try { const response = await joinCrewApi(crewId); 
            
            if (response.data == "success") { 
                
                alert("크루 가입 성공"); 
                
                setJoinedCrews(prev => [...prev, crewId]); 
                
                const joinedCrew = crews.find(crew => crew.crewId === crewId); 
                
                if (joinedCrew) setJoinedCrewDetails(prev => [...prev, joinedCrew]); 
            
                } else alert(response.data || "크루 가입 실패");
                
                } catch(error) {
                    alert(error.response?.data || "크루 가입에 실패했습니다.");
                    console.log("크루 가입 ajax 통신 실패", error);
                } };



    // 크루 탈퇴 함수
    const handleLeave = async crewId => { 
        const isConfirm = window.confirm("크루에서 탈퇴하시겠습니까?");
        if (!isConfirm) return;
        
        try { const response = await leaveCrewApi(crewId); 
            
            if (response.data === "success") {
                
                setJoinedCrews(prev => prev.filter(id => id !== crewId)); 
                
                setJoinedCrewDetails(prev => prev.filter(crew => crew.crewId !== crewId)); 
                
                showToast("크루에서 탈퇴했습니다."); 
            
            } else alert("크루 탈퇴 실패"); 
        
        } catch(error) { console.log("크루 탈퇴 ajax 통신 실패", error); 

        } };

    const handleDeleteSuccess = crewId => {
        setCrews(prev => prev.filter(crew => crew.crewId !== crewId));
        setCreatedCrews(prev => prev.filter(crew => crew.crewId !== crewId));
        setJoinedCrews(prev => prev.filter(id => id !== crewId));
        setJoinedCrewDetails(prev => prev.filter(crew => crew.crewId !== crewId));
        setActiveCrewCount(prev => Math.max(0, prev - 1));
    };




    const handleResponseEvent = useEffectEvent(handleResponse);



    useEffect(() => {
        let active = true;

        const loadCrewList = async () => {
            try {
                const response = searchKeyword === ""
                    ? await selectCrewListApi(cpage, sort)
                    : await searchCrewListApi(cpage, searchKeyword, sort);

                if (active) handleResponseEvent(response);
            } catch (error) {
                console.error("크루 목록 조회 ajax 통신 실패 !", error.response?.status, error.response?.data, error);
            }
        };

        loadCrewList();
        return () => { active = false; };
    }, [cpage, searchKeyword, sort]);

    useEffect(() => {
        if (!targetCrewId || crews.length === 0) return;

        document.getElementById(`crew-${targetCrewId}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, [crews, targetCrewId]);



    
    return (
        <main className="crew-page">
            {toast && <div className="crew-toast" role="status">✓ {toast}</div>}

            <section className="crew-hero">
                <div>
                    <p className="crew-eyebrow">WORKATION COMMUNITY</p>
                    <h2>크루 커뮤니티</h2>
                    <p>함께 워케이션을 떠날 크루를 찾거나 만들어보세요.</p>
                </div>
                {canCreateCrew && <button className="crew-primary-button" type="button" onClick={() => navigate("/crew/enroll")}>+ 크루 만들기</button>}
            </section>

            <div className="crew-toolbar">
                <form className="crew-search" onSubmit={handleClick}>
                    <input type="search" name="keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="🔎 크루명 또는 회사명을 검색해주세요." />
                    <select value={sort} onChange={e => setSearchParams({ cpage: 1, keyword: searchKeyword, sort: e.target.value })} aria-label="정렬 기준">
                        <option value="createdDate">등록순</option>
                        <option value="endDate">마감일 순</option>
                    </select>
                    <button className="crew-secondary-button" type="submit">검색</button>
                    <button className="crew-secondary-button" type="button" onClick={() => { setKeyword(""); setSearchParams({ cpage: 1, sort }); }}>초기화</button>
                </form>
            </div>

            {createdCrews.length > 0 && <section>
                <h3 className="crew-section-title">🚩 내가 모집하는 크루 <span>{createdCrews.length}개</span></h3>
                <div className="crew-joined-list">
                    {createdCrews.slice(0, showAllCreated ? createdCrews.length : 3).map(crew => <div className="crew-joined-card crew-joined-card--link" key={crew.crewId}
                        onClick={() => openCreatedCrew(crew.crewId)}>
                        <div><strong>{crew.crewName}</strong><p>{crew.company?.companyName ?? "회사 미등록"}</p><p>마감일 {crew.endDate?.substring(0, 10) ?? "-"}</p></div>
                        <div className="crew-joined-card__status">
                            <span>모집 정원 {memberCounts[crew.crewId] ?? 0}/{crew.capacity ?? "-"}명</span>
                            <span className={`crew-status${(memberCounts[crew.crewId] ?? 0) >= crew.capacity ? " crew-status--closed" : ""}`}>
                                {(memberCounts[crew.crewId] ?? 0) >= crew.capacity ? "신청 마감" : "모집글 보기"}
                            </span>
                        </div>
                    </div>)}
                </div>
                {createdCrews.length > 3 && <button className="crew-secondary-button crew-more-button" type="button" onClick={() => setShowAllCreated(prev => !prev)}>{showAllCreated ? "간략히 보기" : `더보기 (${createdCrews.length - 3})`}</button>}
            </section>}

            {joinedOnlyDetails.length > 0 && <section>
                <h3 className="crew-section-title">💌 내가 가입한 크루 <span>{joinedOnlyDetails.length}개</span></h3>
                <div className="crew-joined-list">
                    {joinedOnlyDetails.slice(0, showAllJoined ? joinedOnlyDetails.length : 3).map(crew => <div className="crew-joined-card" key={crew.crewId}>
                        <div><strong>{crew.crewName}</strong><p>{crew.company?.companyName ?? "회사 미등록"}</p><p>마감일 {crew.endDate?.substring(0, 10) ?? "-"}</p><span>모집 정원 {memberCounts[crew.crewId] ?? 0}/{crew.capacity ?? "-"}명</span></div>
                        {createdCrews.some(createdCrew => createdCrew.crewId === crew.crewId) ? <button className="crew-danger-button" type="button" disabled>작성자는 탈퇴 불가</button> : <button className="crew-danger-button" type="button" onClick={() => handleLeave(crew.crewId)}>탈퇴</button>}
                    </div>)}
                </div>
                {joinedOnlyDetails.length > 3 && <button className="crew-secondary-button crew-more-button" type="button" onClick={() => setShowAllJoined(prev => !prev)}>{showAllJoined ? "간략히 보기" : `더보기 (${joinedOnlyDetails.length - 3})`}</button>}
            </section>}

            <section>
                <h3 className="crew-section-title">📍 모집 중인 크루 <span>{activeCrewCount}개</span></h3>
                <div className="crew-card-grid">
                    {crews.length > 0 ? crews.map(crew => <CrewItemComponent
                        key={crew.crewId}
                        item={crew}
                        joinedCrews={joinedOnlyIds}
                        availableDays={availableDays}
                        onJoin={handleJoin}
                        onLeave={handleLeave}
                        onReEnroll={() => navigate("/crew/enroll", { state: { crew } })}
                        onUpdate={crewId => navigate("/crew/update", { state: { crewId } })}
                        onDeleteSuccess={handleDeleteSuccess}
                    />) : <p className="crew-empty">조건에 맞는 크루가 없습니다.</p>}
                </div>
            </section>

            <div className="crew-pagination" aria-label="크루 페이지 이동">{pageList}</div>
        </main>
    );
}
export default CrewListComponents;
