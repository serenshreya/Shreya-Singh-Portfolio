import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChartBar, FaUserCircle, FaProjectDiagram, FaLightbulb, FaBriefcase, FaNewspaper, FaEnvelope, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'

import AdminOverview from './sections/AdminOverview'
import ManagePersonalInfo from './sections/ManagePersonalInfo'
import ManageProjects from './sections/ManageProjects'
import ManageSkills from './sections/ManageSkills'
import ManageExperience from './sections/ManageExperience'
import ManageBlog from './sections/ManageBlog'
import ManageContact from './sections/ManageContact'

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', icon: FaChartBar },
  { key: 'personal_info', label: 'Personal Info', icon: FaUserCircle, highlight: true },
  { key: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { key: 'skills', label: 'Skills', icon: FaLightbulb },
  { key: 'experience', label: 'Experience', icon: FaBriefcase },
  { key: 'blog', label: 'Blog', icon: FaNewspaper },
  { key: 'messages', label: 'Messages', icon: FaEnvelope },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [unreadCount, setUnreadCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) {
      navigate('/admin/login')
      return
    }

    async function fetchUnread() {
      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)
      setUnreadCount(count || 0)
    }
    fetchUnread()
  }, [navigate, activeSection])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin/login')
  }

  const handleNavClick = (key) => {
    setActiveSection(key)
    setSidebarOpen(false) // Close sidebar on mobile after click
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminOverview />
      case 'personal_info': return <ManagePersonalInfo />
      case 'projects': return <ManageProjects />
      case 'skills': return <ManageSkills />
      case 'experience': return <ManageExperience />
      case 'blog': return <ManageBlog />
      case 'messages': return <ManageContact />
      default: return <AdminOverview />
    }
  }

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <div className="admin-mobile-topbar">
        <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="admin-mobile-title">
          <span className="accent">SS</span> Admin
        </div>
        <div className="admin-mobile-section-label">{SECTIONS.find(s => s.key === activeSection)?.label}</div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <span className="accent">SS</span> Admin
        </div>
        <div className="admin-sidebar-label">Dashboard</div>

        <nav className="admin-nav">
          {SECTIONS.map(sec => (
            <button
              key={sec.key}
              className={`admin-nav-item ${activeSection === sec.key ? 'active' : ''}`}
              onClick={() => handleNavClick(sec.key)}
              style={sec.highlight ? { color: 'var(--accent)', fontWeight: 700, borderLeft: '2px solid var(--accent)' } : {}}
            >
              <sec.icon />
              {sec.label}
              {sec.key === 'messages' && unreadCount > 0 && (
                <span className="admin-nav-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        {renderSection()}
      </main>
    </div>
  )
}
