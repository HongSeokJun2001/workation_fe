import { useNavigate } from "react-router-dom";
import "../css/FacilityItemComponent.css";

function FacilityItemComponent(props) {

    // 실행할 구문
    let navigate = useNavigate();

    // props = {item : {facilityId, facilityName, region, facilityType, description, address, imagePaths, ....}}
    const item = props.item;

    // 대표 이미지 URL 설정
    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
        
        const actualPath = typeof path === 'object' ? path.filePath : path;

        if(!actualPath || typeof actualPath !== 'string') {
            return "https://via.placeholder.com/300x200?text=No+Image";
        }

        if(actualPath.startsWith("http://") || actualPath.startsWith("https://")) {
            return actualPath;
        }

        // 로컬 업로드 경로 처리
        const cleanPath = actualPath.startsWith("/") ? actualPath : `/${actualPath}`;
        return `http://localhost:8007/workation${cleanPath}`;
    };

    const images = item.imageList || item.imagePaths || [];
    const thumbnail = (images && images.length > 0) 
        ? getImageUrl(images[0])
        : "https://via.placeholder.com/300x200?text=No+Image";

    // return 구문
    return (
        <div className="facility-card" onClick={() => {navigate(`/facility/detail/${item.facilityId}`);}}>
            {/* 대표 이미지 영역 */}
            <div className="card-thumbnail-box">
                <img src={thumbnail} alt={item.facilityName} className="card-thumbnail-img" />
            </div>

            {/* 시설 정보 영역 */}
            <div className="card-body">
                {/* 지역 및 타입 태그 */}
                <div className="card-tags">
                    <span className="tag-region">
                        {item.region}
                    </span>
                    <span className="tag-type">
                        {item.facilityType}
                    </span>
                </div>

                {/* 시설명 */}
                <h4 className="card-title">
                    {item.facilityName}
                </h4>

                {/* 한줄 설명 */}
                <p className="card-description">
                    {item.description}
                </p>

                {/* 주소 정보 */}
                <div className="card-address">
                    🎈{item.address}
                </div>
            </div>
        </div>
    );
};

export default FacilityItemComponent;