import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectNoticeApi, selectNoticeNavigationApi, deleteNoticeApi } from "../api/noticeApi";
import "../styles/Notice.css";
function NoticeDetailComponent(){

    const loginRole = sessionStorage.getItem("loginRole");
    const canManageNotice = loginRole === "SUPER";

    //실행할 구문
    //pahtVariable 방식으로 얻어온 글번호 셋팅
    const { noticeId } = useParams();

    // 조회한 데이터를 담아둘 state 변수 셋팅
    const [notice, setNotice] = useState({
                    noticeId:""
                    , noticeTitle:""
                    , admin:{adminId:""}
                    , noticeContent:""
                    , createDate:""});
    const [navigation, setNavigation] = useState({ previous: null, next: null });

    let navigate = useNavigate();

    // 상세조회 실패 시 목록으로 돌아갈 navigate 함수 설정

    // 컴포넌트가 로딩된 후 한번만 실행할 수 있도록
    useEffect(()=>{
        const selectNotice = async () => {
            if (!noticeId) { navigate("/notice/list"); 
                return; 
            }try {
                const response = await selectNoticeApi(noticeId);

                if(response.data && response.data.noticeId){
                    // 상세 조회가 된경우 (data 에 빈값이 아닌 경우)
                    // 그대로 state 형 변수에 담기 (setter 로)
                    setNotice(response.data);

                    const navigationResponse = await selectNoticeNavigationApi(noticeId);
                    setNavigation(navigationResponse.data || { previous: null, next: null });


                }else{
                    //조회데이터가 없는 경우
                    alert("이미 삭제되거나 없는 공지사항입니다.");
                    // 공지사항 목록 페이지로 이동
                    navigate("/notice/list");
                }

            }catch{ console.log("공지사항 상세 조회용 ajax 통신 실패!"); }
        };

        selectNotice();


    }, [noticeId, navigate]);

    // 삭제하기 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const deleteNotice = async() => {

        const isConfirm = window.confirm("공지사항을 삭제하시겠습니까?");
        if (!isConfirm) return;

        try{
            const response = await deleteNoticeApi(noticeId);
            if(response.data == "success"){
                alert("공지사항 삭제에 성공했습니다.");
                // 공지사항 목록 페이지로 이동

                navigate("/admin/notice/list");

            }else{ alert("공지사항 삭제에 실패했습니다."); }

        }catch{ console.log("공지사항 삭제용 ajax 통신 실패"); }


    };

    return (
        <main className="notice-page">
            <article className="notice-detail">
                <h2 className="notice-detail__title">{notice.noticeTitle}</h2>
                <div className="notice-detail__meta"><span>작성자 관리자</span><span>작성일 {notice.createDate?.substring(0, 10) || "-"}</span><span>조회수 {notice.viewCount ?? 0}</span></div>
                <div className="notice-detail__content">{notice.noticeContent}</div>
            </article>
            <nav className="notice-navigation" aria-label="공지사항 이전 다음 글">
                {navigation.previous ? <button type="button" onClick={() => navigate(`/notice/detail/${navigation.previous.noticeId}`)}><span>이전글</span><strong>{navigation.previous.noticeTitle}</strong></button> : <span className="notice-navigation__empty">이전글이 없습니다.</span>}
                {navigation.next ? <button type="button" onClick={() => navigate(`/notice/detail/${navigation.next.noticeId}`)}><span>다음글</span><strong>{navigation.next.noticeTitle}</strong></button> : <span className="notice-navigation__empty">다음글이 없습니다.</span>}
            </nav>
            <div className="notice-actions">
                <button className="crew-secondary-button" type="button" onClick={() => navigate("/admin/notice/list")}>목록으로</button>
                {canManageNotice && <><button className="crew-secondary-button" type="button" onClick={() => navigate("/notice/updateForm", { state: { noticeId } })}>수정하기</button><button className="crew-danger-button" type="button" onClick={deleteNotice}>삭제하기</button></>}
            </div>
        </main>
    );
}
export default NoticeDetailComponent;
