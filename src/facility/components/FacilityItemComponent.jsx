import { useNavigate } from "react-router-dom";

function FacilityItemComponent(props) {

    // 실행할 구문
    let navigate = useNavigate();

    // props = {item : {facilityId, facilityName, region, facilityType, description, address, imagePaths, ....}}
    const item = props.item;

    // 대표 이미지 URL 설정
    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        // 로컬 업로드 경로 처리
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `http://localhost:8007/workation${cleanPath}`;
    };

    const thumbnail = (item.imagePaths && item.imagePaths.length > 0) 
        ? getImageUrl(item.imagePaths[0])
        : "https://via.placeholder.com/300x200?text=No+Image"

    // return 구문
    return(
        <div className="facility-card" onClick={() => {navigate(`/facility/detail/${item.facilityId}`);}} style={{border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", cursor: "pointer", backgroundColor: "#fff", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06"}}>
            {/*대표 이미지 영역 */}
            <div style={{width: "100%", height: "180px", overflow: "hidden", backgroundColor: "#f5f5f5"}}>
                <img src={thumbnail} alt={item.facilityName} style={{width: "100%", height: "100%", objectFit : "cover"}}/>
            </div>

            {/* 시설 정보 영역 */}
            <div style={{padding: "16px"}}>
                {/*지역 및 타입 태그 */}
                <div style={{marginBottom: "8px"}}>
                    <span style={{fontSize: "12px", fontWeight: "bold", color: "#007bff", backgroundColor: "#e7f1ff", padding: "3px 8px", borderRadius: "4px", marginRight: "6px"}}>
                        {item.region}
                    </span>
                    <span style={{fontSize: "12px", color: "#6c757d", backgroundColor: "#f8f9fa", padding: "3px 8px", borderRadius: "4px", border: "1px solid #dee2e6"}}>
                        {item.facilityType}
                    </span>
                </div>

                {/*시설명 */}
                <h4 style={{margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold", color: "#333"}}>
                    {item.facilityName}
                </h4>

                {/*한줄 설명 */}
                <p style={{fontSize: "13px", color: "#666", margin: "0 0 12px 0", height: "38px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.4"}}>
                    {item.description}
                </p>

                {/*주소 정보 및 등록일 */}
                <div style={{fontSize: "12px", color: "#888", borderTop: "1px solid #f0f0f0", paddingTop: "8px"}}>
                    🎈{item.address}
                </div>
            </div>
        </div>
    );

};

export default FacilityItemComponent;