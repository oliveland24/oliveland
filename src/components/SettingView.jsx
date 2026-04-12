import { useState, useEffect } from 'react';

function SettingView() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('oliveland_settings');
    if (saved) return JSON.parse(saved);
    return {
      companyName: '올리브 공인중개사',
      representativeName: '김올리브',
      phone: '02-1234-5678',
      registrationNumber: '11xxx-2026-00xxx',
      address: '서울 강남구 테헤란로 123 올리브빌딩 1층',
      notifyNewLead: true,
      rememberFilters: true,
      useDarkMode: false
    };
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    localStorage.setItem('oliveland_settings', JSON.stringify(settings));
    alert('설정이 저장되었습니다.');
  };

  return (
    <>
      <header className="top-header">
        <div>
          <h1>설정</h1>
          <p className="subtitle">내 부동산 정보와 앱 환경을 설정하세요.</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>변경사항 저장</button>
      </header>

      <section className="table-container" style={{ maxWidth: '800px', margin: '0' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700' }}>내 중개사무소 정보</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group-row">
            <div className="form-group">
              <label>상호명</label>
              <input type="text" name="companyName" value={settings.companyName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>대표자명</label>
              <input type="text" name="representativeName" value={settings.representativeName} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group-row">
            <div className="form-group">
              <label>연락처</label>
              <input type="text" name="phone" value={settings.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>중개등록번호</label>
              <input type="text" name="registrationNumber" value={settings.registrationNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>사무소 주소</label>
            <input type="text" name="address" value={settings.address} onChange={handleChange} />
          </div>
        </div>

        <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700' }}>앱 설정</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
            <input type="checkbox" name="notifyNewLead" checked={settings.notifyNewLead} onChange={handleChange} /> 새로운 고객 등록 시 알림 받기
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
            <input type="checkbox" name="rememberFilters" checked={settings.rememberFilters} onChange={handleChange} /> 매물 조회 필터 상태 기억하기
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
            <input type="checkbox" name="useDarkMode" checked={settings.useDarkMode} onChange={handleChange} /> 다크 모드 사용 (준비 중)
          </label>
        </div>
      </section>
    </>
  );
}

export default SettingView;
