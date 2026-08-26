
import React, { useState } from 'react';

function CrewEnrollFormComponent() {

  const [formData, setFormData] = useState({
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API 등록 로직 작성 위치
    console.log('크루 등록 데이터:', formData);
    onSubmitSuccess();
  };

  return (
    <div className="crew-enroll-container">
      <h2>+ 새로운 크루 만들기</h2>
      
      <form>
        <div>
          <label>크루 제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>워케이션 장소</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div>
          <label>진행 기간</label>
          <input type="date" name="periodStart" value={formData.periodStart} onChange={handleChange} /> ~ 
          <input type="date" name="periodEnd" value={formData.periodEnd} onChange={handleChange} />
        </div>

        <div>
          <label>모집 인원 (명)</label>
          <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleChange} min="2" />
        </div>

        <div>
          <label>태그 (쉼표로 구분)</label>
          <input type="text" name="tags" placeholder="예: 개발, PM, 디자인" value={formData.tags} onChange={handleChange} />
        </div>

        <div>
          <label>크루 및 활동 소개</label>
          <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-actions">
          <button type="submit">등록하기</button>
          <button type="button" >취소</button>
        </div>
      </form>
    </div>
  );

    

}

export default CrewEnrollFormComponent;