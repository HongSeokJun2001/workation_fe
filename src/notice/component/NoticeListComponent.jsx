import { useNavigate } from "react-router-dom";

import {useState, useEffect} from "react";
import NoticeItemComponent from "./NoticeItemComponent";

import { selectNoticeListApi } from "../api/noticeApi";

function NoticeListComponent(){

    // 실행할 구문

    //URL 주소 전환용 navigate 함수 셋팅
    let navigate = useNavigate();

    // 조회된 데이터를 담을 state 변수 셋팅
    const [dataList, setDataList] = useState([]);

    useEffect(()=>{

        const setNoticeList = async () => {
            try{

                const response = await selectNoticeListApi();

                console.log(response.data);

                //응답데이터를 별도의 변수로 담기
                const items = response.data;

                const trArr = items.map((item,index)=>{
                    console.log(item);

                    return(
                        <NoticeItemComponent key={index} item={item}/>
                    );

                });

                setDataList(trArr);

            }catch(error){

                console.log("공지사항 목록 조회용 ajax 통신 실패")

            }
        };

        setNoticeList();

        
    },[]);




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
                        onClick={() => {navigate("/notice/enrollForm")}}>
                        글작성
                </button>
            </div>

            <br />

            {/* [고도화] 분류 추가 (ex.긴급, 이벤트, 일반, 점검) */}
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

        </div>


    
    );

}

export default NoticeListComponent;