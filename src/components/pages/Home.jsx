import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
// You can replace these with relevant health/nutrition images if available
import heroImg from "../../assets/images/CBSEimg.png"; 
import Logo2 from "../../assets/images/gyandharalogo2.png";
import '../../assets/css/home.css'

function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  // Updated Content: Golden 1000 Days & Intervention Gap Analysis
  const content = {
    platformBadge: "🤰 Ministry of Health & Family Welfare",
    // Hindi Title as requested: "सुनहरे हज़ार दिनों में अवसरों एवं विभागीय हस्तक्षेप के बीच Gap"
    heroTitleHTML: "Intervention Gap Analysis in <span class=\"hero-title-word\">Golden 1000 Days</span>",
    heroSubtitle: "A comprehensive dashboard designed to bridge the gap between opportunities and departmental interventions. Track Life Stages (from conception to 2 years), identify gaps in nutritional support, health checkups, and immunization to ensure the holistic development of mother and child.",
    heroImg: heroImg, 
    exploreBtn: "View Dashboard",
    joinBtn: "Register Facility",
    
    // Section 1: Based on "Life Stage & Age" from the image table
    studentTitle: "Critical Life Stages 📊",
    studentSubtitle: "Monitoring health and nutrition status across the golden 1000 days timeline",
    studentFeatures: [
      { icon: "bi-calendar-heart", title: "1st Trimester", desc: "Early registration, ANC checkups, and nutrition supplementation", color: "blue" },
      { icon: "bi-heart-pulse", title: "2nd Trimester", desc: "Growth monitoring, anomaly scans, and dietary counseling", color: "orange" },
      { icon: "bi-activity", title: "3rd Trimester", desc: "Birth preparedness, complication readiness, and supplements", color: "green" },
      { icon: "bi-hospital", title: "Delivery & Birth", desc: "Institutional delivery tracking and immediate post-natal care", color: "purple" },
      { icon: "bi-baby", title: "Infancy (0-6 Months)", desc: "Exclusive breastfeeding support and immunization (BCG, OPV, HepB1)", color: "blue" },
      { icon: "bi-emoji-smile", title: "Early Childhood (6-24 Months)", desc: "Complementary feeding, Vitamin A, and growth monitoring", color: "orange" },
      { icon: "bi-mortarboard", title: "Pre-School (3-6 Years)", desc: "Pre-school education and health checkups at Anganwadi centers", color: "green" },
      { icon: "bi-shield-check", title: "Adolescent Girls", desc: "Weekly Iron Folic Acid (IFA) supplementation and nutrition", color: "blue" }
    ],

    // Section 2: Based on "Intervention Opportunity" from the image table
    schoolTitle: "Intervention Opportunities 🏛️",
    schoolSubtitle: "Key departmental services and schemes available for beneficiaries",
    schoolFeatures: [
      { icon: "bi-capsule", title: "Nutritional Support", desc: "Take Home Ration (THR), Hot Cooked Meals, and IFA Tablets", color: "blue" },
      { icon: "bi-clipboard2-pulse", title: "Health Checkups", desc: "Regular ANC, PNC, and child health assessments", color: "orange" },
      { icon: "bi-shield-plus", title: "Immunization", desc: "Complete vaccination schedule coverage tracking", color: "green" },
      { icon: "bi-bank", title: "Financial Incentives", desc: "PMMVy, JSY, and other direct benefit transfers", color: "purple" }
    ],
    
    // Platform Benefits: Why use this Gap Analysis System?
    benefitsTitle: "Why Use This Platform?",
    benefits: [
      { icon: "bi-graph-up-arrow", title: "Gap Identification", desc: "Pinpoint exactly where interventions are missing in the timeline", color: "blue" },
      { icon: "bi-people-fill", title: "Inter-Department Data", desc: "Integrated view of Health, ICDS, and Education dept data", color: "orange" },
      { icon: "bi-lightbulb", title: "Targeted Action", desc: "Enable focused interventions for high-risk mothers and children", color: "green" },
      { icon: "bi-pie-chart", title: "Impact Analysis", desc: "Measure the effectiveness of current schemes and policies", color: "purple" },
      { icon: "bi-geo-alt", title: "Geo-Tagging", desc: "Track beneficiaries and service delivery locations accurately", color: "blue" },
      { icon: "bi-clock-history", title: "Real-Time Alerts", desc: "Notifications for due vaccinations and checkup dates", color: "orange" },
      { icon: "bi-file-earmark-bar-graph", title: "Report Generation", desc: "Automated MIS reports for state and national levels", color: "green" },
      { icon: "bi-check-circle", title: "100% Coverage Goal", desc: "Strive for universal coverage of all mandated interventions", color: "purple" }
    ],

    // CTA
    readyTitle: "Ready to Bridge the Gap?",
    readySub: "Join the initiative to improve maternal and child health outcomes today.",
    getStartedBtn: "Start Monitoring",
    learnMoreBtn: "Read Guidelines",
    signInBtn: "Official Login",
    modalTitle: "Access Restricted",
    modalMessage: "Please login with your departmental ID to access health records.",
    modalLogin: "Login",
    modalRegister: "Register Facility"
  }

  const handleCardClick = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-image-wrapper">
            <div className="hero-decoration hero-cap-decoration">
              <i className="bi bi-heart-pulse-fill"></i>
            </div>
            {/* Using imported heroImg */}
            <img src={content.heroImg} alt="Golden 1000 Days Initiative" className="hero-image" />
            <div className="hero-decoration hero-logo-decoration">
              {/* Logo2 is imported, uncomment below if you want to show it */}
              {/* <img src={Logo2} alt="Project Logo" className="hero-logo" /> */}
            </div>
          </div>
          
          <div className="hero-content">
            <div className="hero-badge">{content.platformBadge}</div>
            <h1 dangerouslySetInnerHTML={{ __html: content.heroTitleHTML }}></h1>
            <p>{content.heroSubtitle}</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-gyandhara btn-primary-custom">
                <i className="bi bi-person-plus"></i> {content.joinBtn}
              </Link>
              <Link to="/login" className="btn-gyandhara btn-outline-custom-btn">
                <i className="bi bi-bar-chart"></i> {content.exploreBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* Life Stages Section (Mapped from Table) */}
        <section className="role-section">
          <div className="role-header">
            <h2>{content.studentTitle}</h2>
            <p>{content.studentSubtitle}</p>
          </div>
          <div className="role-features-grid">
            {content.studentFeatures.map((feature, index) => (
              <div 
                className={`role-feature-card card-${feature.color}`} 
                key={index} 
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
              >
                <div className={`role-feature-icon-wrapper icon-${feature.color}`}>
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Intervention Opportunities Section */}
        <section className="role-section-school">
          <div className="role-header">
            <h2>{content.schoolTitle}</h2>
            <p>{content.schoolSubtitle}</p>
          </div>
          <div className="role-features-grid">
            {content.schoolFeatures.map((feature, index) => (
              <div 
                className={`role-feature-card card-${feature.color}`} 
                key={index} 
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
              >
                <div className={`role-feature-icon-wrapper icon-${feature.color}`}>
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Benefits Section */}
        <section className="benefits-section role-header role-section-school ">
          <div className="role-header">
            <h2>{content.benefitsTitle}</h2>
          </div>
            <Row className="g-4">
                {content.benefits.map((benefit, index) => (
                    <Col lg={3} md={6} sm={12} key={index}>
                        <div 
                          className={`benefit-card card-${benefit.color} h-100 border-0 shadow-sm`}
                          onClick={handleCardClick}
                          style={{ cursor: 'pointer' }}
                        >
                            <div className={`benefit-icon icon-${benefit.color}`}>
                                <i className={`bi ${benefit.icon}`}></i>
                            </div>
                            <h4>{benefit.title}</h4>
                            <p>{benefit.desc}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section role-section-school">
          <h2>{content.readyTitle}</h2>
          <p>{content.readySub}</p>
          <div className="cta-buttons mt-4">
            <Link to="/register" className="btn-gyandhara btn-primary-custom btn-lg">
              <i className="bi bi-rocket-takeoff"></i> {content.getStartedBtn}
            </Link>
            <Link to="/login" className="btn-gyandhara btn-outline-custom-btn btn-lg">
              <i className="bi bi-box-arrow-in-right"></i> {content.signInBtn}
            </Link>
          </div>
        </section>
      </div>

      {/* Auth Prompt Modal */}
       <Modal show={showModal} onHide={handleClose} centered size="sm">
         <Modal.Header closeButton className="border-0 pb-0">
           <Modal.Title className="fs-5 fw-bold w-100 text-center modal-title-style">{content.modalTitle}</Modal.Title>
         </Modal.Header>
         <Modal.Body className="text-center pt-2">
           <p className="mb-4 text-muted">{content.modalMessage}</p>
           <div className="d-grid gap-2">
              <Button variant="primary" className="rounded-pill py-2" onClick={() => { handleClose(); navigate('/login'); window.scrollTo(0, 0); }}>
                <i className="bi bi-box-arrow-in-right me-2"></i> {content.modalLogin}
              </Button>
             <Button variant="outline-primary" className="rounded-pill py-2" onClick={() => { handleClose(); navigate('/register');window.scrollTo(0, 0); }}>
               <i className="bi bi-person-plus me-2"></i> {content.modalRegister}
             </Button>
           </div>
         </Modal.Body>
       </Modal>
    </div>
  )
}

export default Home