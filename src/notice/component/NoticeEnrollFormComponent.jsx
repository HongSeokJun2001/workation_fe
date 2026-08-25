
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { insertNoticeApi } from "../api/noticeApi";



function NoticeEnrollFormComponent(){

    //실행할 구문
    // 글작성 성공시 글목록 이동을 위한 네비게이트 함수 셋팅 
    let navigate = useNavigate();


    //입력값을 담아둘 State 형 변수 셋팅 
    const [notice, setNotice] = useState({
                                        noticeTitle:"",
                                        noticeContent:"",
                                        status:"Y"
                                        });



    // 입력값의 변동이 있을 때마다 실행할 이벤트 핸들러 함수 셋팅

    const handleChange = e => {

        const newNotice = {...notice};
        // 노티스 객체 복사

        newNotice[e.target.name] = e.target.value;

        setNotice(newNotice);
    }



    // 작성하기 버튼 클릭시 실행할 이벤트 핸들러 함수
    const insertNotice = async e => {

        e.preventDefault();
        //> 기본이벤트 제거

        try{

            const response = await insertNoticeApi(notice);

            if(response.data == "success"){
                // 공지사항 작성 성공
                alert("공지사항 작성에 성공했습니다.");

                //작성 성공일 경우 목록으로 이동
                navigate("/notice/list");


            }else{
                // 작성 실패시

                alert("공지사항 작성에 실패하였습니다. 다시 시도해주세요.");
            }


        }catch(error){

            console.log("공지사항 등록 ajax 통신 실패!");
        }
    }


    // return 구문

    return(

        <div>
            <h2 align="center"> 공지사항 작성 </h2>
            <br /><br />

            {/* 공지사항 작성용 폼 css 만들기 */}
            <form>
                {/* 테이블 css 정의 */}
                <table className="form table">
                    <tbody>
                        <tr>
                            <th width="130">제목</th>
                            <td>
                                <input type="text" name="noticeTitle"
                                                    value={notice.noticeTitle}
                                                    onChange={handleChange}/>
                            </td>

                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name="noticeContent"
                                            value={notice.noticeContent}
                                            onChange={handleChange}></textarea>
                            </td>
                        </tr>

                    </tbody>
                    
                </table>
                <br/><br/>

                <div align="center">
                    <button type="submit"
                            className="btn btn-outline-primary btn-sm"
                            onClick={insertNotice}>
                                작성하기
                    </button>
                    &nbsp;&nbsp;
                    <button type="reset"       
                            className="btn btn-outline-secondary btn-sm"
                            onClick={ () => { setNotice({noticeTitle : "",
                                                        noticeContent : "",
                                                        status : "Y"}); } }>
                        초기화
                    </button>

                </div>

                <br /><br/>
            </form>


        </div>
    );

}

// 내보내기
export default NoticeEnrollFormComponent;
