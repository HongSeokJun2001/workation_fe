import React, { useState, useEffect } from 'react'; // useEffect 추가
import axios from 'axios'; // axios 추가
import { insertApplicationApi } from "../api/workationApi";
import { selectFacilityAllListApi } from '../../facility/api/facilityApi';
import { useNavigate } from "react-router-dom";

function WorkationApplicationComponent() {

    let navigate = useNavigate();

    const [facilityList, setFacilityList] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');

    const [selectedCrew, setSelectedCrew] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [region, setRegion] = useState(''); 
    const [purpose, setPurpose] = useState('');

    useEffect(() => {

        selectFacilityAllListApi()
            .then(response => {

                console.log("시설 목록 API 응답:", response.data);

                const data = response.data.list
                    ? response.data.list
                    : response.data;

                setFacilityList(Array.isArray(data) ? data : []);

            })
            .catch(error => {

                console.error("시설 목록을 불러오는 중 오류 발생:", error);
                setFacilityList([]);

            });

    }, []);

    // 오늘 날짜
    const today = new Date().toISOString().split('T')[0];

    // 시작일 변경 핸들러
    const handleStartDateChange = (e) => {
        const newStart = e.target.value;
        setStartDate(newStart);
        
        if (endDate && newStart > endDate) {
            setEndDate(newStart);
        }
    };

    // 종료일 변경 핸들러
    const handleEndDateChange = (e) => {
        const newEnd = e.target.value;
        setEndDate(newEnd);

        if (startDate && newEnd < startDate) {
            setStartDate(newEnd);
        }
    };

    // 시설 선택 변경 핸들러
    const handleFacilityChange = (e) => {
        setSelectedFacility(e.target.value);
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
            endDate: endDate,
            region: selectedFacility ? null : region,
            purpose: purpose
        };

        try {
            const response = await insertApplicationApi(application);
            if( response.data === "success" || response.data === 1 ){
                alert("워케이션 신청이 완료되었습니다.");
                navigate("/loby");
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
                                <select 
                                    className="form-select"
                                    value={selectedCrew}
                                    onChange={(e) => setSelectedCrew(e.target.value)}
                                >
                                    <option value="">크루 선택</option>
                                    <option value="1">개발 A팀 크루</option>
                                    <option value="2">디자인 B팀 크루</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>시설</th>
                            <td>
                                <select 
                                    id="facility-select" 
                                    className="form-select"
                                    value={selectedFacility} 
                                    onChange={handleFacilityChange}
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
                                    <input type="date" className="form-control" min={today} 
                                           value={startDate} onChange={handleStartDateChange}/>
                                    <span>~</span>
                                    <input type="date" className="form-control" min={startDate || today}
                                           value={endDate} onChange={handleEndDateChange} />
                                </div>
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