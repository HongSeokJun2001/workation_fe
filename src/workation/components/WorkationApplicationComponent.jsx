import React, { useState } from 'react';

function WorkationApplicationComponent() {

    const [selectedFacility, setSelectedFacility] = useState("");

    // 시설 선택 변경 핸들러
    const handleFacilityChange = (e) => {
        setSelectedFacility(e.target.value);
    };

    return (
        <div>

            <h2 align="center">워케이션 신청</h2>

            <br /><br />

            <form id="insert-form" align="center">
                <table className="table table-bordered align-middle">
                    <tbody>
                        <tr>
                            <th>크루</th>
                            <td>
                                <select className="form-select">
                                    <option value="">크루 선택</option>
                                    <option value="crew1">개발 A팀 크루</option>
                                    <option value="crew2">디자인 B팀 크루</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>시설</th>
                            <td>
                                <select className="form-select" 
                                    value={selectedFacility} 
                                    onChange={handleFacilityChange}>
                                    <option value="">시설 선택 안함 (없음)</option>
                                    <option value="facility1">제주 워케이션 센터 A동</option>
                                    <option value="facility2">강릉 서프 오피스</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>예약날짜</th>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <input type="date" className="form-control" />
                                    <span>~</span>
                                    <input type="date" className="form-control" />
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
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div align="right">
                    <button type="reset" className="btn btn-outline-secondary btn-sm">⟳</button>
                    <button type="submit"className="btn btn-outline-primary btn-sm">신청하기</button>
                </div>
            </form>
            
            <br /><br />
        </div>
    );
}

export default WorkationApplicationComponent;