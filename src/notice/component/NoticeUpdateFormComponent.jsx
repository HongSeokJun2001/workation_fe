import {useLocation, useNavigate} from "react-router-dom";

import { useEffect, useState } from "react";

import{selectNoticeApi, updateNoticeApi} from"../api/noticeApi";

function NoticeUpdateFormComponent(){

    //실행할 구문

    // 수정 성공인지 실패인지 판별할 수 있는 변수 셋팅

    const [result, setResult] = useState("success");
    // 기본적으로 success 초기화 실패하면 fail로 덮어 씌운 후
    // useEffect 안의 함수 가 다시 실행되도록 유도

    const location = useLocation();
    const noticeId = location.state?.noticeId;

    let navigate = useNavigate();

    //기존의 공지사항 정보를 담을 겸, 입력받은 값을 담을 겸 객체 형식의 State 변수
    const [notice, setNotice] = useState({
                                            noticeTitle: "",
                                            noticeContent : "",
                                            createDate : "",
                                            status : "Y"
                                        });
    // 수정하기 페이지 > 기존의 글정보가 먼저 보여져야함 
    // 이 컴포넌트가 최초로 단 한 번 로딩 된 후 실행할 구문 내에서 상세 조회 먼저 
    useEffect(()=>{

        const fetchNotice = async () => {

            if (!noticeId) {
                alert("잘못된 접근입니다.");
                navigate("/notice/list");
                return;
            }

            try{

                const response = await selectNoticeApi(noticeId);
                setNotice({
                    ...response.data,
                    status: response.data.status ?? "Y"
                });

            }catch(error){
                console.log("공지사항 상세조회용 ajax 통신 실패 !")

            }
        }

        fetchNotice();

    },[noticeId, navigate]);

    // 입력값 변경 시 실행할 이벤트 핸들러 함수
    const handleChange = e => {

        const newNotice = {...notice};

        newNotice[e.target.name] = e.target.value;

        setNotice(newNotice);
    }

    // 수정하기 버튼 클릭시 실행할 이벤트 핸들러 함수

    const updateNotice = async e => {

        e.preventDefault();
        //> 기본이벤트 제거

        try{

            const payload = {
                ...notice,
                noticeId,
                status: notice.status || "Y"
            };

            const response = await updateNoticeApi(noticeId, payload);

            console.log(response.data);

            if(response.data == "success" || response.data == "sucess"){
                // > 공지사항 수정 성공일 경우

                alert("공지사항 수정 성공!");

                // 다시 상세 조회 페이지로 이동 
                navigate(`/notice/detail/${noticeId}`);

            }else{

                //>공지사항 수정 실패일 경우

                alert("공지사항 수정에 실패했습니다.");

                setResult(response.data);
            }


        }catch(error){

            console.log("공지사항 수정용 ajax통신 실패");

        }


    }

    

    //return 구문

    return (

        <div>
            <h2 align="center">공지사항 수정</h2>

            <br /><br />

            <form id="update-form">
                <table className="table form">
                    <tbody>
                        <tr>
                            <th width="130">제목</th>
                            <td>
                                <input type="text" name="noticeTitle" value={ notice.noticeTitle }
                                                   onChange={ handleChange } />
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name="noticeContent" value={ notice.noticeContent }
                                          onChange={ handleChange }></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br /><br />

                <div align="center">
                    <button type="submit" className="btn btn-outline-primary btn-sm"
                                          onClick={ updateNotice }>
                        수정하기
                    </button>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                            onClick={ () => { navigate(`/notice/detail/${ noticeId }`); } }>
                        뒤로가기
                    </button>
                    {/* 
                        뒤로가기도 마찬가지로 화면이 깜빡거리면 안되기 때문에 
                        navigate 함수를 통해 뒤로 가야할 URL 주소를 대놓고 제시했음!!    
                    */}
                </div>

                <br /><br />

            </form>

        </div>
    )
}

export default NoticeUpdateFormComponent;