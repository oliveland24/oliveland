import { useState } from 'react'
import './App.css'
import CustomerView from './components/CustomerView'
import PropertyView from './components/PropertyView'
import ContractView from './components/ContractView'
import SettingView from './components/SettingView'
import DashboardView from './components/DashboardView'

function App() {
  const [activeTab, setActiveTab] = useState('홈'); // '홈', '고객관리', '매물조회', '계약장부', '설정'

  return (
    <div className="layout">
      {/* ---------------- 사이드바 ---------------- */}
      <aside className="sidebar">
        <div className="logo-area">
          <h2>OliveLand</h2>
          <span>스마트 공인중개사 CRM</span>
        </div>
        <nav className="nav-menu">
          <a href="#" className={`nav-item ${activeTab === '홈' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('홈'); }}>
            📊 대시보드
          </a>
          <a href="#" className={`nav-item ${activeTab === '고객관리' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('고객관리'); }}>
            📝 고객 관리
          </a>
          <a href="#" className={`nav-item ${activeTab === '매물조회' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('매물조회'); }}>
            🏢 매물 조회
          </a>
          <a href="#" className={`nav-item ${activeTab === '계약장부' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('계약장부'); }}>
            🤝 계약 장부
          </a>
          <a href="#" className={`nav-item ${activeTab === '설정' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('설정'); }}>
            ⚙️ 설정
          </a>
        </nav>
      </aside>

      {/* ---------------- 메인 콘텐츠 ---------------- */}
      <main className="main-content">
        {activeTab === '홈' && <DashboardView />}
        {activeTab === '고객관리' && <CustomerView />}
        {activeTab === '매물조회' && <PropertyView />}
        {activeTab === '계약장부' && <ContractView />}
        {activeTab === '설정' && <SettingView />}
      </main>
    </div>
  )
}

export default App
