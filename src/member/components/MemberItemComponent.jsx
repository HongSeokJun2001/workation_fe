import { useNavigate } from "react-router-dom";

function MemberItemComponent(props) {

    const item = props.item;
    const { isEmployeeList } = props;
    const navigate = useNavigate();
    const loginRole = sessionStorage.getItem("loginRole");

    const moveDetail = () => {
        if (isEmployeeList) {
            navigate(`/admin/company/member/employee/${item.employeeId}`);
            return;
        }

        if (loginRole === "SUPER") {
            navigate(`/admin/super/member/admin/${item.adminId}`);
        } else {
            navigate(`/admin/company/member/admin/${item.adminId}`);
        }
    };

    return (
        <tr onClick={moveDetail}>
            {isEmployeeList ? (
                <>
                    <td>{item.empNo}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.department}</td>
                    <td>{item.position}</td>
                    <td>{item.status}</td>
                    <td>{item.workationAvailDays}</td>
                    <td>{item.isProgressed}</td>
                </>
            ) : (
                <>
                    <td>{item.loginId}</td>
                    <td>{item.companyLabel}</td>
                    <td>{item.role}</td>
                    <td>{item.status}</td>
                </>
            )}
        </tr>
    );
}

export default MemberItemComponent;