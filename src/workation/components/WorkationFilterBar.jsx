import { useState, useEffect, useCallback } from 'react';
import { selectFacilityAllListApi } from '../../facility/api/facilityApi';

const DEFAULT_STATUS_OPTIONS = [
  { label: '전체 상태', value: 'ALL' },
  { label: '신청 대기', value: 'APPLY' },
  { label: '승인 완료', value: 'CONFIRM' },
  { label: '반려/취소', value: 'CANCELLED' },
  { label: '예약 종료', value: 'COMPLETED' }
];

export const WorkationFilterBar = ({
  onFilterChange,
  statusOptions = DEFAULT_STATUS_OPTIONS,
}) => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('ALL');
  const [facility, setFacility] = useState('ALL');

  // DB에서 받아올 시설 목록 상태
  const [facilityListOptions, setFacilityListOptions] = useState([
    { label: '전체 시설', value: 'ALL' }
  ]);

  // 1. 컴포넌트 마운트 시 시설 목록 API 호출
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await selectFacilityAllListApi();
        // 백엔드 데이터 구조에 맞춰 매핑 (facilityId, facilityName)
        const list = response.data || [];
        const formattedList = list.map((item) => ({
          label: item.facilityName || item.name,
          value: String(item.facilityId || item.id),
        }));

        setFacilityListOptions([
          { label: '전체 시설', value: 'ALL' },
          ...formattedList
        ]);
      } catch (error) {
        console.error("시설 목록 조회 실패:", error);
      }
    };

    fetchFacilities();
  }, []);

  // 2. 검색어/필터 조건 변경 시 부모 컴포넌트로 전달 (Debounce 300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        keyword,
        status,
        facility,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, status, facility, onFilterChange]);

  // 3. 필터 초기화
  const handleReset = useCallback(() => {
    setKeyword('');
    setStatus('ALL');
    setFacility('ALL');
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. 검색어 (크루명/리더명) */}
      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="크루명, 리더 이름 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.input}
        />
        {keyword && (
          <button onClick={() => setKeyword('')} style={styles.clearBtn}>
            ✕
          </button>
        )}
      </div>

      {/* 2. 상태 필터 */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={styles.select}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* 3. 시설/장소 필터 */}
      <select
        value={facility}
        onChange={(e) => setFacility(e.target.value)}
        style={styles.select}
      >
        {facilityListOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* 4. 초기화 버튼 */}
      <button onClick={handleReset} style={styles.resetBtn}>
        🔄 필터 초기화
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1 1 200px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '8px 32px 8px 12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
  },
  clearBtn: {
    position: 'absolute',
    right: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#adb5bd',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  resetBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
};