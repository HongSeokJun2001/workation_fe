import { useNavigate } from "react-router-dom";
import "../css/FacilityItemComponent.css";

function FacilityItemComponent(props) {

    // 시설 유형 매핑
    const FACILITY_TYPE_MAP = {
        RESORT: "리조트",
        HOTEL: "호텔",
        OFFICE: "오피스",
        "GLAMPING/CAMPING": "글램핑/캠핑",
        HANOK: "한옥",
        PENSION: "펜션",
        SHARE_HOUSE: "쉐어하우스",
        COWORKING_SPACE: "코워킹스페이스",
        CAFE: "워크 카페"
    };

    // 운영상태 매핑
    const STATUS_MAP = {
        ACTIVE : {label : "운영중", className: "status-active"},
        INACTIVE : {label : "휴업/중지", className: "status-inactive"}
    };

    // 실행할 구문
    let navigate = useNavigate();

    // props = {item : {facilityId, facilityName, region, facilityType, description, address, imagePaths, ....}}
    const item = props.item;

    // 로그인 권한 확인
    const loginRole = sessionStorage.getItem("loginRole");

    // 지역별 CSS 클래스 추출 함수
    const getRegionColorClass = (regionName) => {
        if(!regionName) return "tag-region-default";

        if(["서울", "경기", "인천"].some(r => regionName.includes(r))) return "tag-region-capital";
        if(regionName.includes("강원")) return "tag-region-gangwon";
        if(["부산", "대구", "울산", "경북", "경남"].some(r => regionName.includes(r))) return "tag-region-gyeongsang";
        if(["광주", "전북", "전남"].some(r => regionName.includes(r))) return "tag-region-chungcheong";
        if(regionName.includes("제주")) return "tag-region-jeju";

        return "tag-region-default"
    }

    // 시설 유형별 CSS 클래스 추출 함수
    const getTypeColorClass = (typeCode) => {
        switch (typeCode) {
            case "RESORT": return "tag-type-resort";
            case "HOTEL": return "tag-type-hotel";
            case "OFFICE": return "tag-type-office";
            case "GLAMPING/CAMPING": return "tag-type-camping";
            case "HANOK": return "tag-type-hanok";
            case "PENSION": return "tag-type-pension";
            case "SHARE_HOUSE": return "tag-type-sharehouse";
            case "COWORKING_SPACE": return "tag-type-coworking";
            case "CAFE": return "tag-type-cafe";
            default: return "tag-type-default";
        }
    };

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

        // 상태 매핑 정보 추출 (예외 시 기본값)
        const statusInfo = STATUS_MAP[item.status] || {
            label: item.status || "-",
            className: "status-default"
        };

    // return 구문
    return (
        <div className="facility-card" onClick={() => {navigate(`/facility/detail/${item.facilityId}`);}}>
            {/* 대표 이미지 영역 */}
            <div className="card-thumbnail-box">
                <img src={thumbnail} alt={item.facilityName} className="card-thumbnail-img" />
                {/* 최고관리자일때만 상태 태그 뱃지 노출 */}
                {loginRole === "SUPER" && (
                    <span className={`status-badge ${statusInfo.className}`}>
                        {statusInfo.label}
                    </span>
                )}
            </div>

            {/* 시설 정보 영역 */}
            <div className="card-body">
                {/* 지역 및 타입 태그 */}
                <div className="card-tags">
                    <span className={`tag-region ${getRegionColorClass(item.region)}`}>
                        {item.region}
                    </span>
                    <span className={`tag-type ${getTypeColorClass(item.facilityType)}`}>
                        {FACILITY_TYPE_MAP[item.facilityType] || item.facilityType}
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