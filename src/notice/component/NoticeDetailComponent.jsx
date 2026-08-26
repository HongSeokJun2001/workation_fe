import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { selectNoticeApi, deleteNoticeApi } from "../api/noticeApi";


function NoticeDetailComponent(){

    //실행할 구문
    //pahtVariable 방식으로 얻어온 글번호 셋팅
    const { noticeId } = useParams();


    // 조회한 데이터를 담아둘 state 변수 셋팅
    const [notice, setNotice] = useState({noticeId: "",
                                          noticeTitle:"",
                                          admin : {adminId : ""},
                                          noticeContent:"",
                                          createDate : ""});


    let navigate = useNavigate();
        // 공지사항 상세조회 못한 경우 목록으로 돌아갈 navigate 함수 설정

                                        
    // 컴포넌트가 로딩된 후 한번만 실행할 수 있도록

    useEffect(()=>{

        const selectNotice = async () => {

            if (!noticeId) {
                navigate("/notice/list");
                return;
            }

            try{

                const response = await selectNoticeApi(noticeId);

                if(response.data && response.data.noticeId){
                    // 상세 조회가 된경우 (data 에 빈값이 아닌 경우)

                    // 그대로 state 형 변수에 담기 (setter 로)
                    setNotice(response.data);

                }else{

                    //조회데이터가 없는 경우

                    alert("이미 삭제되거나 없는 공지사항입니다.");

                    // 공지사항 목록 페이지로 이동

                    navigate("/notice/list");
                }

            }catch(error){

                console.log("공지사항 상세 조회용 ajax 통신 실패!");
            }
        };

        selectNotice();


    }, [noticeId, navigate]);
    
    // 삭제하기 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const deleteNotice = async() => {

        try{

            const response = await deleteNoticeApi(noticeId);

            //console.log(response.data);

            if(response.data == "success"){

                alert("공지사항 삭제에 성공했습니다.");

                // 공지사항 목록 페이지로 이동
                navigate("/admin/notice/list");
            }else{

                //삭제 실패

                alert("공지사항 삭제에 실패했습니다.");

            }


        }catch(error){
            console.log("공지사항 삭제용 ajax 통신 실패");

        }
    }

    return(

        <div>
            <h2 align="center">공지사항 상세 조회</h2>

            <br /><br />

            <table className="table">
                <tbody>
                    <tr>
                        <th width="130">제목</th>
                        <td colSpan="3">
                            { notice.noticeTitle }
                        </td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>관리자</td>

                        <th width="130">작성일</th>
                        <td>{ notice.createDate ? notice.createDate.substring(0, 10) : "" }</td>

                        <th>조회수</th>
                        <td>{ notice.viewCount ? notice.viewCount : "" }</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td colSpan="3">
                            <p style={ {height : "300px"} }>
                                { notice.noticeContent }
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br /><br />

            <div align="center">
                <button className="btn btn-outline-secondary btn-sm"
                        onClick={ () => { navigate("/admin/notice/list"); } }>
                    목록으로
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-outline-warning btn-sm"
                        onClick={ () => { navigate("/notice/updateForm", {state : {noticeId}}); } }>
                    수정하기
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-outline-danger btn-sm"
                        onClick={ deleteNotice }>
                    삭제하기
                </button>
            </div>

            <br /><br />

        </div>
    )
}

//내보내기
export default NoticeDetailComponent;