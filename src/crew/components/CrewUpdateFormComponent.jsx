
import React, { useState } from 'react';

function CrewUpdateForm({ selectedCrew, onCancel, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    // title: selectedCrew?.title || '',
    // location: selectedCrew?.location || '',
    // maxMembers: selectedCrew?.maxMembers || 5,
    // description: selectedCrew?.description || '',
    // tags: selectedCrew?.tags?.join(', ') || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API 수정 로직 작성 위치
    console.log('크루 수정 데이터:', formData);
    onSubmitSuccess();
  };

  return (
    <div className="crew-update-container">
      <h2>크루 정보 수정</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>크루 제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>워케이션 장소</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div>
          <label>모집 인원 (명)</label>
          <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleChange} min="2" />
        </div>

        <div>
          <label>태그 (쉼표로 구분)</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
        </div>

        <div>
          <label>크루 및 활동 소개</label>
          <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-actions">
          <button type="submit">수정 완료</button>
          <button type="button" onClick={onCancel}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default CrewUpdateForm;