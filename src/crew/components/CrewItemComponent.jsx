import { useEffect, useState } from "react";
import ReplyComponent from "./ReplyComponent";
import { deleteCrewApi, selectCrewMemberNamesApi } from "../api/CrewApi";
import { selectReplyList } from "../api/ReplyApi";
import "../styles/CrewCommunity.css";

function CrewItemComponent(props) {

    const item = props.item;
    const loginRole = sessionStorage.getItem("loginRole") || "EMPLOYEE";
    const currentToken = sessionStorage.getItem("accessToken");

    let currentLoginId = null;

    try {
        if (currentToken && currentToken.split('.').length === 3) {
            const payload = JSON.parse(atob(currentToken.split('.')[1]));
            currentLoginId = payload.sub ?? null;
        }
    } catch {
        currentLoginId = null;
    }

    const isOwner = loginRole === "EMPLOYEE" && item.employee?.loginId && currentLoginId && item.employee.loginId === currentLoginId;
    const canManageCrew = loginRole === "SUPER" || isOwner;

    const [replyOpen, setReplyOpen] = useState(false);
    const [memberPanelOpen, setMemberPanelOpen] = useState(false);
    const [memberNames, setMemberNames] = useState([]);
    const [memberLoading, setMemberLoading] = useState(true);
    const [replyCount, setReplyCount] = useState(0);
    const [loadedAt] = useState(() => Date.now());

    const joinedCrews = props.joinedCrews;
    const isJoined = joinedCrews.some((crewId) => crewId === item.crewId);
    const isClosed = item.endDate ? new Date(item.endDate).setHours(23, 59, 59, 999) < loadedAt : false;
    const memberCount = memberNames.length;
    const isFull = item.capacity != null && memberCount >= item.capacity;
    const requiredDays = item.workUsedDays ?? 1;
    const lacksAvailableDays = props.availableDays != null && props.availableDays < requiredDays;
    const displayStatus = isFull ? "신청 마감" : isClosed ? "모집마감" : item.status === "Y" ? "모집중" : item.status;

    useEffect(() => {
        let active = true;

        selectCrewMemberNamesApi(item.crewId)
            .then(response => {
                if (active) setMemberNames(response.data || []);
            })
            .catch(() => {
                if (active) setMemberNames([]);
            })
            .finally(() => {
                if (active) setMemberLoading(false);
            });

        selectReplyList(item.crewId)
            .then(response => {
                if (active) setReplyCount((response.data || []).length);
            })
            .catch(() => {
                if (active) setReplyCount(0);
            });

        return () => { active = false; };
    }, [item.crewId, joinedCrews.length]);

    const openMemberPanel = () => {
        setMemberPanelOpen(true);
    };

    // 크루 글 삭제 실행 구문 
    const deleteCrew = async () => {
        const isConfirm = window.confirm("크루 모집글을 삭제하시겠습니까?");
        if (!isConfirm) return;

        try{
            const response = await deleteCrewApi(item.crewId);
            console.log(response.data);

            if(response.data == "success"){
                alert("크루글 삭제 성공");
                props.onDeleteSuccess(item.crewId);
            }else{
                alert("크루 글 삭제 실패");
            }
        }catch{
            console.log("크루 모집 글 삭제 ajax 통신 실패 !");
        }
    };

    return (
        <article id={`crew-${item.crewId}`} className="crew-card">
            <div className="crew-card__top">
                <h3 className={props.onTitleClick ? "crew-card__title-link" : ""} onClick={props.onTitleClick}>{item.crewName}</h3>
                <span className={`crew-status${isClosed || isFull ? " crew-status--closed" : ""}`}>{displayStatus}</span>
            </div>
            <p className="crew-card__company"> 🏢 {item.company?.companyName ?? "회사 미등록"} | 👑 크루장 {item.employee?.employeeName ?? "-"}</p>
            <p className="crew-card__description">{item.crewContent || "소개 내용이 없습니다."}</p>
            <div className="crew-card__meta">
                <span>📆 마감 {item.endDate?.substring(0, 10) ?? "-"}</span>
                <span>🙋🏻‍♀️ 모집 정원 {memberCount}/{item.capacity ?? "-"}명</span>
                <span>🏖️ 워케이션 {requiredDays}일</span>
                {/* <span>작성일 {item.createdDate?.substring(0, 10) ?? "-"}</span> */}
            </div>

            <div className="crew-card__footer">
                <div className="crew-card__actions">
                    <button type="button" onClick={openMemberPanel}>크루원 {memberNames.length}/{item.capacity ?? "-"}</button>
                    {canManageCrew && <><button type="button" onClick={() => props.onUpdate(item.crewId)}>수정</button><button type="button" onClick={deleteCrew}>삭제</button></>}
                </div>
                <div className="crew-card__actions">
                    {isOwner && isClosed && !isFull ?
                    <button className="crew-action-main"
                    type="button" onClick={props.onReEnroll}>다시 모집하기</button> : isJoined ? <><button type="button" disabled>신청 완료</button>{isOwner ? <button type="button" disabled>작성자는 탈퇴 불가</button> : <button type="button" onClick={() => props.onLeave(item.crewId)}>탈퇴</button>}</> : <button className="crew-action-main" type="button" onClick={() => props.onJoin(item.crewId)} disabled={isClosed || isFull || loginRole !== "EMPLOYEE" || isOwner || lacksAvailableDays}>{isFull ? "신청 마감" : isClosed ? "모집마감" : loginRole !== "EMPLOYEE" || isOwner ? "신청 불가" : lacksAvailableDays ? "가용일수 부족" : "크루 신청"}</button>}
                </div>
            </div>

            <div className="crew-availability">내 가용일수 {props.availableDays == null ? "확인 중" : `${props.availableDays}일`} · 필요 일수 {requiredDays}일</div>

            {memberPanelOpen && <div className="crew-member-panel">

                <div className="crew-card__top"><strong>현재 참여 크루원</strong><button type="button" onClick={() => setMemberPanelOpen(false)}>닫기</button></div>
                {memberLoading ? <p>크루원을 불러오는 중입니다.</p> : memberNames.length > 0 ? <ul>{
                
                memberNames.map((name, index) => <li key={`${name}-${index}`}>{name} {name === item.employee?.employeeName ? "👑" : ""}
                
                </li>)}</ul> : 
                
                <p>신청한 크루원이 없습니다.</p>}

            </div>}

            <div className="reply-section">
                <button className="crew-secondary-button" type="button" onClick={() => setReplyOpen(!replyOpen)}>
                    {replyOpen ? "댓글 닫기 ▲" : `댓글 ${replyCount}개 보기 ▼`}
                </button>
                {replyOpen && <ReplyComponent crewId={item.crewId} crewOwnerLoginId={item.employee?.loginId} onReplyCountChange={setReplyCount} />}
            </div>
        </article>
    );
}
export default CrewItemComponent;
