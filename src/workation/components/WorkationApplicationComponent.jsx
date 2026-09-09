import { useState, useEffect, useMemo } from 'react'; 
import { insertApplicationApi } from "../api/workationApi";
import { selectFacilityAllListApi } from '../../facility/api/facilityApi';
import { selectCrewLeaderListApi } from '../../crew/api/CrewApi';
import { selectMyEmployeeDetailApi } from '../../member/api/memberApi';

import { useNavigate } from "react-router-dom";
import '../styles/WorkationCommon.css';
import "../styles/WorkationApplication.css"; 

function WorkationApplicationComponent() {
    const navigate = useNavigate();

    const [facilityList, setFacilityList] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');

    const [crewList, setCrewList] = useState([]);
    const [selectedCrew, setSelectedCrew] = useState("");
    const [selectedCrewInfo, setSelectedCrewInfo] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [region, setRegion] = useState(''); 
    const [purpose, setPurpose] = useState('');

    // 오늘 날짜 (YYYY-MM-DD)
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    useEffect(() => {
        const initData = async () => {
            try {
                // 1. 본인 상세 정보 및 잔여 일수 확인
                const empRes = await selectMyEmployeeDetailApi();
                const availDays = empRes.data?.workationAvailDays ?? 0;
                
                if (availDays <= 0) {
                    alert("사용 가능한 워케이션 일수가 없습니다.");
                    navigate("/lobby");
                    return;
                }

                // 2. 시설 목록 조회
                const facilityRes = await selectFacilityAllListApi();
                const facilityData = facilityRes.data?.list || facilityRes.data;
                setFacilityList(Array.isArray(facilityData) ? facilityData : []);

                // 3. 크루 목록 조회 및 필터링
                const crewRes = await selectCrewLeaderListApi();
                const rawCrewData = crewRes.data?.list || crewRes.data;
                const crewArray = Array.isArray(rawCrewData) ? rawCrewData : [];

                const validCrewList = crewArray.filter(crew => Number(crew.workUsedDays) > 0);

                if (validCrewList.length === 0) {
                    alert("워케이션 신청 가능한 크루가 존재하지 않습니다.");
                    navigate("/crew/list");
                    return;
                }

                setCrewList(validCrewList);

            } catch (error) {
                console.error("초기 데이터 로딩 중 오류 발생:", error);
            }
        };

        initData();
    }, [navigate]);

    // 크루 선택 핸들러 (날짜 자동 계산 로직 제거)
    const handleCrewChange = (e) => {
        const crewId = e.target.value;
        setSelectedCrew(crewId);

        const crewObj = crewList.find((crew) => String(crew.crewId) === String(crewId));
        setSelectedCrewInfo(crewObj || null);
    };

    // 시작일 변경 핸들러
    const handleStartDateChange = (e) => {
        const newStart = e.target.value;
        setStartDate(newStart);

        // 만약 기존 종료일이 새로운 시작일보다 이전이라면 종료일을 초기화하거나 시작일로 맞춤
        if (endDate && endDate < newStart) {
            setEndDate(newStart);
        }
    };

    // 종료일 변경 핸들러
    const handleEndDateChange = (e) => {
        const newEnd = e.target.value;
        if (startDate && newEnd < startDate) {
            alert("종료일은 시작일보다 이전일 수 없습니다.");
            return;
        }
        setEndDate(newEnd);
    };  

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCrew) {
            alert("크루를 선택해주세요.");
            return;
        }
        if (!startDate || !endDate) {
            alert("예약 날짜를 선택해주세요.");
            return;
        }
        if (!selectedFacility && !region.trim()) {
            alert("시설을 선택하지 않은 경우 희망 지역을 입력해야 합니다.");
            return;
        }

        const isConfirm = window.confirm("워케이션을 신청하시겠습니까?");
        if (!isConfirm) return;

        const application = {
            crew: { crewId: Number(selectedCrew) },
            facility: selectedFacility ? { facilityId: Number(selectedFacility) } : null,
            reservationDate: {
                startDate: startDate,
                endDate: endDate
            },
            region: selectedFacility ? null : region.trim(),
            purpose: purpose.trim()
        };

        try {
            const response = await insertApplicationApi(application);
            if (response.data === "success" || response.data === 1) {
                alert("워케이션 신청이 완료되었습니다.");
                navigate("/reservation/list");
            }
        } catch (error) {
            const errorMsg = error.response?.data || "신청 중 오류가 발생했습니다.";
            alert(errorMsg);
        }
    };

    const handleReset = () => {
        setSelectedCrew("");
        setSelectedFacility("");
        setSelectedCrewInfo(null);
        setStartDate("");
        setEndDate("");
        setRegion("");
        setPurpose("");
    };

    return (
        <div className="detail-container">
            <div className="detail-card">
                <div className="detail-header">
                    <h2 className="detail-title">워케이션 신청</h2>
                </div>

                <div className="detail-body">
                    <form onSubmit={handleSubmit}>
                        <table className="info-table">
                            <tbody>
                                <tr>
                                    <th className="info-label">크루</th>
                                    <td className="info-value">
                                        <select 
                                            className="form-control"
                                            value={selectedCrew}
                                            onChange={handleCrewChange}
                                        >
                                            <option value="">크루를 선택해 주세요</option>
                                            {crewList.map((crew) => (
                                                <option key={crew.crewId} value={crew.crewId}>
                                                    {crew.crewName}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedCrewInfo && (
                                            <div className="form-info-text">
                                                <strong>{selectedCrewInfo.crewName}</strong> 크루의 부여 일수: 
                                                <strong> {selectedCrewInfo.workUsedDays}일</strong>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="info-label">시설</th>
                                    <td className="info-value">
                                        <select 
                                            className="form-control"
                                            value={selectedFacility} 
                                            onChange={(e) => setSelectedFacility(e.target.value)}
                                        >
                                            <option value="">시설을 선택해 주세요</option>
                                            {facilityList.map((facility) => (
                                                <option key={facility.facilityId} value={facility.facilityId}>
                                                    {facility.facilityName} ({facility.region})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="info-label">예약 날짜</th>
                                    <td className="info-value">
                                        <div className="date-range-group">
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                min={today} 
                                                value={startDate} 
                                                onChange={handleStartDateChange}
                                                disabled={!selectedCrew}
                                            />
                                            <span className="date-separator">~</span>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                min={startDate || today} 
                                                value={endDate} 
                                                onChange={handleEndDateChange} 
                                                disabled={!selectedCrew || !startDate}
                                            />
                                        </div>
                                        {!selectedCrew && (
                                            <div className="form-guide-text">
                                                * 날짜를 선택하려면 먼저 크루를 선택해 주세요.
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                {!selectedFacility && (
                                    <tr>
                                        <th className="info-label">지역</th>
                                        <td className="info-value">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="희망 지역을 입력하세요" 
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <th className="info-label">목적</th>
                                    <td className="info-value">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="워케이션 신청 목적을 입력하세요 (선택 사항)" 
                                            value={purpose}
                                            onChange={(e) => setPurpose(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="action-buttons">
                            <button 
                                type="button" 
                                onClick={handleReset} 
                                className="btn-detail btn-secondary"
                            >
                                초기화
                            </button>
                            <button 
                                type="submit" 
                                className="btn-detail btn-primary"
                            >
                                신청하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default WorkationApplicationComponent;