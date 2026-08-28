
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { insertCrewApi } from '../api/CrewApi';

function CrewEnrollFormComponent() {

  const LISTURL = "/admin/crew/list";

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
    <div align="center">
      <h2>+ 새로운 크루 생성</h2>
      
      <form onSubmit={insertCrew}>
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

export default CrewEnrollFormComponent;