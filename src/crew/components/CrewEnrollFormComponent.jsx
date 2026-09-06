
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { insertCrewApi } from '../api/CrewApi';
import '../styles/CrewCommunity.css';

function CrewEnrollFormComponent() {

  const LISTURL = "/crew/list";

  const [crewData, setCrewData] = useState({crewName:"",
    capacity : "",
    createdDate:"",
    endDate : "",
    crewContent : "",
    status : "Y"});


  let navigate = useNavigate();

  const handleChange = e => {

    const newCrewData = {...crewData};

    newCrewData[e.target.name] = e.target.value

    setCrewData(newCrewData);
  };

  //작성하기 버튼 클릭 시 실행할 이벤트 핸들러 함수 

  const insertCrew = async e => {
    e.preventDefault();

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

        {/* 장소는 필수값 아님 */}
        {/* <div>
          <label>워케이션 장소</label>
          <input type="text" name="location" value={crewData.location} onChange={handleChange}/>
        </div> */}

        <div className="crew-field-row"><div className="crew-field"><label htmlFor="crew-created-date">모집 시작일</label><input id="crew-created-date" type="date" name="createdDate" value={crewData.createdDate} onChange={handleChange} /></div>
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

        <div className="crew-field"><label htmlFor="crew-days">워케이션 가용 일자 (일)</label><input id="crew-days" type="number" name="workationAvailableDays" value={crewData.workationAvailableDays || ""} onChange={handleChange} min="1" step="1" required /></div>

        {/* 태그 필수 아님  */}
        {/* <div>
          <label>태그 (쉼표로 구분)</label>
          <input type="text" name="tags" placeholder="예: 개발, PM, 디자인" value={crewData.tags} onChange={handleChange} />
        </div> */}

        <div className="crew-field"><label htmlFor="crew-content">크루 및 워케이션 콘텐츠 소개</label><textarea id="crew-content" name="crewContent" rows="5" value={crewData.crewContent} onChange={handleChange} /></div>

        <p className="crew-notice">크루 모집 완료 후 관리자 승인을 받아야 워케이션 예약이 가능합니다.</p>

        <div className="crew-form-actions">

          <button className="crew-primary-button" type="submit" >등록하기</button>
          <button className="crew-secondary-button" type="reset" onClick={() => {setCrewData({crewName : "",
                                                            createdDate : "",
                                                            endDate : "",
                                                            capacity : "",
                                                            crewContent : "", 
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
