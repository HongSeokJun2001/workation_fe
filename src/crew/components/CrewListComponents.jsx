import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CrewItemComponent from "./CrewItemComponent";
// import ReplyComponent from "./ReplyComponent";


import { selectCrewListApi } from "../api/CrewApi";


function CrewListComponents() {

    const navigate = useNavigate();


    // 크루 신청 중인 크루 ID
    const [joining, setJoining] = useState(null);

    // 내가 참여한 크루
    const [joinedCrews, setJoinedCrews] = useState([1]);

    // 검색어
    const [searchKeyword, setSearchKeyword] = useState("");

    // 워케이션 신청 중인 크루 ID
    const [applyingWorkcation, setApplyingWorkcation] = useState(null);

    // 알림 메시지
    const [toast, setToast] = useState("");


    // 나중에 useEffect를 사용하여 서버에서 크루 데이터를 가져오도록 구현

    const [crews,setCrews] = useState([]);

    // Toast 출력
    const showToast = (msg) => {

        setToast(msg);

        setTimeout(() => {
            setToast("");
        }, 3000);
    };


    // 크루 참여
    const handleJoin = (crewId) => {


        setJoinedCrews((prev) => [...prev, crewId]);

        setJoining(null);

        showToast("크루 참여 신청이 완료되었습니다!");
    };




    // 크루 탈퇴
    const handleLeave = (crewId) => {

        setJoinedCrews((prev) =>
            prev.filter((id) => id !== crewId)
        );

        showToast("크루에서 탈퇴했습니다.");
    };


    // // 워케이션 신청
    // const handleWorkcation = () => {

    //     setApplyingWorkcation(null);

    //     showToast(
    //         "워케이션 신청이 완료되었습니다! 관리자 승인 후 확정됩니다."
    //     );
    // };

    // 검색
    const filteredCrews = crews.filter((crew) => {

        const keyword = searchKeyword.toLowerCase();

        return (
            crew.crewName.toLowerCase().includes(keyword) ||
            crew.crewContent.toLowerCase().includes(keyword)
        );
    });


    useEffect(() => {
        // 크루 데이터를 서버에서 가져오는 로직을 여기에 추가
        // 예: fetchCrewData();

        const setCrewList = async () => {

            try {

                const response = await selectCrewListApi();

                consol.log(response.data);

                setCrews(response.data);

            //     const items = response.data;

            //     const crewArr = items.map((item, index) => {
            //         return (

            //             <CrewItemComponent
            //                     key={index}
            //                     item={item}
            //                     joining={joining}
            //                     setJoining={setJoining}
            //                 />
            //         )
                            
            // });
                
                setCrews(items);

            } catch (error) {
                console.log("크루 조회 ajax 통신 실패 !");
            }
        };

        setCrewList();
        
    }, []);






    return (
        <div>

            {/* Toast */}
            {toast && (
                <div>
                    ✓ {toast}
                </div>
            )}


            {/* 제목 + 크루 만들기 */}
            <div>

                <div>
                    <h2>
                        크루 커뮤니티
                    </h2>

                    <p>
                        함께 워케이션을 떠날 크루를 찾거나 만들어보세요
                    </p>
                </div>

                <button
                    onClick={() => navigate("/crew/enroll")}
                >
                    + 크루 만들기
                </button>

            </div>


            {/* 검색창 */}
            <div>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="크루명 또는 크루 소개를 검색해주세요."
                />

                <button
                    onClick={() => setSearchKeyword("")}
                >
                    검색 초기화
                </button>
            </div>


            {/* 내가 참여한 크루 */}
            {joinedCrews.length > 0 && (
                <div>

                    <p>
                        내가 참여한 크루
                    </p>


                    <div>

                        {crews
                            .filter((crew) =>
                                joinedCrews.includes(crew.crewId)
                            )
                            .map((crew) => (

                                <div key={crew.crewId}>

                                    <div>
                                        <p>
                                            {crew.crewName}
                                        </p>

                                        <p>
                                            회사 :{" "}
                                            {crew.company?.companyName ?? "-"}
                                        </p>

                                        <p>
                                            마감일 :{" "}
                                            {crew.endDate?.substring(0, 10) ?? "-"}
                                        </p>
                                    </div>


                                    <div>

                                        <button
                                            onClick={() =>
                                                setApplyingWorkcation(
                                                    crew.crewId
                                                )
                                            }
                                        >
                                            워케이션 신청
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleLeave(crew.crewId)
                                            }
                                        >
                                            탈퇴
                                        </button>

                                    </div>

                                </div>
                            ))}

                    </div>

                </div>
            )}


            {/* 모집 중인 크루 */}
            <div>

                <p>
                    모집 중인 크루
                </p>


                <div>

                    {filteredCrews
                        .filter((crew) =>
                            !joinedCrews.includes(crew.crewId)
                        )
                        .map((crew) => (

                            <CrewItemComponent
                                key={crew.crewId}
                                item={crew}
                                joining={joining}
                                setJoining={setJoining}
                            />

                        ))}

                </div>

            </div>


            {/* 크루 신청 */}
            {joining !== null && (

                <div>

                    <h3>
                        크루 신청
                    </h3>

                    <button
                        onClick={() =>
                            handleJoin(joining)
                        }
                    >
                        신청
                    </button>

                    <button
                        onClick={() => {
                            setJoining(null);
                        }}
                    >
                        취소
                    </button>

                </div>

            )}


        </div>
    );
}


export default CrewListComponents;