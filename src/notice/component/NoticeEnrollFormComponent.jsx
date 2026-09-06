import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { insertNoticeApi } from "../api/noticeApi";
import "../styles/Notice.css";
function NoticeEnrollFormComponent(){

    //실행할 구문
    // 글작성 성공시 글목록 이동을 위한 네비게이트 함수 셋팅 
    let navigate = useNavigate();

    //입력값을 담아둘 State 형 변수 셋팅 
    const [notice, setNotice] = useState({
                                noticeTitle:""
                                , noticeContent:""
                                , status:"Y"});

    // 입력값의 변동이 있을 때마다 실행할 이벤트 핸들러 함수 셋팅
    const handleChange = e => {
        const newNotice = {...notice};
        // 노티스 객체 복사
        newNotice[e.target.name] = e.target.value;
        setNotice(newNotice);
    };

    // 작성하기 버튼 클릭시 실행할 이벤트 핸들러 함수
    const insertNotice = async e => {
        e.preventDefault();
        //> 기본이벤트 제거
        try {
            const response = await insertNoticeApi(notice);
            if(response.data == "success"){
                // 공지사항 작성 성공
                alert("공지사항 작성에 성공했습니다.");
                //작성 성공일 경우 목록으로 이동
                navigate("/admin/notice/list");
            }else{
                // 작성 실패시
                alert("공지사항 작성에 실패하였습니다. 다시 시도해주세요.");
            }
        }catch{
            console.log("공지사항 등록 ajax 통신 실패!");
        }
    };

    // return 구문
    return (
        <main className="notice-form-page">
            <div className="notice-form-shell">
            <div className="notice-form-heading"><p className="notice-eyebrow">NOTICE ADMIN</p><h2>공지사항 작성</h2><p>서비스 이용자에게 전달할 소식을 작성합니다.</p></div>
            {/* 공지사항 작성용 폼 css 만들기 */}
            <form>
                {/* 제목과 내용은 데이터 표가 아닌 입력 폼이므로 반응형 필드 레이아웃을 사용합니다. */}
                <div className="notice-field"><label htmlFor="notice-title">제목</label><input id="notice-title" type="text" name="noticeTitle" value={notice.noticeTitle} onChange={handleChange} required /></div>
                <div className="notice-field"><label htmlFor="notice-content">내용</label><textarea id="notice-content" name="noticeContent" value={notice.noticeContent} onChange={handleChange} required /></div>
                <div className="notice-actions">
                    <button type="submit" className="crew-primary-button" onClick={insertNotice}>작성하기</button>
                    <button type="reset" className="crew-secondary-button"
                    onClick={() => setNotice({noticeTitle:"",noticeContent:"",status:"Y"})}>
                        초기화</button>
                </div>
            </form>
            </div>
        </main>
    );
}
export default NoticeEnrollFormComponent;
