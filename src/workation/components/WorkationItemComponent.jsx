import { useNavigate } from "react-router-dom";

function WorkationItemComponent(props) {
    
    let navigate = userNavigate();

    const item = props.item;

    return (
        <tr onClick={ () => {navigate('/workation/detail/${ item.workavationId }');}}>
            <td>{ item. }</td>
            <td>{ item. }</td>
            <td>{ item. }</td>
            <td>{ item. }</td>
            <td>{ item. }</td>
        </tr>
    );

}

export default WorkationItemComponent;