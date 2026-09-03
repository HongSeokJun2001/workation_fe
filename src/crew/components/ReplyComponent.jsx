import { useEffect, useState } from "react";
import {
    deleteReplyApi,
    insertReplyApi,
    selectReplyList
} from "../api/ReplyApi";

function ReplyComponent({ crewId, crewOwnerLoginId }) {
    const [replies, setReplies] = useState([]);
    const [content, setContent] = useState("");
    const [secret, setSecret] = useState(false);
    const [parentReplyId, setParentReplyId] = useState(null);
    const [toast, setToast] = useState("");
    const currentLoginId = getCurrentLoginId();

    const showToast = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 3000);
    };

    useEffect(() => {
        let active = true;
        selectReplyList(crewId)
            .then((response) => {
                if (active) setReplies(response.data || []);
            })
            .catch(() => {
                if (active) showToast("댓글을 불러오지 못했습니다.");
            });

        return () => {
            active = false;
        };
    }, [crewId]);

    const loadReplies = async () => {
        const response = await selectReplyList(crewId);
        setReplies(response.data || []);
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            showToast("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            await insertReplyApi(crewId, {
                replyContent: content.trim(),
                replyPrivate: secret ? "Y" : "N",
                parentReply: parentReplyId ? { replyId: parentReplyId } : null
            });
            setContent("");
            setSecret(false);
            setParentReplyId(null);
            await loadReplies();
            showToast("댓글이 등록되었습니다.");
        } catch {
            showToast("댓글 등록에 실패했습니다.");
        }
    };

    const handleDelete = async (replyId) => {
        try {
            const response = await deleteReplyApi(replyId);
            if (response.data !== "success") throw new Error();
            setReplies((previous) => previous.filter((reply) => reply.replyId !== replyId));
            showToast("댓글이 삭제되었습니다.");
        } catch {
            showToast("댓글 삭제에 실패했습니다.");
        }
    };

    const canReadSecret = (reply) =>
        reply.employee?.loginId === currentLoginId || crewOwnerLoginId === currentLoginId;

    const children = (replyId) =>
        replies.filter((reply) => reply.parentReply?.replyId === replyId);

    const renderReply = (reply, isChild = false) => {
        const visible = reply.replyPrivate !== "Y" || canReadSecret(reply);

        return (
            <div key={reply.replyId} style={{ marginLeft: isChild ? 24 : 0 }}>
                <div>
                    <strong>{reply.employee?.employeeName || reply.employee?.loginId || "작성자"}</strong>
                    <span> {reply.createdDate?.substring(0, 10)}</span>
                </div>
                <p>{visible ? reply.replyContent : "🔒비밀 댓글 입니다."}</p>
                {reply.employee?.loginId === currentLoginId && (
                    <button type="button" onClick={() => handleDelete(reply.replyId)}>삭제</button>
                )}
                {!isChild && (
                    <button type="button" onClick={() => setParentReplyId(reply.replyId)}>답글</button>
                )}
                {children(reply.replyId).map((child) => renderReply(child, true))}
            </div>
        );
    };

    return (
        <div>
            <h4>댓글</h4>
            {replies.filter((reply) => !reply.parentReply).map((reply) => renderReply(reply))}
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={parentReplyId ? "대댓글을 입력해주세요." : "댓글을 입력해주세요."}
            />
            {parentReplyId && (
                <button type="button" onClick={() => setParentReplyId(null)}>대댓글 취소</button>
            )}
            <label>
                <input
                    type="checkbox"
                    checked={secret}
                    onChange={(event) => setSecret(event.target.checked)}
                />
                비밀글
            </label>
            <button type="button" onClick={handleSubmit}>
                {parentReplyId ? "대댓글 등록" : "댓글 등록"}
            </button>
            {toast && <p>{toast}</p>}
        </div>
    );
}

function getCurrentLoginId() {
    const token = sessionStorage.getItem("accessToken");
    try {
        return token ? JSON.parse(atob(token.split(".")[1])).sub : null;
    } catch {
        return null;
    }
}

export default ReplyComponent;
