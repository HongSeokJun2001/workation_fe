
import { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { updateCrewApi, selectCrewApi } from '../api/CrewApi';

function CrewUpdateForm({ selectedCrew, onCancel, onSubmitSuccess }) {
  const LISTURL = "/crew/list";


  const [result, setResult] = useState("success");

  const location = useLocation();

  let navigate = useNavigate();
  
  const crewId = location.state?.crewId;

  const [crewData, setCrewData] = useState({crewName:"",
                                            capacity : "",
                                            createdDate:"",
                                            endDate : "",
                                            crewContent : "",
                                            status : "Y"});

  //수정하기 페이지 > 기존의 글정보가 먼저 보여져야 함
  // 이 컴포넌트가 최초로 단 하 ㄴ번 로딩 된 후 실행할 구문 내에서 상세 조회ㅗ 먼저

  useEffect(()=>{

    const updateCrew = async () => {

      if(!crewId){

        alert("잘못된 접근입니다.");
        navigate(`${LISTURL}`);
        return;
      }

      try{

        // crewId 넘기는 api.. 만들어야되는건가?
        const response = await selectCrewApi(crewId);


        setCrewData({
            crewId: response.data.crewId,
            crewName: response.data.crewName ?? "",
            capacity: response.data.capacity ?? "",
            createdDate: response.data.createdDate?.substring(0, 10) ?? "",
            endDate: response.data.endDate?.substring(0, 10) ?? "",
            crewContent: response.data.crewContent ?? "",
            status: response.data.status ?? "Y"
        });


      }catch(error){

        console.log("크루 모집 글 조회 ajax통신 실패 !");
      }
    }

    updateCrew();

  },[crewId, navigate]);


  // 입력값 변경 시 실행할 이벤트 핸들러 함수

  const handleChange = e => {
    const newCrewData = {...crewData};

    newCrewData[e.target.name] = e.target.value;

    setCrewData(newCrewData);

  };

  // 수정하기 버튼 클릭시 실행할 이벤트 핸들러

  const updateCrew = async e => {
    e.preventDefault();

    try{

      const payload = {

        ...crewData,
        crewId,
        status : crewData.status || "Y"
      };

      const response = await updateCrewApi(crewId, payload);

      console.log(response.data);

      if(response.data == "success"){

        alert("공지사항 수정 성공");

        // 다시 목록으로 
        navigate(`${LISTURL}`);

      }else{

        // 수정 실패

        alert("공지사항 수정에 실패했습니다.");
        setResult(response.data);
        
      }


    }catch(error){

      // > 모집글 수정 실패 

      console.log("모집글 수정에 ajax 통신 실패");
    }
  };

  return (
        <div align="center">
      <h2>+ 크루 정보 수정</h2>
      
      <form onSubmit={updateCrew}>
        <div>
          <label>크루명</label>
          <input type="text" name="crewName" value={crewData.crewName} onChange={handleChange} required />
        </div>

        {/* 장소는 필수값 아님 */}
        {/* <div>
          <label>워케이션 장소</label>
          <input type="text" name="location" value={crewData.location} onChange={handleChange}/>
        </div> */}

        <div>
          <label>모집 마감일</label>
          <input type="date" name="createdDate" value={crewData.createdDate} onChange={handleChange} /> ~ 
          <input type="date" name="endDate" value={crewData.endDate} onChange={handleChange} />
        </div>
          
        {/* 워케이션 진행기간 필수 아님 */}
        {/* <div>
          <label>워케이션 진행 기간</label>
          <input type="date" name="periodStart" value={crewData.periodStart} onChange={handleChange} /> ~ 
          <input type="date" name="periodEnd" value={crewData.periodEnd} onChange={handleChange} />
        </div> */}

        <div>
          <label>모집 인원 (명)</label>
          <input type="number" name="capacity" value={crewData.capacity} onChange={handleChange} min="2" />
        </div>

        {/* 태그 필수 아님  */}
        {/* <div>
          <label>태그 (쉼표로 구분)</label>
          <input type="text" name="tags" placeholder="예: 개발, PM, 디자인" value={crewData.tags} onChange={handleChange} />
        </div> */}

        <div>
          <label>크루 및 워케이션 컨텐츠 소개</label>
          <textarea name="crewContent" rows="5" value={crewData.crewContent} onChange={handleChange} />
        </div>

        <p color='red'>크루 모집 완료 후 관리자 승인을 받아야 워케이션 예약이 가능합니다.</p>

        <div>

          <button type="submit" >등록하기</button>
          <button type="reset" onClick={() => {setCrewData({crewName : "",
                                                            createdDate : "",
                                                            endDate : "",
                                                            capacity : "",
                                                            crewContent : "", 
                                                          status : "Y"})
                                                }}>
              초기화
          </button>
          <button type="button" onClick={() => navigate(`${LISTURL}`)}>목록으로</button>

        </div>

        <br/><br/>


      </form>


    </div>
  );
}

export default CrewUpdateForm;