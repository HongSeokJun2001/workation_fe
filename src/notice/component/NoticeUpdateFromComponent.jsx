import {useLocation, useNavigate} from "react-router-dom";

import { useEffect, useState } from "react";

import{selectNoticeApi, updateNoticeApi} from"../api/noticeApi";

function NoticeUpdateFormComponent(){

    //실행할 구문

    // 수정 성공인지 실패인지 판별할 수 있는 변수 셋팅

    const [result, setResult] = useState("success");
    // 기본적으로 success 초기화 실패하면 fail로 덮어 씌운 후
    // useEffect 안의 함수 가 다시 실행되도록 유도

    const noticeId = useLocation().state.noticeId;

    let navigate = useNavigate();

    //기존의 공지사항 정보를 담을 겸, 입력받은 값을 담을 겸 객체 형식의 State 변수
    const [notice, setNotice] = useState({
        noticeId : "",
        noticeTitle: "",
        noticeContent : "",
        // 작성자 추가
        createDate : "",
        status : ""
    });
    // 수정하기 페이지 > 기존의 글정보가 먼저 보여져야함 

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
                            onClick={ () => { navigate(`/notice/detail/${ noticeNo }`); } }>
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