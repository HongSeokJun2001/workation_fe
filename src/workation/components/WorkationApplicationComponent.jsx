import { useState, useEffect } from 'react'; 
import { insertApplicationApi } from "../api/workationApi";
import { selectFacilityAllListApi } from '../../facility/api/facilityApi';
import { selectCrewLeaderListApi } from '../../crew/api/CrewApi';
import { selectMyEmployeeDetailApi } from '../../member/api/memberApi';

import { useNavigate } from "react-router-dom";

function WorkationApplicationComponent() {

    let navigate = useNavigate();

    const [facilityList, setFacilityList] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');

    const [crewList, setCrewList] = useState([]);
    const [selectedCrew, setSelectedCrew] = useState("");
    const [selectedCrewInfo, setSelectedCrewInfo] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [region, setRegion] = useState(''); 
    const [purpose, setPurpose] = useState('');

    useEffect(() => {
        // async/await 형태로 순차 실행하여 잔여 일수 검증 후 목록 로드
        const initData = async () => {
            try {
                // 1. 본인 상세 정보 및 잔여 일수 확인
                const empRes = await selectMyEmployeeDetailApi();
                console.log("본인 상세 정보 : ", empRes.data);
                
                const availDays = empRes.data?.workationAvailDays ?? 0;
                if (availDays <= 0) {
                    alert("사용 가능한 워케이션 일수가 없습니다.");
                    navigate("/lobby");
                    return; // 잔여 일수 없으면 이후 API 호출 중단
                }

                // 2. 시설 목록 조회
                const facilityRes = await selectFacilityAllListApi();
                console.log("시설 목록 API 응답:", facilityRes.data);
                const facilityData = facilityRes.data?.list || facilityRes.data;
                setFacilityList(Array.isArray(facilityData) ? facilityData : []);

                // 3. 크루 목록 조회 및 필터링
                const crewRes = await selectCrewLeaderListApi();
                console.log("크루 목록 API 응답:", crewRes.data);
                const rawCrewData = crewRes.data?.list || crewRes.data;
                const crewArray = Array.isArray(rawCrewData) ? rawCrewData : [];

                // 사용 가능한 일수(workUsedDays)가 0보다 큰 크루만 필터링
                const validCrewList = crewArray.filter(crew => Number(crew.workUsedDays) > 0);

                if (validCrewList.length === 0) {
                    alert("크루장으로 등록된 크루가 없어 워케이션을 신청할 수 없습니다. 크루를 먼저 생성해 주세요!");
                    navigate("/lobby");
                    return;
                }

                setCrewList(validCrewList);

            } catch (error) {
                console.error("초기 데이터 로딩 중 오류 발생:", error);
            }
        };

        initData();
    }, [navigate]);

    // 오늘 날짜 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // 날짜 연산 함수
    const addDays = (dateString, days) => {
        const result = new Date(dateString);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    };

    // 크루 선택 핸들러
    const handleCrewChange = (e) => {
        const crewId = e.target.value;
        setSelectedCrew(crewId);

        const crewObj = crewList.find((crew) => String(crew.crewId) === String(crewId));
        setSelectedCrewInfo(crewObj || null);

        // 크루 변경 시 이미 시작일이 정해져 있다면 해당 크루의 workUsedDays 기준으로 종료일 자동 재계산
        if (crewObj && startDate) {
            const allowedDays = Number(crewObj.workUsedDays) || 1;
            setEndDate(addDays(startDate, allowedDays - 1));
        }
    };

    // 시작일 변경 핸들러 (시작일 선택 -> 종료일 자동 계산)
    const handleStartDateChange = (e) => {
        const newStart = e.target.value;
        setStartDate(newStart);

        const allowedDays = Number(selectedCrewInfo.workUsedDays) || 1;
        const calculatedEnd = addDays(newStart, allowedDays - 1);
        setEndDate(calculatedEnd);
    };

    // 종료일 변경 핸들러 (종료일 선택 -> 시작일 자동 계산)
    const handleEndDateChange = (e) => {
        const newEnd = e.target.value;

        const allowedDays = Number(selectedCrewInfo.workUsedDays) || 1;
        let calculatedStart = addDays(newEnd, -(allowedDays - 1));

        // 계산된 시작일이 오늘보다 이전 날짜인 경우 처리
        if (calculatedStart < today) {
            setStartDate(today);
            setEndDate(addDays(today, allowedDays - 1));
        } else {
            setStartDate(calculatedStart);
            setEndDate(newEnd);
        }
    };  

    // 신청하기 핸들러
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

        const isConfirm = window.confirm("워케이션을 신청하시겠습니까?");

        if (!isConfirm) {
            return; 
        }

        const application = {
            crew: { crewId: Number(selectedCrew) },
            facility: selectedFacility ? { facilityId: Number(selectedFacility) } : null,
            reservationDate: {
                startDate: startDate,
                endDate: endDate
            },
            region: selectedFacility ? null : region,
            purpose: purpose
        };

        try {
            const response = await insertApplicationApi(application);
            if( response.data === "success" || response.data === 1 ){
                alert("워케이션 신청이 완료되었습니다.");
                navigate("/reservation/list");
            }
        } catch (error) {
            console.error("신청 실패:", error);
            alert("신청 처리 중 오류가 발생했습니다.");
        }
    };

    // 초기화 핸들러
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
        <div>
            <h2 align="center">워케이션 신청</h2>
            <br /><br />

            <form id="insert-form" align="center" onSubmit={handleSubmit}>
                <table className="table table-bordered align-middle">
                    <tbody>
                        <tr>
                            <th>크루</th>
                            <td>
                                <div className="d-flex flex-column gap-1">
                                    <select 
                                        className="form-select"
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
                                        <small className="text-primary mt-1">
                                            <strong>{selectedCrewInfo.crewName}</strong> 크루 신청 시,
                                            <strong> {selectedCrewInfo.workUsedDays}일</strong> 동안 예약할 수 있습니다.
                                        </small>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>시설</th>
                            <td>
                                <select 
                                    id="facility-select" 
                                    className="form-select"
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
                            <th>예약날짜</th>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        min={today} 
                                        value={startDate} 
                                        onChange={handleStartDateChange}
                                        disabled={!selectedCrew}
                                    />
                                    <span>~</span>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        min={today}
                                        value={endDate} 
                                        onChange={handleEndDateChange} 
                                        disabled={!selectedCrew}
                                    />
                                </div>
                                {!selectedCrew && (
                                    <small className="text-muted d-block mt-1">
                                        * 날짜를 선택하려면 먼저 크루를 선택해 주세요.
                                    </small>
                                )}
                            </td>
                        </tr>
                        {!selectedFacility && (
                            <tr>
                                <th className="table-light text-center">지역</th>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="희망 지역을 입력하세요 (선택 사항)" 
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                    />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <th>목적</th>
                            <td>
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
                <div align="right">
                    <button type="button" onClick={handleReset} className="btn btn-outline-secondary btn-sm me-2">⟳</button>
                    <button type="submit" className="btn btn-outline-primary btn-sm">신청하기</button>
                </div>
            </form>
            <br /><br />
        </div>
    );
}

export default WorkationApplicationComponent;