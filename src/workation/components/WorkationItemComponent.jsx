import { useNavigate } from "react-router-dom";

function WorkationItemComponent({ item }) {
    let navigate = useNavigate();

    return (
        <tr 
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/workation/detail/${item.workationId}`);
            }}
        >
            <td> {item.crew.crewName }</td>
            <td>{item.reservationDate.startDate} ~ {item.reservationDate.endDate}</td>
            <td>{ item.region }</td>
            <td>{ item.status }</td>
            <td>{ item.createDate.substring(0, 10) }</td>
        </tr>
    );
}

export default WorkationItemComponent;