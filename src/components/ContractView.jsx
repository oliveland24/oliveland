import { useState, useMemo, useEffect } from 'react';

const INITIAL_CONTRACTS = [
  { id: 1, date: '2026-04-10', type: '아파트', dealType: '매매', property: '송파구 잠실동 엘스 아파트', price: '21억 5,000만', buyer: '홍길동', seller: '김매도', status: '계약금입금', memo: '잔금일 5/30' },
  { id: 2, date: '2026-04-05', type: '오피스텔', dealType: '전세', property: '강남구 역삼동 신축 오피스텔', price: '2억 8,000만', buyer: '김올리브', seller: '이임대', status: '잔금완료', memo: '입주 및 중개보수 완료' }
];

function ContractView() {
  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('oliveland_contracts');
    if (saved) return JSON.parse(saved);
    return INITIAL_CONTRACTS;
  });

  useEffect(() => {
    localStorage.setItem('oliveland_contracts', JSON.stringify(contracts));
  }, [contracts]);
  
  const [filterDeal, setFilterDeal] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('전체');

  const displayedContracts = useMemo(() => {
    return contracts
      .filter(c => filterDeal === '전체' || c.dealType === filterDeal)
      .filter(c => filterStatus === '전체' || c.status === filterStatus);
  }, [contracts, filterDeal, filterStatus]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    property: '',
    type: '아파트',
    dealType: '매매',
    price: '',
    buyer: '',
    seller: '',
    status: '계약금입금',
    memo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContract = { ...formData, id: Date.now() };
    setContracts([newContract, ...contracts]);
    setIsModalOpen(false);
    setFormData({ date: new Date().toISOString().split('T')[0], property: '', type: '아파트', dealType: '매매', price: '', buyer: '', seller: '', status: '계약금입금', memo: '' });
  };

  return (
    <>
      <header className="top-header">
        <div>
          <h1>계약 장부</h1>
          <p className="subtitle">체결된 계약 건들의 진행 상태와 일정을 관리하세요.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + 새 계약 등록
        </button>
      </header>

      <section className="table-container">
        <div className="filter-bar">
          <select value={filterDeal} onChange={(e) => setFilterDeal(e.target.value)}>
            <option value="전체">거래유형: 전체 보기</option>
            <option value="매매">거래유형: 매매</option>
            <option value="전세">거래유형: 전세</option>
            <option value="월세">거래유형: 월세</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="전체">상태: 전체 보기</option>
            <option value="계약금입금">상태: 계약금입금</option>
            <option value="중도금입금">상태: 중도금입금</option>
            <option value="잔금완료">상태: 잔금완료</option>
          </select>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>계약일 / 매물명</th>
              <th>거래 조건</th>
              <th>매수(임차) / 매도(임대)</th>
              <th>진행 상태</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {displayedContracts.map((c) => (
              <tr key={c.id} className="customer-row">
                <td>
                  <div className="text-muted text-sm">{c.date}</div>
                  <div className="fw-600">{c.property}</div>
                </td>
                <td>
                  <span className={`deal-badge deal-${c.dealType}`}>{c.dealType}</span>
                  <span className="price-text">{c.price}</span>
                </td>
                <td>
                  <div className="fw-600">{c.buyer}</div>
                  <div className="text-muted text-sm">{c.seller}</div>
                </td>
                <td>
                  <span className={`status-badge ${c.status === '잔금완료' ? 'status-done' : ''}`}>
                    {c.status}
                  </span>
                </td>
                <td className="memo-cell">{c.memo}</td>
              </tr>
            ))}
            {displayedContracts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  조건에 맞는 계약이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* 새 계약 등록 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
               <h2>새 계약 등록</h2>
               <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group-row">
                <div className="form-group">
                  <label>계약일</label>
                  <input type="date" name="date" required value={formData.date} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>진행 상태</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="계약금입금">계약금입금</option>
                    <option value="중도금입금">중도금입금</option>
                    <option value="잔금완료">잔금완료</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>매물명 (건물명, 동호수 등)</label>
                <input type="text" name="property" required placeholder="예: 잠실 엘스 아파트 101동 1502호" value={formData.property} onChange={handleInputChange} />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>매물 종류</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="아파트">아파트</option>
                    <option value="오피스텔">오피스텔</option>
                    <option value="단독주택">단독주택</option>
                    <option value="빌라">빌라</option>
                    <option value="상가">상가</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>거래 유형</label>
                  <select name="dealType" value={formData.dealType} onChange={handleInputChange}>
                    <option value="매매">매매</option>
                    <option value="전세">전세</option>
                    <option value="월세">월세</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>거래 금액</label>
                  <input type="text" name="price" required placeholder="예: 21억 5,000만" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>매수(임차)인</label>
                  <input type="text" name="buyer" required placeholder="예: 홍길동" value={formData.buyer} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>매도(임대)인</label>
                  <input type="text" name="seller" required placeholder="예: 김매도" value={formData.seller} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>특이사항 및 메모</label>
                <textarea name="memo" rows="2" placeholder="예: 잔금일 5/30, 대출 여부 확인 등" value={formData.memo} onChange={handleInputChange}></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" style={{ marginRight: '8px' }} onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit" className="btn-primary">계약 등록</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ContractView;
