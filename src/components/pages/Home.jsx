import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import heroImg from "../../assets/images/CBSEimg.png";
import Logo2 from "../../assets/images/gyandharalogo2.png";
import '../../assets/css/home.css'

function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  // Hardcoded Content (English Only)
  const content = {
    platformBadge: "🎓 GyanDhara - Educational Platform",
    heroTitleHTML: "Objective of <span class=\"hero-title-word\">GyanDhara</span>",
    heroSubtitle: "Welcome to GyanDhara, your all-in-one educational ecosystem designed to bridge the gap between academic learning and real-world success. We believe that education is not just about passing exams; it is about acquiring the skills, confidence, and direction necessary to thrive in a rapidly evolving global landscape. Whether you are a student looking to master new technologies or a school aiming to streamline academic management, GyanDhara provides the tools you need to succeed.",
    heroImg: heroImg, // Linked to the imported image
    exploreBtn: "Explore Now",
    joinBtn: "Register Today",
    
    // For Students Section
    studentTitle: "LMS For Students 🎓",
    studentSubtitle: "Empower your future with comprehensive career guidance and learning resources",
    studentFeatures: [
      { icon: "bi-book", title: "Course Content", desc: "Access high-quality educational materials and resources", color: "blue" },
      { icon: "bi-trophy-fill", title: "Competitions", desc: "Participate in competitions and showcase your talents", color: "orange" },
      { icon: "bi-journal-check", title: "Career Guidance", desc: "Expert guidance for your academic and career journey", color: "green" },
      { icon: "bi-pencil-square", title: "Quiz & Tests", desc: "Assess your knowledge with interactive quizzes", color: "purple" },
      { icon: "bi-graph-up", title: "Grooming Classes", desc: "Develop professional and soft skills", color: "blue" },
      { icon: "bi-chat-left-quote-fill", title: "Counseling", desc: "Get personalized career counseling from experts", color: "orange" },
      { icon: "bi-bookmark-check", title: "Govt Schemes", desc: "Learn about educational schemes and benefits", color: "green" },
      { icon: "bi-briefcase-fill", title: "Job Opportunities", desc: "Discover career opportunities across various sectors", color: "blue" },
      { icon: "bi-calendar-event", title: "Seminar & Workshop", desc: "Attend training events and skill development workshops", color: "purple" },
      { icon: "bi-camera-video-fill", title: "Live Session", desc: "Join interactive live sessions with experts", color: "orange" }
    ],

    // For Schools Section
    schoolTitle: "LMS For Schools 🏫",
    schoolSubtitle: "Transform your institution's learning experience with GyanDhara's comprehensive platform",
    schoolFeatures: [
      { icon: "bi-house-check", title: "School Registration", desc: "Register your institution and get a dedicated dashboard", color: "blue" },
      { icon: "bi-people-fill", title: "Student Management", desc: "Efficiently manage student registrations and profiles", color: "orange" },
      { icon: "bi-question-circle-fill", title: "Events And Activities", desc: "Create and manage events and activities for your students", color: "green" },
      { icon: "bi-bar-chart-line-fill", title: "Performance Tracking", desc: "Monitor student progress and learning outcomes", color: "purple" }
    ],
    
    // Platform Benefits
    benefitsTitle: "Why Choose GyanDhara?",
    benefits: [
      { icon: "bi-collection-play", title: "Multi-Role Platform", desc: "Dedicated interfaces for students, schools, and administrators", color: "blue" },
      { icon: "bi-people-fill", title: "Comprehensive Services", desc: "Career guidance, academic support, and skill development", color: "orange" },
      { icon: "bi-lightbulb", title: "Career Oriented", desc: "Focus on job opportunities and professional growth", color: "green" },
      { icon: "bi-shield-check", title: "Secure & Reliable", desc: "Safe platform for educational and career information", color: "purple" },
      { icon: "bi-book-half", title: "Multiple Courses", desc: "Access a wide range of academic and skill-based courses", color: "blue" },
      { icon: "bi-chat-dots-fill", title: "24/7 Text Support", desc: "Round-the-clock text assistance for all your queries", color: "orange" },
      { icon: "bi-bar-chart-fill", title: "Data Analysis", desc: "Detailed insights and analytics for your learning journey", color: "green" },
      { icon: "bi-award-fill", title: "Rewards & Certification", desc: "Get recognized for your success with verified certificates", color: "purple" }
    ],

    // CTA
    readyTitle: "Ready to Join GyanDhara?",
    readySub: "Start your journey towards career excellence and academic success",
    getStartedBtn: "Get Started Today",
    learnMoreBtn: "Learn More",
    signInBtn: "Sign In",
    modalTitle: "Access Restricted",
    modalMessage: "Please login or register for more information and features.",
    modalLogin: "Login",
    modalRegister: "Register Today"
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
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            {/* Using imported heroImg */}
            <img src={content.heroImg} alt="Gyandhara Education" className="hero-image" />
            <div className="hero-decoration hero-logo-decoration">
              {/* Logo2 is imported, uncomment below if you want to show it */}
              {/* <img src={Logo2} alt="Gyandhara Logo" className="hero-logo" /> */}
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
                <i className="bi bi-box-arrow-in-right"></i> {content.learnMoreBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* For Students Section */}
        <section className="role-section ">
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

        {/* For Schools Section */}
        <section className="role-section-school ">
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

        {/*Why Choose GyanDhara? section*/}
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
              <i className="bi bi-rocket-fill"></i> {content.getStartedBtn}
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