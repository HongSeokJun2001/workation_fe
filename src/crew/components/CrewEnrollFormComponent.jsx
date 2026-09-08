
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { insertCrewApi } from '../api/CrewApi';
import { selectMyEmployeeDetailApi } from '../../member/api/memberApi';
import '../styles/CrewCommunity.css';

function CrewEnrollFormComponent() {

  const LISTURL = "/crew/list";

  const today = new Date().toISOString().split("T")[0];
  const location = useLocation();
  const previousCrew = location.state?.crew;
  const [availableDays, setAvailableDays] = useState(null);

  const [crewData, setCrewData] = useState(() => previousCrew ? {
    crewName: previousCrew.crewName ?? "",
    capacity: previousCrew.capacity ?? "",
    createdDate: today,
    endDate: previousCrew.endDate?.substring(0, 10) ?? "",
    crewContent: previousCrew.crewContent ?? "",
    status: "Y",
    workUsedDays: previousCrew.workUsedDays ?? ""
  } : {crewName:"",
    capacity : "",
    createdDate: today,
    endDate : "",
    crewContent : "",
    status : "Y",
    workUsedDays: ""});

  useEffect(() => {
    selectMyEmployeeDetailApi()
      .then(response => setAvailableDays(response.data?.workationAvailDays ?? 0))
      .catch(() => setAvailableDays(null));
  }, []);


  let navigate = useNavigate();

  const handleChange = e => {

    if (e.target.name === "createdDate" && e.target.value < today) {
      alert("모집 시작일은 오늘보다 이전일 수 없습니다.");
      return;
    }

    const newCrewData = {...crewData};

    newCrewData[e.target.name] = e.target.name === "workUsedDays" && availableDays != null
      ? Math.min(Number(e.target.value), availableDays)
      : e.target.value;

    setCrewData(newCrewData);
  };

  //작성하기 버튼 클릭 시 실행할 이벤트 핸들러 함수 

  const insertCrew = async e => {
    e.preventDefault();

    if (availableDays != null && Number(crewData.workUsedDays) > availableDays) {
      alert(`작성자의 워케이션 가용일수(${availableDays}일)를 초과할 수 없습니다.`);
      return;
    }

    try{

      const response = await insertCrewApi(crewData);

      console.log(response.data);

      if(response.data == "success"){
        // 게시글 등록 성공
        alert("크루 모집 글 작성에 성공했습니다. ");

        navigate(`${LISTURL}`);

      }else{
        // > 크루 글 작성 실패

        alert("글 작성 실패");
        console.log("작성 실패!");

      }

    }catch(error){

      console.log("크루 모집 글 작성 ajax 실패 !");
       console.log(error);
        console.log(error.response);
        console.log(error.response?.data);


    }

  };

  return (
    <main className="crew-form-page"><div className="crew-form-shell">
      <div className="crew-form-heading"><p className="crew-eyebrow">CREW COMMUNITY</p><h2>새로운 크루 생성</h2><p>함께할 사람들과 워케이션 계획을 시작해보세요.</p></div>
      <form onSubmit={insertCrew}>
        <div className="crew-field"><label htmlFor="crew-name">크루명</label><input id="crew-name" type="text" name="crewName" value={crewData.crewName} onChange={handleChange} required /></div>


        <div className="crew-field-row"><div className="crew-field"><label htmlFor="crew-created-date">모집 시작일</label><input id="crew-created-date" type="date" name="createdDate" min={today} value={crewData.createdDate} onChange={handleChange} /></div>
          <div className="crew-field"><label htmlFor="crew-end-date">모집 마감일</label><input id="crew-end-date" type="date" name="endDate" value={crewData.endDate} onChange={handleChange} /></div>
        </div>
          
        {/* 워케이션 진행기간 필수 아님 */}
        {/* <div>
          <label>워케이션 진행 기간</label>
          <input type="date" name="periodStart" value={crewData.periodStart} onChange={handleChange} /> ~ 
          <input type="date" name="periodEnd" value={crewData.periodEnd} onChange={handleChange} />
        </div> */}

        <div className="crew-field">
          <label htmlFor="crew-capacity">모집 인원 (명)</label>
          <input id="crew-capacity" type="number" name="capacity" value={crewData.capacity} 
            onChange={handleChange} min="2" required />
            </div>

        <div className="crew-field"><label htmlFor="crew-days">워케이션 가용 일자 (일)</label><input id="crew-days" type="number" name="workUsedDays" value={crewData.workUsedDays || ""} onChange={handleChange} min="1" max={availableDays ?? undefined} step="1" required /><small>작성자 가용일수: {availableDays == null ? "확인 중" : `${availableDays}일`}</small></div>



        <div className="crew-field"><label htmlFor="crew-content">크루 및 워케이션 콘텐츠 소개</label><textarea id="crew-content" name="crewContent" rows="5" value={crewData.crewContent} onChange={handleChange} /></div>

        <p className="crew-notice">크루 모집 완료 후 관리자 승인을 받아야 워케이션 예약이 가능합니다.</p>

        <div className="crew-form-actions">

          <button className="crew-primary-button" type="submit" >등록하기</button>
          <button className="crew-secondary-button" type="reset" onClick={() => {setCrewData({crewName : "",
                                                            createdDate : today,
                                                            endDate : "",
                                                            capacity : "",
                                                            crewContent : "", 
                                                            workUsedDays : "",
                                                          status : "Y"})
                                                }}>
              초기화
          </button>
          <button className="crew-secondary-button" type="button" onClick={() => navigate(`${LISTURL}`)}>목록으로</button>

        </div>

        <br/><br/>


      </form>
    </div></main>
  );

    

}

export default CrewEnrollFormComponent;
