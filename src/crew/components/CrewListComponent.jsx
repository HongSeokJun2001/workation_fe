

function CrewListComponent() {


    return (
        <div>
            <div className="crew-community-container">
      
        {/* 상단, 크루만들기(글작성) 버튼 */}
        <div>
          <h2>크루 커뮤니티</h2>
          <p>함께 워케이션을 떠날 크루를 찾거나 만들어보세요</p>
        </div>

        <br/><br/>

        <button //onClick={onNavigateToEnroll}
        >+ 크루 만들기</button>

        <br/><br/>


      {/* 검색창 영역 */}
      <div className="search-section">
        <input 
          type="text" 
          placeholder="크루명, 위치, 태그 검색..." 
          //value={searchTerm}
          //onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>검색</button>
      </div>

      {/* 내가 참여한 크루 (선택적 섹션) */}
      {/* <section className="my-crew-section">
        <h3>내가 참여한 크루</h3>
        <div className="my-crew-card">
          <h4>스타트업 디자인 크루</h4>
          <p>📅 2026년 9월 15–19일 · 📍 제주 오름뷰 워크하우스</p>
          <div>
            <button>워케이션 신청</button>
            <button>탈퇴</button>
          </div>
        </div>
      </section> */}

      {/* 모집 중인 크루 리스트 */}
      <div className="crew-list-section">
        <h3>모집 중인 크루</h3>
        
        
          {/* <article key={crew.id} className="crew-card" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}> */}

            {/* 카드 상단: 제목, 모집상태, 작성자 전용 버튼(수정/삭제) */}
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span>상태 </span>
                <strong>제목</strong>
              </div>
              
              {/* 본인이 작성자인 경우 수정/삭제 버튼 노출 */}
              {/* {crew.authorId === currentUserId ? ( */}
                <div className="author-actions">
                  <button 
                //   onClick={() => onNavigateToUpdate(crew)}
                  >수정</button>
                  <button 
                //   onClick={() => handleDelete(crew.id)}
                  >삭제</button>
                </div>
              {/* ) : ( */}
                <button>크루 신청</button>
              {/* //)} */}
            </div>

            {/* 메타 정보 */}
            <div className="card-meta">
              <p>🏢 회사 · 📍 위치 · 📅 기간</p>
            </div>

            {/* 설명 영역 */}
            <p className="card-description">설명</p>

            {/* 태그 영역
            <div className="card-tags">
              {crew.tags.map((tag, idx) => (
                <span key={idx} style={{ marginRight: '5px' }}>#{tag}</span>
              ))}
            </div> */}

            {/* 모집 현황 바 및 인원 표시 */}
            <div className="card-footer">
              <span>모집 현황: 0 / 0 명</span>
            </div>
          {/* </article> */}
        
      </div>

      {/* 페이징 처리 영역 */}
      {/* <div className="pagination-section" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '20px' }}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>이전</button>
        <span>[ {currentPage} ]</span>
        <button onClick={() => setCurrentPage(p => p + 1)}>다음</button>
      </div> */}
    </div>
        </div>
    )

}

export default CrewListComponent;
