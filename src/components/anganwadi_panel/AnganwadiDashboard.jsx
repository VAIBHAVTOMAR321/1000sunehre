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
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
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

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await api.get("/candidate/details/", {
        params: { registred_by: user?.user_id || "USR-000002" }
      });
      setCandidates(response.data.data || []);
      setTotalRegistrations(response.data.count || 0);
    } catch (err) {
      console.error("❌ Failed to fetch candidates:", err);
      setCandidates([]);
      setTotalRegistrations(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [user]);

  useEffect(() => {
    const totalPages = Math.ceil(candidates.length / itemsPerPage);
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [candidates.length, itemsPerPage, currentPage]);

  const handleCardClick = () => {
    setShowTable(true);
    setCurrentPage(1);
  };

  const handleCloseTable = () => {
    setShowTable(false);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
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
      fetchCandidates();
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
             <Button variant="primary" onClick={() => setShowRegistrationForm(true)}>
               <i className="bi bi-person-plus me-2"></i>
               Register Candidate
             </Button>
          </div>

          {showRegistrationForm ? (
            <Card className="p-4 shadow-sm border-0 mt-4">
              <Card.Title className="mb-4 fw-bold">Register New Candidate</Card.Title>
              <Form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> {submitError}
                    <button type="button" className="btn-close" onClick={() => setSubmitError("")}></button>
                  </div>
                )}
                
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Candidate Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="candidate_name"
                        placeholder="Enter Candidate Name"
                        value={formData.candidate_name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        placeholder="yyyy-mm-dd"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Aadhar Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhar_number"
                        placeholder="Enter Aadhar Number"
                        value={formData.aadhar_number}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Pregnancy Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="pregancy_num"
                        placeholder="Enter Pregnancy Number"
                        value={formData.pregancy_num}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Child Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="child_name"
                        placeholder="Enter Child Name"
                        value={formData.child_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">LMP Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="lmp_date"
                        placeholder="yyyy-mm-dd"
                        value={formData.lmp_date}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Child DOB</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob_child"
                        placeholder="yyyy-mm-dd"
                        value={formData.dob_child}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">PAN Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="pan_no"
                        placeholder="Enter PAN Number"
                        value={formData.pan_no}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_number"
                        placeholder="Enter Account Number"
                        value={formData.account_number}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">IFSC Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="ifsc_code"
                        placeholder="Enter IFSC Code"
                        value={formData.ifsc_code}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">PAN File</Form.Label>
                      <Form.Control
                        type="file"
                        name="pan_file"
                        placeholder="Upload PAN document"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Aadhar File</Form.Label>
                      <Form.Control
                        type="file"
                        name="aadhar_file"
                        placeholder="Upload Aadhar document"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => setShowRegistrationForm(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? "Registering..." : "Register Candidate"}
                  </Button>
                </div>
              </Form>
            </Card>
          ) : (
            <Row>
              <Col md={3}>
                <Card className="h-100 shadow-sm border-0" style={{ cursor: 'pointer', transition: 'all 0.2s ease', minWidth: '200px' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; }} onClick={handleCardClick}>
                  <Card.Body className="text-center py-3">
                    <div className="mb-2">
                      <i className="bi bi-people-fill" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
                    </div>
                    <Card.Title as="h6" className="mb-1 text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', fontWeight: 600 }}>
                      Total Registrations
                    </Card.Title>
                    <Card.Text as="h3" className="fw-bold text-primary mb-0" style={{ fontSize: '1.75rem', lineHeight: 1 }}>
                      {totalRegistrations}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          </Container>

          {showTable && (
            <Container fluid className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Registered Candidates</h4>
                <Button variant="secondary" size="sm" onClick={handleCloseTable}>
                  <i className="bi bi-arrow-up me-2"></i>
                  Collapse
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading candidates...</p>
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-4">
                  <p>No candidates found.</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm" className="table-hover align-middle mb-0">
                      <thead className="table-dark text-white" style={{ backgroundColor: '#2c3e50' }}>
                        <tr>
                          <th className="text-center" style={{ minWidth: '50px' }}>#</th>
                          <th style={{ minWidth: '130px' }}>Candidate ID</th>
                          <th style={{ minWidth: '150px' }}>Name</th>
                          <th style={{ minWidth: '110px' }}>Phone</th>
                          <th style={{ minWidth: '110px' }}>LMP Date</th>
                          <th style={{ minWidth: '100px' }}>Women DOB</th>
                          <th style={{ minWidth: '100px' }}>Child DOB</th>
                          <th style={{ minWidth: '120px' }}>Child Name</th>
                          <th style={{ minWidth: '70px' }}>Preg #</th>
                          <th style={{ minWidth: '130px' }}>Aadhar Number</th>
                          <th style={{ minWidth: '120px' }}>PAN Number</th>
                          <th style={{ minWidth: '140px' }}>Account Number</th>
                          <th style={{ minWidth: '100px' }}>IFSC Code</th>
                        <th style={{ minWidth: '100px' }}>Verified</th>
                        <th style={{ minWidth: '80px' }}>Active</th>
                        <th style={{ minWidth: '100px' }}>Aadhar File</th>
                        <th style={{ minWidth: '100px' }}>PAN File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const totalItems = candidates.length;
                          const totalPages = Math.ceil(totalItems / itemsPerPage);
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const paginatedCandidates = candidates.slice(startIndex, endIndex);

                          return paginatedCandidates.map((c, index) => {
                            const baseUrl = "https://mahadevaaya.com/golden100days/golden100days_backend";
                            const aadharFile = c.aadhar_file ? `${baseUrl}${c.aadhar_file}` : "-";
                            const panFile = c.pan_file ? `${baseUrl}${c.pan_file}` : "-";

                            return (
                              <tr key={c.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                <td className="text-center fw-bold">{startIndex + index + 1}</td>
                                <td><span className="badge bg-primary">{c.candidate_id}</span></td>
                                <td className="fw-semibold">{c.candidate_name}</td>
                                <td>{c.phone}</td>
                                <td>{c.lmp_date}</td>
                                <td>{c.dob}</td>
                                <td>{c.dob_child}</td>
                                <td>{c.child_name}</td>
                                <td>{c.pregancy_num}</td>
                                <td><code className="text-muted small">{c.aadhar_number}</code></td>
                                <td><span className="badge bg-secondary">{c.pan_no}</span></td>
                                <td><code className="text-muted small">{c.account_number}</code></td>
                                <td><span className="badge bg-secondary">{c.ifsc_code}</span></td>
                                <td>
                                  <span className={`badge ${c.is_verified ? 'bg-success' : 'bg-warning'}`}>
                                    {c.is_verified ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td>
                                <span className={`badge ${c.is_active ? 'bg-success' : 'bg-danger'}`}>
                                  {c.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                {c.aadhar_file ? (
                                    <a href={aadharFile} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                      <i className="bi bi-eye"></i> View
                                    </a>
                                  ) : <span className="text-muted">-</span>}
                                </td>
                                <td>
                                  {c.pan_file ? (
                                    <a href={panFile} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                      <i className="bi bi-eye"></i> View
                                    </a>
                                  ) : <span className="text-muted">-</span>}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </Table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span className="text-muted small">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, candidates.length)} of {candidates.length} entries
                    </span>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-double-left"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </Button>

                      <span className="badge bg-light text-dark border px-3 py-2">
                        Page {currentPage} of {Math.ceil(candidates.length / itemsPerPage)}
                      </span>

                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(candidates.length / itemsPerPage), p + 1))}
                        disabled={currentPage === Math.ceil(candidates.length / itemsPerPage)}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setCurrentPage(Math.ceil(candidates.length / itemsPerPage))}
                        disabled={currentPage === Math.ceil(candidates.length / itemsPerPage)}
                      >
                        <i className="bi bi-chevron-double-right"></i>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Container>
          )}
      </div>
    </div>
  );
};

export default AnganwadiDashboard;