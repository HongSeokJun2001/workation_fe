
import { useState } from "react";
import ReplyComponent from "./ReplyComponent";
import { deleteCrewApi } from "../api/CrewApi";

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
    } catch (e) {
        currentLoginId = null;
    }

    const isOwner = loginRole === "EMPLOYEE" && item.employee?.loginId && currentLoginId && item.employee.loginId === currentLoginId;
    const canManageCrew = loginRole === "SUPER" || isOwner;

    const [replyOpen, setReplyOpen] = useState(false);

    const handleJoin = props.onJoin;

    const joinedCrews = props.joinedCrews;

    const isJoined = joinedCrews.some(
        (crew) => crew.crewId === item.crewId
    );



    // 크루 글 삭제 실행 구문 
    const deleteCrew = async () => {
        try{
            const response = await deleteCrewApi(item.crewId);
            console.log(response.data);

            if(response.data == "success"){

                alert("크루글 삭제 성공");

                props.onDeleteSuccess(item.crewId);

            }else{

                alert("크루 글 삭제 실패");
            }

        }catch(error){

            console.log("크루 모집 글 삭제 ajax 통신 실패 !");

        }
    };


    return (

        <div>

            {/* 크루 기본 정보 */}
            <div>
                {/* 크루명 */}

                <h3>
                    {item.crewName}
                </h3>

                
                <p>
                    회사 : {item.company?.companyName ?? "-"}
                </p>


                <p>
                    크루장 : {item.employee?.employeeName ?? "-"}
                </p>


                <p>
                    크루 소개 글 : {item.crewContent}
                </p>


                <p>
                    작성일 :{" "}
                    {item.createdDate?.substring(0, 10) ?? "-"}
                </p>


                <p>
                    크루 모집 마감일 :{" "}
                    {item.endDate?.substring(0, 10) ?? "-"}
                </p>


                <p>
                    모집 상태 : {item.status}
                </p>


                <p>
                    모집 정원 : {item.capacity}명
                </p>

            </div>

            {canManageCrew && (
                <div>
                    <button onClick={() => props.onUpdate(item.crewId)}>
                        수정하기
                    </button>
                    <button onClick={deleteCrew}>
                        삭제하기
                    </button>
                </div>
            )}





            {/* 크루 신청 */}
            <div>
                {isJoined ? (
                        <>
                            <button disabled>
                                신청 완료
                            </button>

                            <button onClick={() => props.onLeave(item.crewId)}>
                                탈퇴하기
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => props.onJoin(item.crewId)}
                            disabled={loginRole !== "EMPLOYEE" || isOwner}
                        >
                            {loginRole === "EMPLOYEE" ? (isOwner ? "작성자 본인" : "크루 신청") : "신청 불가"}
                        </button>
                    )}
            </div>




            {/* 댓글 */}
            <div>
                <button
                onClick={() => setReplyOpen(!replyOpen)}>

                {replyOpen
                    ? "댓글 닫기 ▲"
                    : "댓글 보기 ▼"
                }
                </button>


            {/* 댓글 토글 */}

            {replyOpen && (
                <ReplyComponent
                    crewId={item.crewId}
                />
            )}

            </div>

        </div>

    );


}

export default CrewItemComponent;