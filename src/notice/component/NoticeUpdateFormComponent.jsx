import {useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import{selectNoticeApi, updateNoticeApi} from"../api/noticeApi";
import "../styles/Notice.css";
function NoticeUpdateFormComponent(){


    const location = useLocation();

    const noticeId = location.state?.noticeId;

    let navigate = useNavigate();

    const [notice, setNotice] = useState({
                    noticeTitle:"",
                    noticeContent:"",
                    createDate:"",
                    status:"Y"});

    // 수정하기 페이지 > 기존의 글정보가 먼저 보여져야함 
    // 이 컴포넌트가 최초로 단 한 번 로딩 된 후 실행할 구문 내에서 상세 조회 먼저

    useEffect(()=>{ const fetchNotice = async () => { 
        
        if (!noticeId) { alert("잘못된 접근입니다."); navigate("/notice/list"); return; 


        } try { const response = await selectNoticeApi(noticeId); 
            
            setNotice({...response.data,status: response.data.status ?? "Y"}); 
        
        }catch{ console.log("공지사항 상세조회용 ajax 통신 실패 !"); } }; 
        
            fetchNotice(); 
    
    },[noticeId, navigate]);


    // 입력값 변경 시 실행할 이벤트 핸들러 함수
    const handleChange = e => { 
        
        const newNotice = {...notice}; 
        
        newNotice[e.target.name] = e.target.value; 
        
        setNotice(newNotice); };


    // 수정하기 버튼 클릭시 실행할 이벤트 핸들러 함수
    const updateNotice = async e => { 
        
        e.preventDefault(); 
        
        try { const payload = {...notice,noticeId,status: notice.status || "Y"}; 
        
        const response = await updateNoticeApi(noticeId, payload); 
        
        console.log(response.data); if(response.data == "success" || response.data == "sucess"){ 
            
            alert("공지사항 수정 성공!"); navigate(`/notice/detail/${noticeId}`); 
        
        }else { alert("공지사항 수정에 실패했습니다."); 
            
            } 
        
        }catch{ 
            
            console.log("공지사항 수정용 ajax통신 실패"); } };

    return (
        <main className="notice-form-page"><div className="notice-form-shell">
            <div className="notice-form-heading"><p className="notice-eyebrow">NOTICE ADMIN</p><h2>공지사항 수정</h2><p>게시된 공지 내용을 수정합니다.</p></div>

            <form id="update-form">
                {/* 제목과 내용은 데이터 표가 아닌 입력 폼이므로 반응형 필드 레이아웃을 사용합니다. */}
                <div className="notice-field"><label htmlFor="notice-update-title">제목</label><input id="notice-update-title" type="text" name="noticeTitle" value={notice.noticeTitle} onChange={handleChange} required /></div>
                <div className="notice-field"><label htmlFor="notice-update-content">내용</label><textarea id="notice-update-content" name="noticeContent" value={notice.noticeContent} onChange={handleChange} required /></div>
                <div className="notice-actions">
                    <button type="submit" className="crew-primary-button" onClick={updateNotice}>수정하기</button>
                    <button type="button" className="crew-secondary-button" onClick={() => navigate(`/notice/detail/${noticeId}`)}>뒤로가기</button>
                </div>
            </form>
        </div></main>
    );
}
export default NoticeUpdateFormComponent;
