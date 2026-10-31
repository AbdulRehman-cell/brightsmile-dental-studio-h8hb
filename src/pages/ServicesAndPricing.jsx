import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Badge, Button, Input, Select, Spinner, Alert, EmptyState } from '../components/ui'

const FALLBACK_SERVICES = [
  {
    id: 'f1',
    title: 'Check-ups & Cleaning',
    slug: 'checkups-cleaning',
    summary: 'Twice-a-year visits that quietly save you from big problems later.',
    detailed_description: 'Comprehensive oral examination, digital X-rays where needed, ultrasonic scaling for plaque and tartar removal, and professional polishing. Includes a full consultation on personalized oral hygiene routines.',
    starting_price_pkr: 2500,
    price_label: 'PKR 2,500',
    category: 'Preventative Care',
    icon_name: 'stethoscope',
    is_featured: true
  },
  {
    id: 'f2',
    title: 'Teeth Whitening',
    slug: 'teeth-whitening',
    summary: 'A brighter smile in one sitting, done safely under professional supervision.',
    detailed_description: 'In-clinic laser whitening using premium enamel-safe gels. Removes years of deep staining from tea, coffee, and food in under 60 minutes. Includes custom home maintenance tray guidance.',
    starting_price_pkr: 18000,
    price_label: 'PKR 18,000',
    category: 'Cosmetic Dentistry',
    icon_name: 'sparkles',
    is_featured: true
  },
  {
    id: 'f3',
    title: 'Braces & Clear Aligners',
    slug: 'braces-aligners',
    summary: 'Straighter teeth, your way — metal braces or near-invisible aligners.',
    detailed_description: 'Custom orthodontic solutions designed with 3D digital smile mapping. Choose between modern low-profile metal/ceramic braces or comfortable custom clear aligners with monthly monitoring.',
    starting_price_pkr: 250000,
    price_label: 'From PKR 250,000',
    category: 'Orthodontics',
    icon_name: 'smile',
    is_featured: true
  },
  {
    id: 'f4',
    title: 'Root Canal Treatment',
    slug: 'root-canal',
    summary: 'Pain relief and tooth-saving treatment, done comfortably in experienced hands.',
    detailed_description: 'Painless single or double-session endodontic procedure using digital apex locators and flexible rotary files. Preserves your natural tooth structure and restores full chewing function.',
    starting_price_pkr: 15000,
    price_label: 'From PKR 15,000',
    category: 'Restorative Care',
    icon_name: 'activity',
    is_featured: false
  },
  {
    id: 'f5',
    title: 'Dental Implants',
    slug: 'dental-implants',
    summary: 'A permanent, natural-looking replacement for missing teeth.',
    detailed_description: 'Surgically anchored titanium posts that fuse with jawbone tissue, topped with precision-crafted ceramic crowns. Feels, looks, and functions like a natural tooth for a lifetime.',
    starting_price_pkr: 95000,
    price_label: 'From PKR 95,000',
    category: 'Restorative Care',
    icon_name: 'shield-check',
    is_featured: true
  },
  {
    id: 'f6',
    title: 'Kids Dentistry',
    slug: 'kids-dentistry',
    summary: 'Gentle, patient, and a little bit fun — because their first visits shape lifetime habits.',
    detailed_description: 'Specialized pediatric care including cavity prevention, dental sealants, fluoride treatments, and gentle extractions in a friendly, stress-free setting.',
    starting_price_pkr: 3000,
    price_label: 'PKR 3,000',
    category: 'Pediatric Dentistry',
    icon_name: 'baby',
    is_featured: true
  }
]

export default function ServicesAndPricing() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const initialCategory = searchParams.get('category') || 'All'
  const initialSearch = searchParams.get('q') || ''

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        setError(null)
        const { data, error: dbError } = await supabase
          .from('clinic_services')
          .select('*')
          .order('created_at', { ascending: true })

        if (dbError) {
          throw dbError
        }

        if (data && data.length > 0) {
          setServices(data)
        } else {
          setServices(FALLBACK_SERVICES)
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to static services:', err.message)
        setServices(FALLBACK_SERVICES)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const categories = ['All', ...new Set(services.map((s) => s.category))]

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleBookClick = (serviceTitle) => {
    navigate(`/book?service=${encodeURIComponent(serviceTitle)}`)
  }

  return (
    <div className="services-pricing-page">
      <section className="page-hero" data-kit="page-hero"><img className="hero-bg" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/A_dental_clinic_at_Ikoma.JPG/1920px-A_dental_clinic_at_Ikoma.JPG" alt="" /><div className="container"><span className="eyebrow">BrightSmile Services &amp; Transparent Pricing</span><h1>Dental Care, Explained Simply — Priced Honestly</h1><p>Six core services. No confusing jargon — just honest explanations, gentle treatment in DHA Phase 5, and clear pricing.</p></div></section>

      <section className="section services-filter-bar">
        <div className="container">
          <div className="filter-controls" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ flex: '1 1 250px' }}>
              <Input
                placeholder="Search treatment by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ minWidth: '200px' }}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {loading && (
            <div className="loading-center" style={{ padding: '3rem 0', textAlign: 'center' }}>
              <Spinner size="lg" />
              <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Loading treatment menu...</p>
            </div>
          )}

          {error && (
            <Alert variant="error" title="Could not load live treatments">
              {error}
            </Alert>
          )}

          {!loading && filteredServices.length === 0 && (
            <EmptyState
              icon="stethoscope"
              title="No treatments match your search"
              description="Try adjusting your keyword filter or select 'All Categories'."
              action={
                <Button variant="secondary" onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}>
                  Reset Filters
                </Button>
              }
            />
          )}

          {!loading && filteredServices.length > 0 && (
            <div className="kit-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredServices.map((service) => (
                <article className="kit-card card-elevated" key={service.id} id={service.slug} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="kit-card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <Badge variant="primary">{service.category}</Badge>
                      {service.is_featured && <Badge variant="success">Most Requested</Badge>}
                    </div>

                    <h3 style={{ margin: '0.5rem 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text)' }}>
                      {service.title}
                    </h3>

                    <p style={{ color: 'var(--muted)', fontSize: '0.925rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                      {service.summary}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {service.detailed_description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', fontWeight: 600 }}>Starting from</span>
                          <span className="kit-price" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {service.price_label || (service.starting_price_pkr ? `PKR ${Number(service.starting_price_pkr).toLocaleString()}` : 'Consultation required')}
                          </span>
                        </div>

                        <Button variant="primary" onClick={() => handleBookClick(service.title)}>
                          Book Service
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="kit-section kit-sec-pricing kit-v-list" data-kit="pricing"><div className="container"><div className="kit-head"><span className="eyebrow">Transparent Standard Fee Schedule</span><h2>At a Glance: Our Most-Asked-About Prices</h2><p>No hidden charges, surprise add-ons, or unclear bills. Every treatment cost is discussed thoroughly before your procedure begins.</p></div><ul className="kit-pricelist"><li><div className="kit-pricelist-row"><h3>Routine Consultation &amp; Digital X-Ray</h3><span className="kit-pricelist-dots" aria-hidden="true"></span><span className="kit-price">PKR 2,500<small>/ session</small></span></div><p>Comprehensive full-mouth evaluation, oral cancer screening, and oral hygiene assessment.</p></li><li><div className="kit-pricelist-row"><h3>Professional Teeth Scaling &amp; Polishing</h3><span className="kit-pricelist-dots" aria-hidden="true"></span><span className="kit-price">PKR 5,000<small>/ complete visit</small></span></div><p>Ultrasonic tartar removal and stain polishing for fresh breath and healthy gums.</p></li><li><div className="kit-pricelist-row"><h3>In-Office Laser Teeth Whitening</h3><span className="kit-pricelist-dots" aria-hidden="true"></span><span className="kit-price">PKR 18,000<small>/ 60 min session</small></span></div><p>Safe, medical-grade tooth shade lightening under dentist supervision.</p></li><li><div className="kit-pricelist-row"><h3>Single-Root Canal Procedure</h3><span className="kit-pricelist-dots" aria-hidden="true"></span><span className="kit-price">PKR 15,000<small>/ tooth starting</small></span></div><p>Painless pulp clearance and apex sealing to save a damaged natural tooth.</p></li><li><div className="kit-pricelist-row"><h3>Premium Titanium Dental Implant</h3><span className="kit-pricelist-dots" aria-hidden="true"></span><span className="kit-price">PKR 95,000<small>/ implant starting</small></span></div><p>Lifetime replacement fixture crafted from surgical-grade titanium.</p></li><li><div className="kit-pricelist-row"><h3>Clear Aligner Orthodontic Package</h3><span className="kit-pricelist-dots" aria-hidden="true"></span><span className="kit-price">PKR 250,000<small>/ total treatment</small></span></div><p>Invisible alignment sequence with custom tray progression.</p></li></ul></div></section>

      <section className="kit-trust kit-sec-trust kit-v-badges" data-kit="trust"><div className="container"><ul className="kit-trust-list"><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg></span><strong>Transparent Billing</strong></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></span><strong>Payment Flexibility</strong></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg></span><strong>Corporate &amp; Insurance</strong></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></span><strong>12-Year Track Record</strong></li></ul></div></section>

      <section className="kit-section kit-sec-faq kit-v-accordion" data-kit="faq"><div className="container"><div className="kit-head"><span className="eyebrow">Insurance &amp; Costs</span><h2>Frequently Asked Questions About Pricing</h2><p>Everything you need to know about payment methods, health insurance processing, and appointment costs.</p></div><div className="kit-faq"><details><summary>Do you accept health insurance?</summary><p>We provide itemized official tax invoices and clinical diagnostic breakdowns accepted by major private health insurers and corporate benefit schemes across Pakistan. Payment is made at the clinic after treatment.</p></details><details><summary>Can I pay for major treatments in installments?</summary><p>Yes. For high-value procedures like Braces, Clear Aligners, and Dental Implants, we offer structured payment plans split across your appointment schedule without interest.</p></details><details><summary>What payment methods do you accept at the counter?</summary><p>We accept cash, all major debit/credit cards (Visa, MasterCard), and direct bank transfers at our DHA Phase 5 clinic counter.</p></details><details><summary>Is the first visit consultation free?</summary><p>Our initial consultation is PKR 2,500, which includes a full diagnostic examination and treatment plan consultation. If you proceed with a major procedure on the same day, this fee is applied toward your balance.</p></details></div></div></section>

      <section className="kit-section kit-sec-cta kit-v-panel" data-kit="cta"><div className="container"><div className="kit-cta-panel"><div><h2>Not Sure Which Treatment You Need?</h2><p>Message our team directly on WhatsApp or book a brief check-up visit. We'll evaluate your smile and give clear options without pressure.</p></div><div className="kit-actions"><Link className="btn btn-primary" to="/book">Request Appointment</Link><a className="btn btn-secondary" href="https://wa.me/923215550147" target="_blank" rel="noopener">Ask on WhatsApp</a></div></div></div></section>
    </div>
  )
}