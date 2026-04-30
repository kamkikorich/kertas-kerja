import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, FolderOpen, Printer, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="https://i.postimg.cc/15xdZ3RK/perkeso-logo.jpg" alt="PERKESO" />
          <span>PERKESO<br />Kertas Cadangan</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>

          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/new" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            <FilePlus size={18} /> Cadangan Baharu
          </NavLink>

          <NavLink to="/list" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            <FolderOpen size={18} /> Semua Cadangan
          </NavLink>
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
            PERKESO Keningau<br />Sistem Kertas Cadangan v2.0
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-ghost btn-icon"
              style={{ display: 'none' }}
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(s => !s)}
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="topbar-title">{title}</div>
              {subtitle && <div className="topbar-sub">{subtitle}</div>}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            <Printer size={15} /> Cetak
          </button>
        </header>

        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
}
