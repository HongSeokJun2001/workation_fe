import { useNavigate, useSearchParams } from "react-router-dom";
import {useState, useEffect} from "react";
import NoticeItemComponent from "./NoticeItemComponent";
import { selectNoticeListApi } from "../api/noticeApi";
import "../styles/Notice.css";
function NoticeListComponent(){

    const loginRole = sessionStorage.getItem("loginRole");
    const canManageNotice = loginRole === "SUPER";

    // 실행할 구문
    //URL 주소 전환용 navigate 함수 셋팅
    let navigate = useNavigate();

    // > cpage 값이 새로고침되는것을 막기 위해 QueryString 을 활용한다!!
    const [searchParams, setSearchParams] = useSearchParams();
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    // > or 연산자를 삼항연산자처럼 쓰면서 QueryString 상에 cpage 라는 키 + 밸류 세트가 없다면
    //   cpage 라는 변수에는 지금 1 로 초기화 될 것!!

    // 상황에 맞는 페이징 바를 나타내는 LInk컴포넌트를 배열에 담아둘 state 변수 셋팅
    const [pageList, setPageList] = useState([]);

    // 조회된 데이터를 담을 state 변수 셋팅
    const [dataList, setDataList] = useState([]);
    useEffect(() => { 
        
        
        const setNoticeList = async () => { 
            
            try { const response = await selectNoticeListApi(cpage); 
                
                const items = response.data?.list || []; 
                
                setDataList(items.map((item,index) => <NoticeItemComponent key={item.noticeId ?? index} item={item}/>)); 
                
                const pageInfo = response.data?.pi; 
                
                if (pageInfo) { const btnArr = []; 
                    
                    btnArr.push(<button key="prev" className={cpage === 1 ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"} 
                        
                        disabled={cpage === 1} onClick={() => setSearchParams({ cpage: cpage - 1 })}>&lt;</button>); 
                        
                        for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) btnArr.push(<button key={p} 
                            className={cpage === p ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"} onClick={() => setSearchParams({ cpage: p })}>
                                
                                {p}</button>); 
                                
                                btnArr.push(<button key="next" className={cpage === pageInfo.maxPage ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"} 
                                    
                                    disabled={cpage === pageInfo.maxPage || pageInfo.maxPage === 0} 
                                    
                                    onClick={() => setSearchParams({ cpage: cpage + 1 })}>&gt;</button>); 
                                    
                                    setPageList(btnArr); } 
                                
            } catch { console.log("공지사항 목록 조회용 ajax 통신 실패"); } }; 
                                    
                setNoticeList(); }
                                    
            , [cpage, setSearchParams]);

            
    //return 구문
    return (
        <main className="notice-page">
            <section className="notice-hero">
                <div><p className="notice-eyebrow">WORKATION NOTICE</p><h2>공지사항</h2><p>워케이션 서비스의 새로운 소식을 확인하세요.</p></div>
                {canManageNotice && <button className="crew-primary-button" type="button" onClick={() => navigate("/notice/enroll")}>글 작성</button>}
            </section>

            <div className="notice-table-wrap">
            <table className="notice-table">
                <thead>
                    <tr>
                        <th width="150">글번호</th>
                        <th width="500">제목</th>
                        <th width="200">작성자</th>
                        <th width="150">조회수</th>
                        <th width="300">작성일</th>
                    </tr>
                </thead>
                <tbody>{dataList}</tbody>
            </table></div>

            {/* 페이징바 영역 */}
            <div className="crew-pagination" aria-label="공지사항 페이지 이동">{pageList}</div>
        </main>
    );
}
export default NoticeListComponent;
