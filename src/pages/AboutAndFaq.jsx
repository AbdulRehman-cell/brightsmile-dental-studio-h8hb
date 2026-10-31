import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AboutAndFaq() {
  // Public review submission form state
  const [patientName, setPatientName] = useState('')
  const [treatmentReceived, setTreatmentReceived] = useState('Check-up & Cleaning')
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    if (!patientName.trim() || !reviewText.trim()) {
      setSubmitError('Please complete all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      // Visitors can only INSERT without .select() per access rules
      const { error } = await supabase.from('patient_reviews').insert([
        {
          patient_name: patientName.trim(),
          treatment_received: treatmentReceived,
          rating: Number(rating),
          review_text: reviewText.trim(),
          is_approved: false,
          review_date: today
        }
      ])

      if (error) throw error

      setSubmitSuccess({
        ref: 'REV-' + Date.now().toString(36).toUpperCase(),
        msg: 'Thank you for sharing your feedback! Your review has been submitted for verification.'
      })
      setPatientName('')
      setReviewText('')
      setRating(5)
      setTreatmentReceived('Check-up & Cleaning')
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="about-faq-page">
      <section className="page-hero" data-kit="page-hero"><img className="hero-bg" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Waiting_Area.jpg/1920px-Waiting_Area.jpg" alt="" /><div className="container"><span className="eyebrow">12 Years of Trusted Care in DHA Phase 5</span><h1>Where Gentle Dentistry Meets Everyday Comfort</h1><p>Since 2012, BrightSmile Dental Studio has provided calm, predictable, and reassuring dental care for families across Lahore.</p></div></section>

      <section className="kit-trust kit-sec-trust kit-v-row" data-kit="trust"><div className="container"><ul className="kit-trust-list"><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></span><div><strong>12 Years Open</strong><span>Serving DHA Phase 5 since 2012</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><div><strong>4,800+ Patients</strong><span>Treated with care &amp; precision</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg></span><div><strong>6 Resident Dentists</strong><span>Specialists under one roof</span></div></li><li><span className="kit-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><div><strong>Mon–Sat: 9am–7pm</strong><span>Flexible family slots</span></div></li></ul></div></section>

      <section className="kit-section kit-sec-split kit-v-alternate" data-kit="split"><div className="container"><div className="kit-split"><figure className="kit-split-media"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Dentist_Calgary_Alberta_Canada_Beacon_Smiles_Dental.jpg" alt="Building trust, one painless visit at a time" loading="lazy" /></figure><div className="kit-split-body"><span className="eyebrow">Our DHA Phase 5 Story</span><h2>Building trust, one painless visit at a time</h2><p>BrightSmile Dental Studio was founded with a single mission: to eliminate dental anxiety through transparent consultations, gentle clinical practices, and honest advice. Located conveniently in DHA Phase 5, our clinic provides a welcoming lounge atmosphere where patients of all ages feel immediately at ease.</p><ul className="kit-checks"><li>Strict hospital-grade sterilization protocols for every instrument</li><li>Clear treatment plans with upfront PKR pricing and zero hidden fees</li><li>Patient-first approach: we explain every procedure before we begin</li><li>Comprehensive care for toddlers, teenagers, adults, and seniors</li></ul><div className="kit-actions"><Link className="btn btn-primary" to="/book">Book a consultation</Link></div></div></div><div className="kit-split kit-split-reverse"><figure className="kit-split-media"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Korolyov_Dental_Clinic.jpg/1920px-Korolyov_Dental_Clinic.jpg" alt="A calm space designed around patient comfort" loading="lazy" /></figure><div className="kit-split-body"><span className="eyebrow">Our Modern Studio</span><h2>A calm space designed around patient comfort</h2><p>We intentionally designed our reception and operatories to feel warm, bright, and relaxing. From plush waiting seating to noise-softening interiors, every detail is engineered to soften the clinical edge and make your dental visits stress-free.</p><ul className="kit-checks"><li>Air-purified, spotless treatment rooms with ergonomic dental chairs</li><li>Dedicated kids waiting area with books and comforting activities</li><li>Digital X-ray imaging for instant, low-radiation diagnostics</li></ul><div className="kit-actions"><Link className="btn btn-primary" to="/services">Explore our treatments</Link></div></div></div></div></section>

      <section className="kit-section kit-alt kit-sec-team kit-v-grid" data-kit="team"><div className="container"><div className="kit-head"><span className="eyebrow">Experienced Clinicians</span><h2>Meet our resident dental team</h2><p>Six dedicated practitioners committed to painless treatments, precise techniques, and long-term oral health.</p></div><div className="kit-team"><article className="kit-person"><div className="kit-person-photo"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Wada_Dental_Clinic-1.jpg/1920px-Wada_Dental_Clinic-1.jpg" alt="Dr. Ayesha Tariq" loading="lazy" /></div><div><h3>Dr. Ayesha Tariq</h3><p className="kit-person-role">Lead Cosmetic &amp; General Dentist</p><p>12+ years experience in DHA Lahore. Specialist in aesthetic smile design, crowns, and preventive care.</p></div></article><article className="kit-person"><div className="kit-person-photo"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Suryodaya_Dental_Clinic.jpg/1920px-Suryodaya_Dental_Clinic.jpg" alt="Dr. Usman Mahmood" loading="lazy" /></div><div><h3>Dr. Usman Mahmood</h3><p className="kit-person-role">Consultant Orthodontist</p><p>Expert in metal braces and clear aligner therapy for teenagers and adults looking for straight, healthy alignment.</p></div></article><article className="kit-person"><div className="kit-person-photo"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/A_dental_clinic_at_Ikoma.JPG/1920px-A_dental_clinic_at_Ikoma.JPG" alt="Dr. Fatima Zainab" loading="lazy" /></div><div><h3>Dr. Fatima Zainab</h3><p className="kit-person-role">Pediatric Dental Specialist</p><p>Passionate about creating safe, happy dental habits for children from their very first tooth.</p></div></article></div></div></section>

      <section className="kit-section kit-sec-gallery kit-v-grid" data-kit="gallery"><div className="container"><div className="kit-head"><span className="eyebrow">Inside BrightSmile Studio</span><h2>Take a virtual tour of our clinic</h2><p>Cleanliness, modern equipment, and modern comfort across our DHA Phase 5 practice.</p></div><div className="kit-gallery"><figure><img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Dentist_Calgary_Alberta_Canada_Beacon_Smiles_Dental.jpg" alt="Modern dental operatory equipped for painless procedures" loading="lazy" /><figcaption>Modern dental operatory equipped for painless procedures</figcaption></figure><figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Waiting_Area.jpg/1920px-Waiting_Area.jpg" alt="Comfortable waiting lounge with warm lighting and plants" loading="lazy" /><figcaption>Comfortable waiting lounge with warm lighting and plants</figcaption></figure><figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Korolyov_Dental_Clinic.jpg/1920px-Korolyov_Dental_Clinic.jpg" alt="Sterile treatment bay prepared for family consultations" loading="lazy" /><figcaption>Sterile treatment bay prepared for family consultations</figcaption></figure><figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Wada_Dental_Clinic-1.jpg/1920px-Wada_Dental_Clinic-1.jpg" alt="Dr. Ayesha reviewing digital imaging during a patient visit" loading="lazy" /><figcaption>Dr. Ayesha reviewing digital imaging during a patient visit</figcaption></figure></div></div></section>

      {/* PUBLIC REVIEW SUBMISSION FORM (handcrafted per Database Content rule) */}
      <section className="kit-section kit-sec-contact">
        <div className="container">
          <div className="kit-contact">
            <div>
              <span className="eyebrow">Patient Experience</span>
              <h2>Visited BrightSmile Recently?</h2>
              <p>We value honest feedback from our DHA Phase 5 community. Share your experience to help us continuously improve our patient care.</p>
            </div>

            <form className="kit-form" onSubmit={handleSubmitReview}>
              {submitError && (
                <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="alert alert-success" role="alert" style={{ marginBottom: '1rem' }}>
                  <strong>Review Received (Ref: {submitSuccess.ref})</strong>
                  <p>{submitSuccess.msg}</p>
                </div>
              )}

              <div className="kit-form-row">
                <div className="kit-field">
                  <label htmlFor="rev-name">Your Full Name *</label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Ahmed"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="kit-field">
                  <label htmlFor="rev-treatment">Treatment Received *</label>
                  <select
                    id="rev-treatment"
                    value={treatmentReceived}
                    onChange={(e) => setTreatmentReceived(e.target.value)}
                  >
                    <option value="Check-up & Cleaning">Check-up & Cleaning</option>
                    <option value="Teeth Whitening">Teeth Whitening</option>
                    <option value="Braces & Clear Aligners">Braces & Clear Aligners</option>
                    <option value="Root Canal Treatment">Root Canal Treatment</option>
                    <option value="Dental Implants">Dental Implants</option>
                    <option value="Kids' Dentistry">Kids' Dentistry</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>
              </div>

              <div className="kit-form-row">
                <div className="kit-field">
                  <label htmlFor="rev-rating">Star Rating *</label>
                  <select
                    id="rev-rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="5">5 Stars — Excellent Experience</option>
                    <option value="4">4 Stars — Good Experience</option>
                    <option value="3">3 Stars — Satisfactory</option>
                    <option value="2">2 Stars — Needs Improvement</option>
                    <option value="1">1 Star — Unsatisfactory</option>
                  </select>
                </div>
              </div>

              <div className="kit-field">
                <label htmlFor="rev-text">Your Review & Comments *</label>
                <textarea
                  id="rev-text"
                  rows={4}
                  required
                  placeholder="Describe your visit, dentist interaction, and how your procedure felt..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting Review...' : 'Submit Patient Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="kit-section kit-alt kit-sec-faq kit-v-columns" data-kit="faq"><div className="container"><div className="kit-head"><span className="eyebrow">Clear Answers</span><h2>Frequently Asked Questions</h2><p>Everything you need to know about insurance, first-time appointments, and pricing.</p></div><div className="kit-faq-cols"><div className="kit-faq-item"><h3>How does insurance work at BrightSmile Dental Studio?</h3><p>We issue itemized official clinic receipts and diagnostic notes after your visit. Patients present these receipts to major insurance providers across Pakistan for reimbursement according to their specific corporate or private policy coverage.</p></div><div className="kit-faq-item"><h3>What should I expect during my first visit?</h3><p>Your initial appointment includes a full visual oral examination, digital X-rays if required, an intraoral review, and a clear treatment discussion. We outline any required steps and exact prices before starting any work.</p></div><div className="kit-faq-item"><h3>Are treatment prices fixed or subject to added taxes?</h3><p>Our baseline prices (e.g. Check-ups from PKR 2,500, Whitening at PKR 18,000) are fully transparent. If an advanced procedure requires custom materials, your dentist will provide a total written cost before treatment begins.</p></div><div className="kit-faq-item"><h3>How can I book an urgent or same-day appointment?</h3><p>For acute pain or emergency cases, please call or WhatsApp our receptionist directly at +92 321 555 0147 so we can fit you into our daily reserve slots.</p></div><div className="kit-faq-item"><h3>Where is the clinic located in DHA Phase 5?</h3><p>We are situated in Main Commercial Plaza, DHA Phase 5, Lahore, with convenient street-level parking right in front of the studio.</p></div><div className="kit-faq-item"><h3>What payment methods do you accept at the counter?</h3><p>We accept cash, local debit/credit cards, and direct online bank transfers at our front desk upon completion of your visit.</p></div></div></div></section>

      <section className="kit-section kit-sec-cta kit-v-panel" data-kit="cta"><div className="container"><div className="kit-cta-panel"><div><h2>Ready for your next dental visit?</h2><p>Join over 4,800 DHA families who trust BrightSmile. Request your preferred appointment time online in under one minute.</p></div><div className="kit-actions"><Link className="btn btn-primary" to="/book">Book Appointment</Link><Link className="btn btn-secondary" to="/services">Explore Services &amp; Prices</Link></div></div></div></section>
    </div>
  )
}