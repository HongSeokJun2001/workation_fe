
import { useState } from "react";
// import CrewListComponents from "./CrewListComponents";
import ReplyComponent from "./ReplyComponent";

function CrewItemComponent(props) {

    const item = props.item;

    const [replyOpen, setReplyOpen] = useState(false);



    const joining = props.joining;
    const setJoining = props.setJoining;


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
                    {item.createDate?.substring(0, 10) ?? "-"}
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



            {/* 크루 신청 */}
            <div>

                <button
                    onClick={() => setJoining(item.crewId)}
                    disabled={joining === item.crewId}
                >
                    {joining === item.crewId
                        ? "신청 중"
                        : "크루 신청"}
                </button>           

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