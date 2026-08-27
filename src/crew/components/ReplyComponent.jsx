
import React, { useState} from 'react';


function ReplyComponent(props) {

    const crewId = props.crewId;
    const [replies, setReplies] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [commentSecret, setCommentSecret] = useState(false);
    const [toast, setToast] = useState("");

    
    const showToast = (msg) => {

        setToast(msg);

        setTimeout(() => {
            setToast("");
        }, 3000);
    };


    //댓글 작성
    const handleCommentSubmit = () => {

        if (!commentContent.trim()) {
            showToast("댓글 내용을 입력해주세요.");
            return;
        }

        const newComment = {
            commentId: Date.now(),
            employeeId: 1, // 임시로 1번 직원으로 설정
            content: commentContent,
            createDate: new Date().toISOString(),
            secret: commentSecret
        };

        setComments((prev) => [
            ...prev,
            newComment
        ]);

        setCommentContent("");
        setCommentSecret(false);

        showToast("댓글이 등록되었습니다.");
    };

    // 댓글 삭제
    const handleCommentDelete = (commentId) => {

        setComments((prev) =>
            prev.filter(
                (comment) => comment.commentId !== commentId
            )
        );

        showToast("댓글이 삭제되었습니다.");
    };


    return (
        <div>

            <h4>
                댓글
            </h4>

            <div>

            {comments.map((comment) => (

                <div key={comment.commentId}>

                    <div>

                        <span>
                            작성자 : {comment.employeeId}
                        </span>

                        <span>
                            작성일 :{" "}
                            {comment.createDate.substring(0, 10)}
                        </span>

                    </div>


                    <div>

                        {comment.secret
                            ? "비밀글입니다."
                            : comment.content}

                    </div>


                    <button
                        onClick={() =>
                            handleCommentDelete(
                                comment.commentId
                            )
                        }
                    >
                        삭제
                    </button>

                </div>

            ))}

            </div>
            

            {/* 댓글 작성 */}
                <div>

                    <textarea
                        value={commentContent}
                        onChange={(e) =>
                            setCommentContent(e.target.value)
                        }
                        placeholder="댓글을 입력해주세요."
                    />


                    <div>

                        <label>

                            <input
                                type="checkbox"
                                checked={commentSecret}
                                onChange={(e) =>
                                    setCommentSecret(
                                        e.target.checked
                                    )
                                }
                            />

                            비밀글

                        </label>


                        <button
                            onClick={handleCommentSubmit}
                        >
                            댓글 등록
                        </button>

                    </div>

                </div>


        </div>

    )

}

export default ReplyComponent;