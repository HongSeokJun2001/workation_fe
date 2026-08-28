import { useNavigate } from "react-router-dom";

function CompanyItemComponent(props) {

    const item = props.item;
    const navigate = useNavigate();

    const moveDetail = () => {
        navigate(`/admin/super/company/${item.id}`);
    };

    return (
        <tr onClick={moveDetail}>
            <td>{item.companyName}</td>
            <td>{item.businessNo}</td>
            <td>{item.status}</td>
        </tr>
    );
}

export default CompanyItemComponent;