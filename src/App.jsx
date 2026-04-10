import { useState } from 'react'
import './App.css'

const INITIAL_CUSTOMERS = [
  { id: 1, name: '홍길동', phone: '010-1234-5678', type: '매수인', requirement: '아파트 매매, 송파구, 8억 내외', status: '상담중', memo: '대출금 확인 완료, 이번 주 토요일 임장 예정' },
  { id: 2, name: '김올리브', phone: '010-9876-5432', type: '임차인', requirement: '오피스텔 전세, 강남구, 2억', status: '계약완료', memo: '잔금일 4/30일. 등기부등본 이상 없음.' },
];

function App() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  
  // 모달(팝업) 열림/닫힘 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  
  // 필터 및 정렬 상태 관리
  const [filterType, setFilterType] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [sortBy, setSortBy] = useState('최근순');
  
  // 새 고객 입력 폼 데이터 관리
  const [formData, setFormData] = useState({
    name: '', phone: '', type: '매수인', requirement: '', status: '가망고객', memo: '',
    propertyAddress: '', ownerAddress: ''
  });

  // 입력칸에 글씨를 쓸 때마다 formData를 업데이트해주는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 핸드폰 번호 자동 하이픈(-) 입력 처리
    if (name === 'phone') {
      const onlyNumber = value.replace(/[^0-9]/g, '');
      let formattedNumber = onlyNumber;
      if (onlyNumber.length < 4) {
        formattedNumber = onlyNumber;
      } else if (onlyNumber.length < 8) {
        formattedNumber = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3);
      } else {
        formattedNumber = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3, 7) + '-' + onlyNumber.slice(7, 11);
      }
      setFormData({ ...formData, [name]: formattedNumber });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // '저장하기' 버튼을 눌렀을 때 실행되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    
    if (editingCustomerId) {
      // 기존 고객 정보 수정
      setCustomers(customers.map(c => 
        c.id === editingCustomerId ? { ...c, ...formData } : c
      ));
    } else {
      // 새 고객 추가
      const newCustomer = {
        ...formData,
        id: Date.now() // 임시로 현재 시간을 고유 ID로 사용
      };
      setCustomers([newCustomer, ...customers]);
    }
    
    // 폼 초기화 및 모달 닫기
    setFormData({ name: '', phone: '', type: '매수인', requirement: '', status: '가망고객', memo: '', propertyAddress: '', ownerAddress: '' });
    setEditingCustomerId(null);
    setIsModalOpen(false);
  };

  // 고객 행 클릭 시 수정 모달 열기
  const handleEditClick = (customer) => {
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      type: customer.type || '매수인',
      requirement: customer.requirement || '',
      status: customer.status || '가망고객',
      memo: customer.memo || '',
      propertyAddress: customer.propertyAddress || '',
      ownerAddress: customer.ownerAddress || ''
    });
    setEditingCustomerId(customer.id);
    setIsModalOpen(true);
  };

  // 고객 삭제
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCustomers(customers.filter(c => c.id !== editingCustomerId));
      setEditingCustomerId(null);
      setIsModalOpen(false);
    }
  };

  // 필터와 정렬이 적용된 최종 고객 리스트 계산
  const displayedCustomers = [...customers]
    .filter(c => filterType === '전체' || c.type === filterType)
    .filter(c => filterStatus === '전체' || c.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === '최근순') return b.id - a.id;
      if (sortBy === '이름오름차순') return a.name.localeCompare(b.name);
      if (sortBy === '이름내림차순') return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="layout">
      {/* ---------------- 사이드바 ---------------- */}
      <aside className="sidebar">
        <div className="logo-area">
          <h2>OliveLand</h2>
          <span>스마트 공인중개사 CRM</span>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-item active">📝 고객 관리</a>
          <a href="#" className="nav-item">🤝 계약 장부</a>
          <a href="#" className="nav-item">🏢 매물 조회</a>
          <a href="#" className="nav-item">⚙️ 설정</a>
        </nav>
      </aside>

      {/* ---------------- 메인 콘텐츠 ---------------- */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>고객 현황</h1>
            <p className="subtitle">사장님의 소중한 고객들을 한눈에 관리하세요.</p>
          </div>
          {/* 새 고객 등록 버튼을 누르면 초기화 후 모달을 엽니다 */}
          <button className="btn-primary" onClick={() => {
            setEditingCustomerId(null);
            setFormData({ name: '', phone: '', type: '매수인', requirement: '', status: '가망고객', memo: '', propertyAddress: '', ownerAddress: '' });
            setIsModalOpen(true);
          }}>
            + 새 고객 등록
          </button>
        </header>

        <section className="table-container">
          <div className="filter-bar">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="전체">유형: 전체 보기</option>
              <option value="매도인">유형: 매도인</option>
              <option value="매수인">유형: 매수인</option>
              <option value="임대인">유형: 임대인</option>
              <option value="임차인">유형: 임차인</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="전체">상태: 전체 보기</option>
              <option value="가망고객">상태: 가망고객</option>
              <option value="상담중">상태: 상담중</option>
              <option value="계약완료">상태: 계약완료</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="최근순">정렬: 최근등록순</option>
              <option value="이름오름차순">정렬: 이름 (ㄱ~ㅎ)</option>
              <option value="이름내림차순">정렬: 이름 (ㅎ~ㄱ)</option>
            </select>
          </div>

          <table className="customer-table">
            <thead>
              <tr>
                <th>이름 / 연락처</th>
                <th>고객 유형</th>
                <th>희망 조건</th>
                <th>진행 상태</th>
                <th>최근 메모</th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.map((c) => (
                <tr key={c.id} onClick={() => handleEditClick(c)} style={{ cursor: 'pointer' }} className="customer-row" title="클릭하여 상세 보기 및 수정">
                  <td>
                    <div className="fw-600">{c.name}</div>
                    <div className="text-muted">{c.phone}</div>
                  </td>
                  <td>
                    <span className={`badge \${c.type === '매도인' || c.type === '임대인' ? 'badge-owner' : 'badge-seeker'}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="requirement-cell">{c.requirement}</td>
                  <td>
                    <span className={`status-badge \${c.status === '계약완료' ? 'status-done' : ''}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="memo-cell">{c.memo}</td>
                </tr>
              ))}
              {displayedCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    조건에 맞는 고객이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* ---------------- 새 고객 등록 팝업(모달) ---------------- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingCustomerId ? '고객 정보 상세/수정' : '새 고객 등록'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group-row">
                <div className="form-group">
                  <label>이름</label>
                  <input type="text" name="name" required placeholder="홍길동" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>연락처</label>
                  <input type="tel" name="phone" required placeholder="01012345678 (숫자만 입력)" maxLength="13" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label>고객 유형</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="매도인">매도인 (집/건물을 파는 분)</option>
                    <option value="매수인">매수인 (사는 분)</option>
                    <option value="임대인">임대인 (월세/전세 놓는 분)</option>
                    <option value="임차인">임차인 (들어갈 집 찾는 분)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>진행 상태</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="가망고객">가망 고객 (단순 문의)</option>
                    <option value="상담중">상담 중 (관리 중)</option>
                    <option value="계약완료">계약 완료</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>희망 지역 및 조건</label>
                <input type="text" name="requirement" placeholder="예: 강남구 2~30평대 아파트, 예산 10억" value={formData.requirement} onChange={handleInputChange} />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>물건지 주소</label>
                  <input type="text" name="propertyAddress" placeholder="예: 서울 송파구 올림픽로 123" value={formData.propertyAddress} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>소유자 주소 (다를 경우)</label>
                  <input type="text" name="ownerAddress" placeholder="예: 서울 강남구 테헤란로 456" value={formData.ownerAddress} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>초기 상담 메모</label>
                <textarea name="memo" rows="3" placeholder="특이사항이나 다음 일정 등을 메모하세요." value={formData.memo} onChange={handleInputChange}></textarea>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {editingCustomerId && (
                    <button type="button" className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }} onClick={handleDelete}>
                      삭제
                    </button>
                  )}
                </div>
                <div>
                  <button type="button" className="btn-secondary" style={{ marginRight: '8px' }} onClick={() => setIsModalOpen(false)}>취소</button>
                  <button type="submit" className="btn-primary">{editingCustomerId ? '수정하기' : '저장하기'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
