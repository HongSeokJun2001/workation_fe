
import { useNavigate } from "react-router-dom";


function NoticeItemComponent(props){

    //실행할구문

    let navigate = useNavigate();

    const item = props.item;

    //return 구문

    return(
        // 글 목록 클릭시 상세보기로 전환되는 navigate 함수 셋팅
       <tr onClick={()=>{navigate(`/notice/detail/${item.noticeNo}`);}}>
            <td>{item.noticeId}</td>
            <td>{item.noticeTitle}</td>
            {/* 여기 시설로 수정  */}
            <td>{item.admin.adminId}</td>
            {/* 작성자 테이블 확인 필요 */}
            <td>{item.viewCount}</td>
            <td>{item.crateDate.substring(0,10)}</td>

       </tr>
    );
}

export default NoticeItemComponent;