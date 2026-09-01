import { useNavigate } from "react-router-dom";

function CompanyItemComponent(props) {

    const item = props.item;
    const navigate = useNavigate();

    const moveDetail = () => {
        navigate(`/admin/super/company/${item.id}`);
    };

    return (
        <tr>
            <td className="company-name">{item.companyName}</td>
            <td>{item.businessNo}</td>
            <td>
                <span className={`company-status ${item.status === "ACTIVE" ? "company-status-active" : "company-status-inactive"}`}>
                    {item.status === "ACTIVE" ? "활성" : "비활성"}
                </span>
            </td>
            <td className="text-center">
                <button type="button" className="btn-action-edit" onClick={moveDetail}>
                    수정/상세
                </button>
            </td>
        </tr>
    );
}

export default CompanyItemComponent;