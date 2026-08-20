import {useNavigate} from "react-router-dom";

function MemberItemComponent(props) {

    let navigate = useNavigate();

    const item = props.item;

    return (
        <tr onClick={ () => { navigate(`/member/detail/${item.id}`)}} >
            <td>{item.id}</td>
            <td>{item.companyName}</td>
            <td>{item.role}</td>
            <td>{item.status}</td>
        </tr>
    );
}

export default MemberItemComponent;