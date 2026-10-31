import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BookAppointment() {
  const [searchParams] = useSearchParams()
  const initialService = searchParams.get('service') || 'Check-up & Cleaning'
  const initialDate = searchParams.get('date') || ''

  const [formData, setFormData] = useState({
    patient_name: '',
    phone_number: '',
    email: '',
    preferred_service: initialService,
    preferred_date: initialDate,
    preferred_time_slot: 'Morning (09:00 - 12:00)',
    preferred_dentist: 'Any Available Specialist',
    notes: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [confirmation, setConfirmation] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    if (!formData.patient_name || !formData.phone_number || !formData.preferred_service || !formData.preferred_date || !formData.preferred_time_slot) {
      setErrorMsg('Please complete all required fields (*).')
      setSubmitting(false)
      return
    }

    try {
      // Insert into appointment_requests according to the data contract (no .select() for public users)
      const { error } = await supabase.from('appointment_requests').insert([
        {
          patient_name: formData.patient_name.trim(),
          phone_number: formData.phone_number.trim(),
          email: formData.email.trim() || null,
          preferred_service: formData.preferred_service,
          preferred_date: formData.preferred_date,
          preferred_time_slot: formData.preferred_time_slot,
          preferred_dentist: formData.preferred_dentist,
          notes: formData.notes.trim() || null,
          status: 'new'
        }
      ])

      if (error) {
        throw error
      }

      // Generate instant reference number for reassurance
      const refNumber = 'BSD-' + Math.floor(100000 + Math.random() * 900000)

      setConfirmation({
        ref: refNumber,
        name: formData.patient_name,
        service: formData.preferred_service,
        date: formData.preferred_date,
        time: formData.preferred_time_slot
      })

      // Reset form
      setFormData({
        patient_name: '',
        phone_number: '',
        email: '',
        preferred_service: 'Check-up & Cleaning',
        preferred_date: '',
        preferred_time_slot: 'Morning (09:00 - 12:00)',
        preferred_dentist: 'Any Available Specialist',
        notes: ''
      })
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit appointment request. Please try again or reach out on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">
      <section className="page-hero" data-kit="page-hero"><img className="hero-bg" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Waiting_Area.jpg/1920px-Waiting_Area.jpg" alt="" /><div className="container"><span className="eyebrow">DHA Phase 5, Lahore</span><h1>Book Your Appointment</h1><p>Select your service and preferred time slot. Our reception team will call or WhatsApp you within 2 business hours to confirm your time.</p></div></section>

      <section className="kit-trust kit-sec-trust kit-v-row" data-kit="trust"><div className="container"><ul className="kit-trust-list"><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><div><strong>Mon – Sat 9:00 – 19:00</strong><span>Flexible morning and evening clinic hours</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg></span><div><strong>Sterilized Standard</strong><span>Autoclave sterilized equipment for every single patient</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><div><strong>6 Specialist Dentists</strong><span>Experienced doctors in general care, aligners &amp; implants</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span><div><strong>Instant Confirmation</strong><span>We call or WhatsApp to confirm your schedule promptly</span></div></li></ul></div></section>

      {/* Database Handled Form Section */}
      <section className="kit-section kit-sec-contact">
        <div className="container">
          <div className="kit-contact">
            <div>
              <span className="eyebrow">RESERVE YOUR TIME</span>
              <h2>Request Your Visit</h2>
              <p>
                Fill out the quick request form below. No online pre-payment required — all consultation fees and charges are handled transparently at our clinic desk.
              </p>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Prefer WhatsApp Quick-Booking?</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                  If you prefer direct messaging, speak to our desk co-ordinator right now for immediate confirmation.
                </p>
                <a
                  href="https://wa.me/923215550147?text=Hello%20BrightSmile%20Dental%20Studio,%20I%20would%20like%20to%20book%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Chat on WhatsApp (+92 321 555 0147)
                </a>
              </div>
            </div>

            <div>
              {confirmation ? (
                <div className="alert alert-success" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--primary-ink)', marginBottom: '0.5rem' }}>Appointment Request Sent!</h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Thank you, <strong>{confirmation.name}</strong>. We have registered your request for <strong>{confirmation.service}</strong> on <strong>{confirmation.date}</strong> ({confirmation.time}).
                  </p>
                  <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                    Reference Code: <strong>{confirmation.ref}</strong>. Our front desk staff will contact you shortly to confirm your exact appointment slot.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setConfirmation(null)}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form className="kit-form" onSubmit={handleSubmit}>
                  {errorMsg && (
                    <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <div className="kit-form-row">
                    <div className="kit-field">
                      <label htmlFor="patient_name">Full Name *</label>
                      <input
                        id="patient_name"
                        name="patient_name"
                        type="text"
                        placeholder="e.g. Fatima Ali"
                        value={formData.patient_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="kit-field">
                      <label htmlFor="phone_number">Phone Number *</label>
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        placeholder="0321 1234567"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="kit-form-row">
                    <div className="kit-field">
                      <label htmlFor="email">Email Address (Optional)</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="kit-field">
                      <label htmlFor="preferred_service">Required Treatment *</label>
                      <select
                        id="preferred_service"
                        name="preferred_service"
                        value={formData.preferred_service}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Check-up & Cleaning">Check-ups & Dental Cleaning (PKR 2,500)</option>
                        <option value="Teeth Whitening">Professional Teeth Whitening (PKR 18,000)</option>
                        <option value="Braces & Aligners">Braces & Clear Aligners (From PKR 250,000)</option>
                        <option value="Root Canal Treatment">Root Canal Treatment</option>
                        <option value="Dental Implants">Dental Implants & Restorations</option>
                        <option value="Kids Dentistry">Kids' Dentistry & Fluoride Treatments</option>
                        <option value="General Consultation">General Consultation / Pain Assessment</option>
                      </select>
                    </div>
                  </div>

                  <div className="kit-form-row">
                    <div className="kit-field">
                      <label htmlFor="preferred_date">Preferred Date *</label>
                      <input
                        id="preferred_date"
                        name="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="kit-field">
                      <label htmlFor="preferred_time_slot">Preferred Time Slot *</label>
                      <select
                        id="preferred_time_slot"
                        name="preferred_time_slot"
                        value={formData.preferred_time_slot}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                        <option value="Midday (12:00 - 15:00)">Midday (12:00 - 15:00)</option>
                        <option value="Evening (15:00 - 19:00)">Evening (15:00 - 19:00)</option>
                      </select>
                    </div>
                  </div>

                  <div className="kit-field">
                    <label htmlFor="preferred_dentist">Preferred Doctor / Specialist</label>
                    <select
                      id="preferred_dentist"
                      name="preferred_dentist"
                      value={formData.preferred_dentist}
                      onChange={handleInputChange}
                    >
                      <option value="Any Available Specialist">Any Available Specialist</option>
                      <option value="Dr. Tariq Mahmood (Implantologist)">Dr. Tariq Mahmood (Implantologist)</option>
                      <option value="Dr. Ayesha Malik (Orthodontist)">Dr. Ayesha Malik (Orthodontist)</option>
                      <option value="Dr. Zainab Ahmed (Pediatric Specialist)">Dr. Zainab Ahmed (Pediatric Specialist)</option>
                    </select>
                  </div>

                  <div className="kit-field">
                    <label htmlFor="notes">Additional Notes or Symptoms (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      placeholder="Mention any existing tooth pain, urgency, or special requests..."
                      value={formData.notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {submitting ? 'Submitting Request...' : 'Request Appointment'}
                  </button>
                  
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                    Payment is taken in person after your consultation. No online credit card needed.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="kit-section kit-sec-steps kit-v-cards" data-kit="steps"><div className="container"><div className="kit-head"><span className="eyebrow">What to expect</span><h2>How Your Booking Works</h2><p>We ensure a smooth, zero-stress experience from your first click to walking out of our clinic.</p></div><ol className="kit-steps"><li className="kit-step"><span className="kit-step-num">01</span><h3>Request Submission</h3><p>Choose your treatment and preferred time slot using the form above.</p></li><li className="kit-step"><span className="kit-step-num">02</span><h3>Quick Phone/WhatsApp Call</h3><p>Our desk team will call or WhatsApp you within 2 hours to confirm your slot.</p></li><li className="kit-step"><span className="kit-step-num">03</span><h3>Gentle Consultation</h3><p>Visit DHA Phase 5 for your examination. We explain all procedures before starting.</p></li><li className="kit-step"><span className="kit-step-num">04</span><h3>Simple In-Person Payment</h3><p>Pay at the front counter by card or cash when your treatment is completed.</p></li></ol></div></section>

      <section className="kit-section kit-alt kit-sec-faq kit-v-accordion" data-kit="faq"><div className="container"><div className="kit-head"><span className="eyebrow">Appointment FAQ</span><h2>Questions Before Booking</h2><p>Here are clear answers to common questions about appointments and visits.</p></div><div className="kit-faq"><details><summary>How far in advance should I book?</summary><p>Routine check-ups can usually be accommodated within 24 to 48 hours. For weekend appointments or specific specialist consults, booking 3–4 days ahead is recommended.</p></details><details><summary>What if I have severe tooth pain or a dental emergency?</summary><p>Please call us immediately or WhatsApp +92 321 555 0147. We reserve daily emergency slots for urgent dental pain.</p></details><details><summary>Do I need to pay online to reserve my spot?</summary><p>No online pre-payments are required. All charges are settled at our reception desk during your visit.</p></details><details><summary>Where is BrightSmile Dental Studio located?</summary><p>We are located on Main Boulevard in DHA Phase 5, Lahore, with dedicated patient parking in front of the building.</p></details></div></div></section>

      <section className="kit-section kit-sec-cta kit-v-panel" data-kit="cta"><div className="container"><div className="kit-cta-panel"><div><h2>Ready for a Healthier, Brighter Smile?</h2><p>Our team of 6 specialist dentists is here to provide gentle, comprehensive care for your whole family.</p></div><div className="kit-actions"><a className="btn btn-primary" href="https://wa.me/923215550147" target="_blank" rel="noopener">Chat on WhatsApp</a><Link className="btn btn-secondary" to="/services">View All Treatments</Link></div></div></div></section>
    </div>
  )
}