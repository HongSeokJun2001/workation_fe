import React, { useState, useEffect } from 'react';

import axios from 'axios';


function ReplyItemComponent(props) {

    // const crewId = props.crewId;

    // const [replies, setReplies] = useState([]);

    // crewId가 변경될 때마다 댓글 목록을 가져오는 useEffect 추후 구현
    // useEffect(() => {

    //     axios.get(`/api/crews/${crewId}/replies`)
    //         .then((response) => {

    //             setReplies(response.data);

    //         })
    //         .catch((error) => {

    //             console.log(error);

    //         });

    // }, [crewId]);

    // 댓글
    // const [comments, setComments] = useState([
    //     {
    //         commentId: 1,
    //         employeeId: 1001,
    //         content: "같이 워케이션 가실 분 구합니다!",
    //         createDate: "2026-08-27T09:30:00",
    //         secret: false
    //     },
    //     {
    //         commentId: 2,
    //         employeeId: 1002,
    //         content: "저도 참여하고 싶습니다.",
    //         createDate: "2026-08-27T10:00:00",
    //         secret: true
    //     }
    // ]);


    return (
        <div>

            
        </div>
    );








}

export default ReplyItemComponent;