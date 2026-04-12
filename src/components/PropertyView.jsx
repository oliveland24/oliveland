import { useState, useMemo, useEffect } from 'react';
import './PropertyView.css';

const INITIAL_PROPERTIES = [
  { id: 101, title: '송파구 잠실동 엘스 아파트', type: '아파트', dealType: '매매', price: '21억 5,000만', size: '84㎡ (33평)', floor: '15층/30층', address: '서울 송파구 올림픽로 99', owner: '김매도', phone: '010-1111-2222', image: '/modern_apartment_interior.png', status: '광고중' },
  { id: 102, title: '강남구 역삼동 신축 오피스텔', type: '오피스텔', dealType: '전세', price: '2억 8,000만', size: '29㎡ (9평)', floor: '8층/12층', address: '서울 강남구 테헤란로 123', owner: '이임대', phone: '010-3333-4444', image: '/modern_apartment_interior.png', status: '계약완료' },
  { id: 103, title: '마포구 공덕동 더샵 1차', type: '아파트', dealType: '월세', price: '1억 / 150만', size: '59㎡ (24평)', floor: '5층/25층', address: '서울 마포구 백범로 202', owner: '박건물', phone: '010-5555-6666', image: '/modern_apartment_interior.png', status: '광고중' },
  { id: 104, title: '서초구 반포동 프레스티지 단독', type: '단독주택', dealType: '매매', price: '45억', size: '150㎡ (45평)', floor: '1층/2층', address: '서울 서초구 사평대로 45', owner: '최부자', phone: '010-7777-8888', image: '/modern_apartment_interior.png', status: '보류' },
];

function PropertyView() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('oliveland_properties');
    if (saved) return JSON.parse(saved);
    return INITIAL_PROPERTIES;
  });

  useEffect(() => {
    localStorage.setItem('oliveland_properties', JSON.stringify(properties));
  }, [properties]);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  
  const [filterType, setFilterType] = useState('전체');
  const [filterDeal, setFilterDeal] = useState('전체');

  // 모달(상세보기) 상태 관리
  const [selectedProperty, setSelectedProperty] = useState(null);

  // 새 매물 등록 및 수정 팝업 상태 관리
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', type: '아파트', dealType: '매매', price: '', size: '', floor: '', address: '', owner: '', phone: '', status: '광고중', image: '/modern_apartment_interior.png', detailImages: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyNumber = value.replace(/[^0-9]/g, '');
      let formattedNumber = onlyNumber;
      if (onlyNumber.length < 4) formattedNumber = onlyNumber;
      else if (onlyNumber.length < 8) formattedNumber = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3);
      else formattedNumber = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3, 7) + '-' + onlyNumber.slice(7, 11);
      setFormData({ ...formData, [name]: formattedNumber });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('로컬 저장소의 한계로 가급적 2MB 이하의 이미지 사용을 권장합니다.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = formData.detailImages || [];
    if (files.length + updatedImages.length > 10) {
      alert('세부 사진은 최대 10장까지만 등록 가능합니다.');
      return;
    }
    
    const newImages = [];
    let loadedCount = 0;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        loadedCount++;
        if (loadedCount === files.length) {
          setFormData(prev => ({ ...prev, detailImages: [...(prev.detailImages || []), ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDetailImage = (index) => {
    setFormData(prev => ({
      ...prev,
      detailImages: (prev.detailImages || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (editingPropertyId) {
      setProperties(properties.map(p => p.id === editingPropertyId ? { ...formData, id: editingPropertyId } : p));
    } else {
      const newProperty = { ...formData, id: Date.now() };
      setProperties([newProperty, ...properties]);
    }
    setIsAddModalOpen(false);
    setEditingPropertyId(null);
    setFormData({ title: '', type: '아파트', dealType: '매매', price: '', size: '', floor: '', address: '', owner: '', phone: '', status: '광고중', image: '/modern_apartment_interior.png', detailImages: [] });
  };

  const displayedProperties = useMemo(() => {
    return properties
      .filter(p => filterType === '전체' || p.type === filterType)
      .filter(p => filterDeal === '전체' || p.dealType === filterDeal);
  }, [properties, filterType, filterDeal]);

  return (
    <>
      <header className="top-header">
        <div>
          <h1>매물 조회</h1>
          <p className="subtitle">확보된 매물 정보를 리스트와 카드로 한눈에 파악하세요.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditingPropertyId(null);
          setFormData({ title: '', type: '아파트', dealType: '매매', price: '', size: '', floor: '', address: '', owner: '', phone: '', status: '광고중', image: '/modern_apartment_interior.png', detailImages: [] });
          setIsAddModalOpen(true);
        }}>
          + 매물 등록
        </button>
      </header>

      <section className="property-container">
        <div className="filter-bar property-filter-bar">
          <div className="filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="전체">매물종류: 전체</option>
              <option value="아파트">아파트</option>
              <option value="오피스텔">오피스텔</option>
              <option value="단독주택">단독주택</option>
            </select>
            <select value={filterDeal} onChange={(e) => setFilterDeal(e.target.value)}>
              <option value="전체">거래유형: 전체</option>
              <option value="매매">매매</option>
              <option value="전세">전세</option>
              <option value="월세">월세</option>
            </select>
          </div>
          
          {/* 뷰 토글 버튼 */}
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📄 리스트
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
            >
              🖼️ 카드
            </button>
          </div>
        </div>

        {/* -------- 리스트 뷰 -------- */}
        {viewMode === 'list' && (
          <table className="property-table customer-table">
            <thead>
              <tr>
                <th>매물명 / 주소</th>
                <th>유형 / 층</th>
                <th>거래 조건</th>
                <th>면적</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {displayedProperties.map((p) => (
                <tr key={p.id} onClick={() => setSelectedProperty(p)} style={{ cursor: 'pointer' }} className="customer-row">
                  <td>
                    <div className="fw-600">{p.title}</div>
                    <div className="text-muted text-sm">{p.address}</div>
                  </td>
                  <td>
                    <div>{p.type}</div>
                    <div className="text-muted text-sm">{p.floor}</div>
                  </td>
                  <td>
                    <span className={`deal-badge deal-${p.dealType}`}>{p.dealType}</span>
                    <span className="price-text">{p.price}</span>
                  </td>
                  <td>{p.size}</td>
                  <td>
                    <span className={`status-badge ${p.status === '계약완료' ? 'status-done' : ''}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {displayedProperties.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    조건에 맞는 매물이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* -------- 카드 뷰 -------- */}
        {viewMode === 'card' && (
          <div className="property-grid">
            {displayedProperties.map((p) => (
              <div key={p.id} className="property-card" onClick={() => setSelectedProperty(p)}>
                <div className="card-image">
                  <img src={p.image} alt="매물 사진" />
                  <div className={`card-badge-top deal-${p.dealType}`}>{p.dealType}</div>
                  {p.status === '계약완료' && <div className="card-overlay">계약완료</div>}
                </div>
                <div className="card-content">
                  <h3 className="card-title">{p.title}</h3>
                  <div className="card-price">{p.price}</div>
                  <div className="card-details">
                    <span>{p.type}</span> • <span>{p.size}</span> • <span>{p.floor}</span>
                  </div>
                  <div className="card-address">{p.address}</div>
                </div>
              </div>
            ))}
            {displayedProperties.length === 0 && (
              <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#888' }}>
                조건에 맞는 매물이 없습니다.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 속성 상세 모달 */}
      {selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>매물 상세 정보</h2>
              <button className="close-btn" onClick={() => setSelectedProperty(null)}>✕</button>
            </div>
            <div className="modal-body">
              <img src={selectedProperty.image} alt="매물 사진" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
              {(selectedProperty.detailImages && selectedProperty.detailImages.length > 0) && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '8px' }}>
                  {selectedProperty.detailImages.map((img, idx) => (
                    <img key={`detail-${idx}`} src={img} alt={`세부 사진 ${idx + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid #eee' }} />
                  ))}
                </div>
              )}
              <h3>{selectedProperty.title}</h3>
              <p className="text-muted" style={{ marginBottom: '16px' }}>{selectedProperty.address}</p>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label>거래 유형</label>
                  <div><strong>{selectedProperty.dealType} {selectedProperty.price}</strong></div>
                </div>
                <div className="form-group">
                  <label>매물 종류</label>
                  <div>{selectedProperty.type}</div>
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>면적</label>
                  <div>{selectedProperty.size}</div>
                </div>
                <div className="form-group">
                  <label>해당층</label>
                  <div>{selectedProperty.floor}</div>
                </div>
              </div>
              
              <hr style={{ margin: '20px 0', borderColor: '#eee' }}/>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label>임대인/매도인</label>
                  <div>{selectedProperty.owner}</div>
                </div>
                <div className="form-group">
                  <label>연락처</label>
                  <div>{selectedProperty.phone}</div>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }} onClick={() => {
                  if (window.confirm('매물을 정말 삭제하시겠습니까?')) {
                    setProperties(properties.filter(p => p.id !== selectedProperty.id));
                    setSelectedProperty(null);
                  }
                }}>삭제</button>
                <div>
                  <button type="button" className="btn-secondary" style={{ marginRight: '8px' }} onClick={() => setSelectedProperty(null)}>닫기</button>
                  <button type="button" className="btn-primary" onClick={() => {
                    setFormData(selectedProperty);
                    setEditingPropertyId(selectedProperty.id);
                    setIsAddModalOpen(true);
                    setSelectedProperty(null);
                  }}>수정하기</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 새 매물 등록 모달 */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingPropertyId ? '매물 수정' : '새 매물 등록'}</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label>매물 대표 사진</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={formData.image} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }} />
                </div>
                
                <label style={{ marginTop: '12px', display: 'block' }}>세부 사진 (최대 10장)</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <input type="file" accept="image/*" multiple onChange={handleDetailImagesChange} style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }} />
                  <span className="text-muted text-sm">{(formData.detailImages || []).length} / 10</span>
                </div>
                {formData.detailImages && formData.detailImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {formData.detailImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt="detail" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                        <button type="button" onClick={() => removeDetailImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>매물명 (표시용)</label>
                <input type="text" name="title" required placeholder="예: 잠실 파크리오 30평형" value={formData.title} onChange={handleInputChange} />
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
                <div className="form-group">
                  <label>상태</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="광고중">광고중</option>
                    <option value="계약완료">계약완료</option>
                    <option value="보류">보류</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>가격조건</label>
                  <input type="text" name="price" required placeholder="예: 10억 5천, 1억/50" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>면적</label>
                  <input type="text" name="size" placeholder="예: 84㎡ (33평)" value={formData.size} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>해당층/총층</label>
                  <input type="text" name="floor" placeholder="예: 5층/20층" value={formData.floor} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>소재지</label>
                <input type="text" name="address" required placeholder="예: 서울 송파구 올림픽로 99" value={formData.address} onChange={handleInputChange} />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>매도인/임대인</label>
                  <input type="text" name="owner" required placeholder="이름" value={formData.owner} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>연락처</label>
                  <input type="tel" name="phone" required placeholder="01012345678" maxLength="13" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" style={{ marginRight: '8px' }} onClick={() => setIsAddModalOpen(false)}>취소</button>
                <button type="submit" className="btn-primary">{editingPropertyId ? '수정하기' : '등록하기'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyView;
