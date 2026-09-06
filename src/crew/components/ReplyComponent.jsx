import { useEffect, useState } from "react";
import { deleteReplyApi, insertReplyApi, selectReplyList } from "../api/ReplyApi";

function ReplyComponent({ crewId, crewOwnerLoginId, onReplyCountChange }) {

    const [replies, setReplies] = useState([]); 

    const [content, setContent] = useState(""); 

    const [secret, setSecret] = useState(false); 
    
    const [parentReplyId, setParentReplyId] = useState(null); 
    
    const [toast, setToast] = useState(""); 
    
    const currentLoginId = getCurrentLoginId();


    const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(""), 3000); };


    useEffect(() => { 
        
        let active = true; 
        
        selectReplyList(crewId).then(response => { 
            
            if (active) {
                const nextReplies = response.data || [];
                setReplies(nextReplies);
                onReplyCountChange?.(nextReplies.length);
            } }).
            
            catch(() => { if (active) showToast("댓글을 불러오지 못했습니다."); }); 
            
            return () => { active = false; }; 
        
        }, [crewId, onReplyCountChange]);


    const loadReplies = async () => { 
        
        const response = await selectReplyList(crewId); 
        
        const nextReplies = response.data || [];
        setReplies(nextReplies);
        onReplyCountChange?.(nextReplies.length);
    };


    const handleSubmit = async () => {
        
        if (!content.trim()) { showToast("댓글 내용을 입력해주세요."); 
            
            return; 
        
        } try { await insertReplyApi(crewId, {
            replyContent: content.trim(),
            replyPrivate: secret ? "Y" : "N",
            parentReplyId
        });
                
                setContent(""); setSecret(false); 
                
                setParentReplyId(null); 
                
                await loadReplies(); showToast("댓글이 등록되었습니다."); 
            
            } catch (error) {
                console.error("댓글 등록 실패", error.response?.data || error);
                const errorMessage = error.response?.data?.message || error.response?.data?.error || "댓글 등록에 실패했습니다.";
                showToast(errorMessage);
            }
    };


    const handleDelete = async (replyId) => { 
        
        try { const response = await deleteReplyApi(replyId); 
            
            if (response.data !== "success") throw new Error(); 
            
            setReplies(previous => {
                const nextReplies = previous.filter(reply => reply.replyId !== replyId);
                onReplyCountChange?.(nextReplies.length);
                return nextReplies;
            });
            
            showToast("댓글이 삭제되었습니다."); 
        
        } catch { showToast("댓글 삭제에 실패했습니다."); } };


    const canReadSecret = reply => reply.employee?.loginId === currentLoginId || crewOwnerLoginId === currentLoginId;


    const children = replyId => replies.filter(reply => reply.parentReply?.replyId === replyId);


    const renderReply = (reply, isChild = false) => {
        
        const visible = reply.replyPrivate !== "Y" || canReadSecret(reply);

        return (
            <div className={`reply-item${isChild ? " reply-item--child" : ""}`} key={reply.replyId}>
                <div className="reply-author">
                    <strong>{reply.employee?.employeeName || reply.employee?.loginId || "작성자"}</strong>
                    <span> {reply.createdDate?.substring(0, 10)}</span>
                </div>

                <p>{visible ? reply.replyContent : "🔒비밀 댓글 입니다."}</p>

                {reply.employee?.loginId === currentLoginId && (
                    <button className="reply-text-button" type="button" onClick={() => handleDelete(reply.replyId)}>삭제</button>
                )}

                {!isChild && (
                    <button className="reply-text-button" type="button" onClick={() => setParentReplyId(reply.replyId)}>답글</button>
                )}

                {children(reply.replyId).map(child => renderReply(child, true))}
            </div>
        );
    };

    return (
        <section className="reply-section">
            <h4>댓글</h4>

            {replies.filter(reply => !reply.parentReply).map(reply => renderReply(reply))}
            {replies.length === 0 && <p>첫 댓글을 남겨보세요.</p>}

            <div className="reply-form">
                <textarea
                    value={content}
                    onChange={event => setContent(event.target.value)}
                    placeholder={parentReplyId ? "대댓글을 입력해주세요." : "댓글을 입력해주세요."}
                />

                {parentReplyId && <button className="reply-text-button" type="button" onClick={() => setParentReplyId(null)}>대댓글 취소</button>}

                <div className="reply-form__bottom">
                    <label><input type="checkbox" checked={secret} onChange={event => setSecret(event.target.checked)}/> 비밀글</label>
                    <button className="crew-primary-button" type="button" onClick={handleSubmit}>{parentReplyId ? "대댓글 등록" : "댓글 등록"}</button>
                </div>
            </div>

            {toast && <p className="crew-notice" role="alert">{toast}</p>}
        </section>
    );
}
function getCurrentLoginId() { const token = sessionStorage.getItem("accessToken"); try { return token ? JSON.parse(atob(token.split(".")[1])).sub : null; } catch { return null; } }
export default ReplyComponent;
