import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ServicesAndPricing from './pages/ServicesAndPricing.jsx'
import BookAppointment from './pages/BookAppointment.jsx'
import AboutAndFaq from './pages/AboutAndFaq.jsx'
import ClinicDashboard from './pages/ClinicDashboard.jsx'
import Login from './pages/Login.jsx'

const BRAND = "BrightSmile Dental Studio"
const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services & Prices" },
  { to: "/book", label: "Book Appointment" },
  { to: "/about-faq", label: "About & FAQ" },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <section className="section not-found">
      <div className="container section-head">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </section>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app-shell">
      <ScrollToTop />
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-brand" aria-label={`${BRAND} home`}>
          <span className="brand-mark" aria-hidden="true">B</span><span className="brand-text"><span className="brand-name">BrightSmile Dental Studio</span><span className="brand-tag">Family dental clinic</span></span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/book" className="nav-cta">Book Appointment</Link>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesAndPricing />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/about-faq" element={<AboutAndFaq />} />
          <Route path="/admin/dashboard" element={<ClinicDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo"><span className="brand-mark" aria-hidden="true">B</span><span className="brand-text"><span className="brand-name">BrightSmile Dental Studio</span><span className="brand-tag">Family dental clinic</span></span></Link>
            <p className="footer-desc">Gentle, modern dental care for your whole family in DHA Phase 5, Lahore</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-col-links">
              {NAV.map((item) => <li key={item.to}><Link to={item.to}>{item.label}</Link></li>)}
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Staff</h4>
            <ul className="footer-col-links">
              <li><Link to="/admin/dashboard">Clinic Inbox</Link></li>
              <li><Link to="/login">Staff sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
