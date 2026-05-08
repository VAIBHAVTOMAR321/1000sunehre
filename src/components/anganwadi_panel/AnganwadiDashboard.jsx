import React, { useState, useEffect } from "react";
import { Container, Card, Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../all_login/AuthContext";
import "../../assets/css/anganwadileftnav.css";
import AnganwadiLeftNav from "./AnganwadiLeftNav";
import AnganwadiHeader from "./AnganwadiHeader";
import "../../assets/css/dashboard.css";

const AnganwadiDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const { user, api } = useAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    candidate_name: "",
    phone: "",
    dob: "",
    aadhar_number: "",
    aadhar_file: null,
    pregancy_num: "",
    child_name: "",
    lmp_date: "",
    pan_no: "",
    pan_file: null,
    account_number: "",
    ifsc_code: "",
    dob_child: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };



  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      // Always use FormData for proper multipart/form-data encoding
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        // For file inputs
        if (key === "aadhar_file" || key === "pan_file") {
          if (value instanceof File) {
            submitData.append(key, value);
          }
        } 
        // For regular fields, skip empty strings and null
        else if (value !== null && value !== undefined && value !== "") {
          submitData.append(key, value);
        }
      });

      console.log("📤 Submitting payload:", {
        candidate_name: formData.candidate_name,
        phone: formData.phone,
        dob: formData.dob,
        aadhar_number: formData.aadhar_number,
        aadhar_file: formData.aadhar_file?.name || "not provided",
        pregancy_num: formData.pregancy_num,
        child_name: formData.child_name,
        lmp_date: formData.lmp_date,
        pan_no: formData.pan_no,
        pan_file: formData.pan_file?.name || "not provided",
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        dob_child: formData.dob_child
      });

      const response = await api.post("/candidate-reg/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("✅ Registration successful:", response.data);
      alert("Candidate registered successfully!");
      setShowModal(false);
      setFormData({
        candidate_name: "",
        phone: "",
        dob: "",
        aadhar_number: "",
        aadhar_file: null,
        pregancy_num: "",
        child_name: "",
        lmp_date: "",
        pan_no: "",
        pan_file: null,
        account_number: "",
        ifsc_code: "",
        dob_child: ""
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.errors ||
                      err.response?.data?.error || 
                      JSON.stringify(err.response?.data) ||
                      err.message || 
                      "Failed to register candidate. Please try again.";
      setSubmitError(errorMsg);
      console.error("❌ Registration error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <AnganwadiLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <div className="main-content-dash">
        <AnganwadiHeader toggleSidebar={toggleSidebar} />
  
        <Container fluid className="dashboard-box mt-3">
          <div className="main-heading d-flex justify-content-between align-items-center">
            <h3 className="mb-4 fw-bold">
              Anganwadi Dashboard
            </h3>
             <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="bi bi-person-plus me-2"></i>
              Register Candidate
            </Button>
          </div>

          

          <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered className="candidate-modal">
            <Modal.Header closeButton className="bg-primary text-white">
              <Modal.Title>
                <i className="bi bi-person-plus me-2"></i>
                Register New Candidate
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> {submitError}
                    <button type="button" className="btn-close" onClick={() => setSubmitError("")}></button>
                  </div>
                )}
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Candidate Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="candidate_name"
                        value={formData.candidate_name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhar_number"
                        value={formData.aadhar_number}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pregnancy Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="pregancy_num"
                        value={formData.pregancy_num}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Child Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="child_name"
                        value={formData.child_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>LMP Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="lmp_date"
                        value={formData.lmp_date}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Child DOB</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob_child"
                        value={formData.dob_child}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>PAN Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="pan_no"
                        value={formData.pan_no}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_number"
                        value={formData.account_number}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>IFSC Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="ifsc_code"
                        value={formData.ifsc_code}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>PAN File</Form.Label>
                      <Form.Control
                        type="file"
                        name="pan_file"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar File</Form.Label>
                      <Form.Control
                        type="file"
                        name="aadhar_file"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? "Registering..." : "Register Candidate"}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default AnganwadiDashboard;