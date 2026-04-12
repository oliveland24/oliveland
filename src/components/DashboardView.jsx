import { useState, useEffect } from 'react';
import './DashboardView.css';

function DashboardView() {
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const c = localStorage.getItem('oliveland_customers');
    const p = localStorage.getItem('oliveland_properties');
    const ct = localStorage.getItem('oliveland_contracts');
    if (c) setCustomers(JSON.parse(c));
    if (p) setProperties(JSON.parse(p));
    if (ct) setContracts(JSON.parse(ct));
  }, []);

  const activePropertiesCount = properties.filter(p => p.status === '광고중').length;
  const pendingContractsCount = contracts.filter(c => c.status !== '잔금완료').length;
  const newLeadsCount = customers.length;
  
  // Create dynamic recent activities by combining items, assuming IDs like Date.now() for new items
  const recentActivities = [
    ...customers.map(c => ({ id: c.id, icon: '👤', bg: '#fefce8', color: '#a16207', title: '신규 고객 등록', desc: `${c.name} 고객님이 등록되었습니다.`, time: c.id })),
    ...properties.map(p => ({ id: p.id, icon: '🏢', bg: '#eff6ff', color: '#1d4ed8', title: '신규 매물 등록', desc: `${p.title} 매물 등록됨.`, time: p.id })),
    ...contracts.map(c => ({ id: c.id, icon: '🤝', bg: '#f0fdf4', color: '#15803d', title: '계약 현황 업데이트', desc: `${c.property} - ${c.status}`, time: c.id }))
  ].sort((a, b) => b.time - a.time).slice(0, 3);

  // If there's no data, supply fallback mock data to prevent empty state looking too blank
  const activitiesToRender = recentActivities.length > 0 ? recentActivities : [
    { id: 1, icon: '💬', bg: '#f8fafc', color: '#64748b', title: '환영합니다', desc: '올리브랜드 CRM 방문을 환영합니다.', time: '방금 전' }
  ];

  return (
    <>
      <header className="top-header">
        <div>
          <h1>대시보드</h1>
          <p className="subtitle">올리브 대표님, 4월의 영업 현황을 한눈에 확인하세요.</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-title">전체 고객 수 (로컬)</div>
          <div className="stat-value">{newLeadsCount}명</div>
          <div className="stat-trend trend-up">데이터 실시간 연동됨</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-title">광고 중인 매물 (로컬)</div>
          <div className="stat-value">{activePropertiesCount}건</div>
          <div className="stat-trend trend-up">총 {properties.length}건 중 광고중</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-title">잔금 대기 중 계약 (로컬)</div>
          <div className="stat-value">{pendingContractsCount}건</div>
          <div className="stat-trend trend-down">총 {contracts.length}건 중 미완료</div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">최근 영업 활동</h2>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>모두 보기</button>
          </div>
          <div className="activity-list">
            {activitiesToRender.map(act => (
              <div key={`act-${act.id}`} className="activity-item">
                <div className="activity-icon" style={{ background: act.bg, color: act.color }}>{act.icon}</div>
                <div className="activity-content">
                  <div className="activity-title">{act.title}</div>
                  <div className="activity-desc">{act.desc}</div>
                </div>
                <div className="activity-time">{typeof act.time === 'number' && act.time > 10000 ? '최근 추가됨' : act.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">다가오는 일정</h2>
          </div>
          <div className="schedule-list">
            <div className="schedule-item">
              <div className="schedule-date">4월 15일 (금) 14:00</div>
              <div className="schedule-title">홍길동 고객님 임장 다녀오기</div>
              <div className="schedule-desc">잠실 파크리오 및 엘스 총 3곳 방문 안내</div>
            </div>
            <div className="schedule-item" style={{ borderLeftColor: '#f59e0b' }}>
              <div className="schedule-date">4월 20일 (수) 10:00</div>
              <div className="schedule-title">가계약 입금 확인 대기</div>
              <div className="schedule-desc">역삼동 신축 오피스텔 301호 전세 계약</div>
            </div>
            <div className="schedule-item" style={{ borderLeftColor: '#ef4444' }}>
              <div className="schedule-date">4월 30일 (토) 11:30</div>
              <div className="schedule-title">최종 잔금 및 입주 확인</div>
              <div className="schedule-desc">김올리브 님, 부동산 중개보수 정산 포함</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardView;
