import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Spinner, Alert, Badge } from '../components/ui'

export default function Home() {
  const navigate = useNavigate()
  
  // Dynamic Services data state
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [servicesError, setServicesError] = useState(null)

  // Booking widget form state (Home hero inline search/book action)
  const [heroService, setHeroService] = useState('Check-ups & Cleaning')
  const [heroDay, setHeroDay] = useState('')

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoadingServices(true)
        setServicesError(null)
        const { data, error } = await supabase
          .from('clinic_services')
          .select('*')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: true })

        if (error) throw error
        setServices(data || [])
      } catch (err) {
        setServicesError(err.message || 'Failed to load services.')
      } finally {
        setLoadingServices(false)
      }
    }

    fetchServices()
  }, [])

  const handleHeroBookingSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroService) params.set('service', heroService)
    if (heroDay) params.set('date', heroDay)
    navigate(`/book?${params.toString()}`)
  }

  return (
    <div className="home-page">
      {/* 1. LANDING HERO */}
      <section className="hero hero-photo kit-hero-centered" data-kit="hero"><img className="hero-bg" src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Dentist_Calgary_Alberta_Canada_Beacon_Smiles_Dental.jpg" alt="Gentle, Modern Dental Care for Every Member of Your Family" /><div className="hero-inner"><div className="hero-copy"><span className="hero-eyebrow">DHA Phase 5, Lahore</span><h1><span className="accent">Gentle, Modern Dental Care</span> for Every Member of Your Family</h1><p className="hero-lead">Twelve years in DHA Phase 5, one goal — a calm, comfortable clinic experience and a healthy smile you are proud to show.</p><div className="hero-actions"><Link className="btn btn-primary" to="/book">Request Appointment</Link><Link className="btn btn-secondary" to="/services">View Services &amp; Pricing</Link></div></div><div className="hero-stats"><div className="hero-stat"><span className="hero-stat-value">12 Yrs</span><span className="hero-stat-label">Open in DHA Phase 5</span></div><div className="hero-stat"><span className="hero-stat-value">4,800+</span><span className="hero-stat-label">Patients Treated</span></div><div className="hero-stat"><span className="hero-stat-value">6</span><span className="hero-stat-label">Dentists on Staff</span></div><div className="hero-stat"><span className="hero-stat-value">Mon–Sat</span><span className="hero-stat-label">9:00 AM – 7:00 PM</span></div></div></div></section>

      {/* QUICK INLINE APPOINTMENT FILTER / WIDGET */}
      <section className="kit-section appointment-bar-section">
        <div className="container">
          <div className="appointment-bar-card">
            <div className="appointment-bar-intro">
              <span className="eyebrow">Quick Booking</span>
              <h3>Book Your Visit in 60 Seconds</h3>
              <p>Select your preferred service and day to check availability instantly.</p>
            </div>
            <form className="appointment-bar-form" onSubmit={handleHeroBookingSubmit}>
              <div className="kit-field">
                <label htmlFor="hero-service-select">Treatment Needed</label>
                <select
                  id="hero-service-select"
                  value={heroService}
                  onChange={(e) => setHeroService(e.target.value)}
                >
                  <option value="Check-ups & Cleaning">Check-ups & Cleaning (PKR 2,500)</option>
                  <option value="Teeth Whitening">Teeth Whitening (PKR 18,000)</option>
                  <option value="Braces & Clear Aligners">Braces & Aligners (From PKR 250,000)</option>
                  <option value="Root Canal Treatment">Root Canal Treatment</option>
                  <option value="Dental Implants">Dental Implants</option>
                  <option value="Kids Dentistry">Kids' Dentistry</option>
                </select>
              </div>
              <div className="kit-field">
                <label htmlFor="hero-date-picker">Preferred Day</label>
                <input
                  id="hero-date-picker"
                  type="date"
                  value={heroDay}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setHeroDay(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Check Availability & Book
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS / ACCREDITATIONS (RECIPE STEP 1) */}
      <section className="kit-trust kit-sec-trust kit-v-row" data-kit="trust"><div className="container"><ul className="kit-trust-list"><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg></span><div><strong>12 Years Open</strong><span>Serving DHA Phase 5 with continuous family-first dental care since 2012.</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><div><strong>4,800+ Patients</strong><span>Trusted by thousands of children, adults, and seniors across Lahore.</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg></span><div><strong>6 Specialist Dentists</strong><span>Dedicated team of orthopedists, endodontists, and pediatric care specialists.</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><div><strong>Mon–Sat: 9am–7pm</strong><span>Flexible morning and evening appointments built around your schedule.</span></div></li></ul></div></section>

      {/* 3. DYNAMIC SERVICES GRID (RECIPE STEP 2 - DATABASE DRIVEN) */}
      <section className="kit-section kit-sec-cards kit-v-grid">
        <div className="container">
          <div className="kit-head">
            <span className="eyebrow">Complete Dental Care</span>
            <h2>Everything Your Smile Needs, Under One Roof</h2>
            <p>From preventative routine check-ups to advanced orthodontics and implants, all delivered with gentle precision.</p>
          </div>

          {loadingServices ? (
            <div className="loading-container" style={{ padding: '3rem', textAlign: 'center' }}>
              <Spinner size="lg" />
              <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Loading clinic services...</p>
            </div>
          ) : servicesError ? (
            <Alert variant="error" title="Unable to load services">
              {servicesError}
            </Alert>
          ) : services.length === 0 ? (
            <div className="empty-state-box" style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
              <h3>Our Service Catalog is Being Updated</h3>
              <p>Please call us at +92 321 555 0147 or book a consultation directly.</p>
              <Link to="/book" className="btn btn-primary" style={{ marginTop: '1rem' }}>Book Consultation</Link>
            </div>
          ) : (
            <div className="kit-cards">
              {services.map((service) => (
                <article className="kit-card" key={service.id}>
                  <div className="kit-card-body">
                    <p className="kit-card-meta">
                      <span>{service.category || 'General Dentistry'}</span>
                      {service.is_featured && <Badge variant="primary">Popular</Badge>}
                    </p>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                    <div className="kit-card-foot">
                      <span className="kit-price">
                        {service.price_label ? service.price_label : service.starting_price_pkr ? `PKR ${Number(service.starting_price_pkr).toLocaleString()}` : 'Custom plan'}
                      </span>
                      <Link className="btn btn-secondary" to={`/book?service=${encodeURIComponent(service.title)}`}>
                        Book This Service
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-ghost">
              View All Services & Transparent Pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STEPS: YOUR FIRST VISIT (RECIPE STEP 3) */}
      <section className="kit-section kit-sec-steps kit-v-cards" data-kit="steps"><div className="container"><div className="kit-head"><span className="eyebrow">Smooth &amp; Stress-Free</span><h2>What to Expect During Your First Visit</h2><p>We have redesigned the dental experience so you never feel rushed, confused, or uncomfortable.</p></div><ol className="kit-steps"><li className="kit-step"><span className="kit-step-num">01</span><h3>Reserve Your Day</h3><p>Choose a time slot online or over WhatsApp. We will call or message to confirm your appointment without spam.</p></li><li className="kit-step"><span className="kit-step-num">02</span><h3>Thorough &amp; Gentle Exam</h3><p>Meet your dedicated dentist, discuss your medical history, and receive a quiet visual exam with digital X-rays if needed.</p></li><li className="kit-step"><span className="kit-step-num">03</span><h3>Clear Explanation &amp; Plan</h3><p>We explain every option with simple diagrams and transparent costs before any procedure begins. No unexpected charges.</p></li><li className="kit-step"><span className="kit-step-num">04</span><h3>Gentle Care &amp; Follow-Up</h3><p>Relax in our modern clinic chair while we work gently. Walk away with clear aftercare instructions and a brighter smile.</p></li></ol></div></section>

      {/* 5. SPLIT: WHY BRIGHTSMILE & TEAM (RECIPE STEP 4) */}
      <section className="kit-section kit-alt kit-sec-split kit-v-alternate" data-kit="split"><div className="container"><div className="kit-split"><figure className="kit-split-media"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Korolyov_Dental_Clinic.jpg/1920px-Korolyov_Dental_Clinic.jpg" alt="Six Dentists. One Shared Philosophy: Explain Everything, Rush Nothing." loading="lazy" /></figure><div className="kit-split-body"><span className="eyebrow">Our Practice Philosophy</span><h2>Six Dentists. One Shared Philosophy: Explain Everything, Rush Nothing.</h2><p>We started BrightSmile Dental Studio in DHA Phase 5 to create a clinic where patients feel genuinely heard. Dental anxiety is real, which is why we spend time answering every question before touching a single instrument.</p><ul className="kit-checks"><li>100% Sterilized equipment adhering to international hygiene standards</li><li>Dedicated kids waiting nook and gentle pediatric dentists</li><li>Modern digital imaging for lower exposure and faster diagnosis</li><li>Transparent written price estimates prior to starting any procedure</li></ul><div className="kit-actions"><Link className="btn btn-primary" to="/about-faq">Meet the Team &amp; Facility</Link></div></div></div><div className="kit-split kit-split-reverse"><figure className="kit-split-media"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Waiting_Area.jpg/1920px-Waiting_Area.jpg" alt="A Dental Clinic That Feels Nothing Like a Traditional Clinic" loading="lazy" /></figure><div className="kit-split-body"><span className="eyebrow">Calm Atmosphere</span><h2>A Dental Clinic That Feels Nothing Like a Traditional Clinic</h2><p>From our soft lighting and comfortable waiting area to quiet low-vibration treatment rooms, every inch of our DHA studio is designed to lower your stress levels.</p><ul className="kit-checks"><li>Free high-speed Wi-Fi and quiet lounge seating</li><li>Warm tea and water station in reception</li><li>Punctual timing — we respect your schedule</li></ul><div className="kit-actions"><Link className="btn btn-primary" to="/about-faq">View Photo Gallery</Link></div></div></div></div></section>

      {/* 6. WHATSAPP QUICK BOOKING BANNER */}
      <section className="kit-section whatsapp-banner-section">
        <div className="container">
          <div className="whatsapp-box card-elevated" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-2)', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="eyebrow" style={{ color: 'var(--primary-ink)' }}>Instant Response</span>
              <h3 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Prefer Booking via WhatsApp?</h3>
              <p style={{ margin: 0, color: 'var(--muted)' }}>
                Message our reception team directly at <strong>+92 321 555 0147</strong> for rapid booking, price checks, or emergency dental guidance.
              </p>
            </div>
            <a
              href="https://wa.me/923215550147?text=Hello%20BrightSmile%20Dental%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20an%20appointment."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 7. PATIENT REVIEWS (RECIPE STEP 5) */}
      <section className="kit-section kit-sec-quotes kit-v-cards" data-kit="quotes"><div className="container"><div className="kit-head"><span className="eyebrow">Real Experiences</span><h2>What Our DHA Phase 5 Neighbors Say</h2><p>Here is why families return to BrightSmile Dental Studio year after year.</p></div><div className="kit-quotes"><figure className="kit-quote"><div className="kit-stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>I used to put off root canals for years out of fear. Dr. Usman made the whole procedure completely painless. I couldn't believe it was over so fast.</blockquote><figcaption><span className="kit-avatar">TM</span><span><strong>Tariq Mahmood</strong><small>DHA Phase 5 Resident</small></span></figcaption></figure><figure className="kit-quote"><div className="kit-stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>Brought my 6-year-old daughter for her first teeth cleaning. The staff was so patient and sweet with her. She actually looks forward to going to the dentist now!</blockquote><figcaption><span className="kit-avatar">AM</span><span><strong>Ayesha Malik</strong><small>Mother of two</small></span></figcaption></figure><figure className="kit-quote"><div className="kit-stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>The clinic is spotless and modern. Got my clear aligners done here and the results exceeded my expectations. Transparent pricing with no hidden charges.</blockquote><figcaption><span className="kit-avatar">BC</span><span><strong>Bilal Chaudhry</strong><small>Clear Aligners Patient</small></span></figcaption></figure></div></div></section>

      {/* 8. FAQ SNIPPET (RECIPE STEP 6) */}
      <section className="kit-section kit-alt kit-sec-faq kit-v-split" data-kit="faq"><div className="container"><div className="kit-faq-split"><div className="kit-faq-side"><div className="kit-head"><span className="eyebrow">Clear Answers</span><h2>Frequently Asked Questions</h2><p>Have questions before booking your visit? Here are answers to the most common queries.</p></div><div className="kit-actions"><Link className="btn btn-secondary" to="/about-faq">Read All FAQs &amp; Contact Info</Link></div></div><div className="kit-faq"><details><summary>How much does a initial consultation &amp; cleaning cost?</summary><p>A routine check-up and scaling/cleaning starts at PKR 2,500. We always provide a complete cost estimate before performing any additional treatment.</p></details><details><summary>Where is BrightSmile Dental Studio located?</summary><p>We are centrally located in DHA Phase 5, Lahore. We have ample parking and easy access from main boulevard routes.</p></details><details><summary>What should I bring to my first appointment?</summary><p>Just bring your CNIC or photo ID and any previous dental records or X-rays if you have them. Arrive 10 minutes early to fill out a brief health profile.</p></details><details><summary>Do you offer emergency dental appointments?</summary><p>Yes! If you are experiencing severe tooth pain, a chipped tooth, or trauma, call or WhatsApp us immediately and we will accommodate you on the same day.</p></details></div></div></div></section>

      {/* 9. FINAL CALL TO ACTION (RECIPE STEP 7) */}
      <section className="kit-section kit-sec-cta kit-v-panel" data-kit="cta"><div className="container"><div className="kit-cta-panel"><div><h2>Your Smile Has Waited Long Enough</h2><p>Join over 4,800 patients who trust BrightSmile Dental Studio in DHA Phase 5. Book your consultation online in seconds or chat with us directly.</p></div><div className="kit-actions"><Link className="btn btn-primary" to="/book">Request Appointment</Link><a className="btn btn-secondary" href="tel:+923215550147">Call Us: 0321 5550147</a></div></div></div></section>
    </div>
  )
}