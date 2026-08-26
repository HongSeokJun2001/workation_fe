import { useNavigate, useSearchParams } from "react-router-dom";

import {useState, useEffect} from "react";
import NoticeItemComponent from "./NoticeItemComponent";

import { selectNoticeListApi } from "../api/noticeApi";

function NoticeListComponent(){

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
            try{

                const response = await selectNoticeListApi(cpage);

                console.log(response.data);

                const items = response.data?.list || [];

                const trArr = items.map((item,index)=>{
                    return(
                        <NoticeItemComponent key={item.noticeId ?? index} item={item}/>
                    );

                });

                setDataList(trArr);

                const pageInfo = response.data?.pi;
                if (pageInfo) {
                    const btnArr = [];

                    btnArr.push(
                        <button
                            key="prev"
                            className={cpage === 1 ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"}
                            disabled={cpage === 1}
                            onClick={() => setSearchParams({ cpage: cpage - 1 })}
                        >
                            &lt;
                        </button>
                    );

                    for (let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {
                        btnArr.push(
                            <button
                                key={p}
                                className={cpage === p ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"}
                                onClick={() => setSearchParams({ cpage: p })}
                            >
                                {p}
                            </button>
                        );
                    }

                    btnArr.push(
                        <button
                            key="next"
                            className={cpage === pageInfo.maxPage ? "btn btn-info btn-sm" : "btn btn-outline-info btn-sm"}
                            disabled={cpage === pageInfo.maxPage || pageInfo.maxPage === 0}
                            onClick={() => setSearchParams({ cpage: cpage + 1 })}
                        >
                            &gt;
                        </button>
                    );

                    setPageList(btnArr);
                }

            }catch{

                console.log("공지사항 목록 조회용 ajax 통신 실패")

            }
        };

        setNoticeList();

        
    }, [cpage, setSearchParams]);


    //return 구문

    return(

        <div>
            {/* [css]클래스네임 다시 주기 */}
            <h2 align="center">공지사항</h2>

            <br/><br/>

            {/* [고도화]검색창 영역 */}
            {/* <div align="center" className="search-area">

                <form>
                    <input type="text" name="keyword" placeholder="검색어를 입력하세요." value={keyword} onchange={}/>
                    <button type="submit" onClick={}>검색</button>
                </form>

            </div> */}

            {/* 글작성버튼, 스타일 나중에 주기 */}
            <div align="right">
                <button className="btn btn-outline-secondary btn-sm"
                        onClick={() => {navigate("/notice/enroll"); }}>
                        글작성
                </button>
            </div>

            <br />

            
            <table className="list-area table table-hover">
                <thead>
                    <tr>
                        <th width="150">글번호</th>
                        <th width="500">제목</th>
                        <th width="200">작성자</th>
                        <th width="150">조회수</th>
                        <th width="300">작성일</th>
                    </tr>   
                </thead>
                <tbody>
                    {dataList}
                </tbody>


            </table>

            <br/><br/>

            {/* 페이징바 영역 */}
            <div align="center" className="paging-area">{ pageList }</div>

            <br/><br/>

        </div>


    
    );

}

export default NoticeListComponent;