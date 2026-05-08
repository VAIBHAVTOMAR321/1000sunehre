import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../../assets/css/login.css';
import UkLogo from '../../assets/images/new_logo_uk.png';
import ResetPasswordModal from './ResetPasswordModal';
import Womenlogo from '../../assets/images/women_logo.jpeg';

const Login = () => {
  const [formData, setFormData] = useState({
    role: 'supervisor',
    email_or_phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New state for password reset modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordUsername, setResetPasswordUsername] = useState('');
  const [resetPasswordRole, setResetPasswordRole] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Content in Hindi - Government Portal Style (consistent with Home.jsx)
  const content = {
    brandSubtitle: "आज का कौशल, कल का सशक्तिकरण",
   
    roleLabel: "अपनी भूमिका चुनें",
    userIdLabel: "यूजर आईडी / फोन",
    userIdPlaceholder: "यूजर आईडी या फोन दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    signIn: "साइन इन करें",
    signingIn: "साइन इन हो रहा है...",
    
    learnTitle: "सीखें",
    learnDesc: "गुणवत्तापूर्ण शिक्षा और नए पाठ्यक्रमों तक पहुंच प्राप्त करें",
    growTitle: "बढ़ें",
    growDesc: "अपनी शैक्षणिक प्रगति को ट्रैक करें",
    succeedTitle: "सफल हों",
    succeedDesc: "कक्षा 9 से 12 तक अपना करियर बनाएं",
    errors: {
      userIdRequired: "यूजर आईडी / फोन आवश्यक है",
      passwordRequired: "पासवर्ड आवश्यक है",
      loginFailed: "लॉगिन विफल रहा। कृपया पुनः प्रयास करें।",
      loginSuccess: "लॉगिन सफल!",
      invalidCredentials: "गलत क्रेडेंशियल। कृपया पुनः प्रयास करें।",
      userNotFound: "उपयोगकर्ता नहीं मिला।",
      defaultPasswordNotAllowed: "डिफ़ॉल्ट पासवर्ड की अनुमति नहीं है। कृपया अपना पासवर्ड रीसेट करें।"
    },
    resetPassword: {
      title: "पासवर्ड रीसेट करें",
      newPasswordLabel: "नया पासवर्ड",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      resetButton: "पासवर्ड रीसेट करें",
      resettingButton: "रीसेट हो रहा है...",
      passwordMismatch: "पासवर्ड मेल नहीं खाते।",
      resetSuccess: "पासवर्ड सफलतापूर्वक रीसेट किया गया।",
      resetFailed: "पासवर्ड रीसेट विफल रहा। कृपया पुनः प्रयास करें।"
    }
  };

  const roleOptions = useMemo(() => {
    return [
      { value: 'director', label: 'निदेशक', icon: 'bi-person-workspace' },
      { value: 'dpo', label: 'जिला कार्यक्रम अधिकारी', icon: 'bi-briefcase' },
      { value: 'cdpo', label: 'परियोजना कार्यक्रम अधिकारी', icon: 'bi-person-badge' },
      { value: 'supervisor', label: 'सुपरवाईजर', icon: 'bi-person-check' },
      { value: 'anganwadi', label: 'आंगनबाड़ी केन्द्र', icon: 'bi-house-door' },
    ];
  }, []);

  const loginTitle = useMemo(() => {
    const selectedRole = roleOptions.find(r => r.value === formData.role);
    return selectedRole ? selectedRole.label : 'लॉगिन';
  }, [formData.role, roleOptions]);

  useEffect(() => {
    if (roleOptions.length > 0 && !formData.role) {
      setFormData(prev => ({ ...prev, role: roleOptions[0].value }));
    }
  }, [roleOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLoginSuccess = (data) => {
    login({
      access: data.access,
      refresh: data.refresh,
      role: data.role,
      unique_id: data.unique_id,
      user: data.user || null,
    });
    alert(content.errors.loginSuccess);

    // Role-based redirection to specific dashboards
    const userRole = data.role;
    switch (userRole) {
      case 'director':
        navigate('/DirectorDashboard');
        break;
      case 'dpo':
        navigate('/DPODashboard');
        break;
      case 'cdpo':
        navigate('/CDPODashboard');
        break;
      case 'supervisor':
        navigate('/SupervisorDashBoard');
        break;
      case 'anganwadi':
        navigate('/AnganwadiDashboard');
        break;
      default:
        navigate('/UserDashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email_or_phone) {
      setError(content.errors.userIdRequired);
      return;
    }
    if (!formData.password) {
      setError(content.errors.passwordRequired);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.email_or_phone,
        password: formData.password,
        role: formData.role,
      };

      const response = await axios.post(
        'https://mahadevaaya.com/golden100days/golden100days_backend/api/login/',
        payload
      );

      if (response.data.access) {
        handleLoginSuccess(response.data);
      }
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.action === 'FORGOT_PASSWORD_REQUIRED') {
        setError(responseData.error || content.errors.defaultPasswordNotAllowed);
      } else if (responseData?.error === 'Invalid credentials') {
        setError(content.errors.invalidCredentials);
      } else if (responseData?.error === 'User not found') {
        setError(content.errors.userNotFound);
      } else if (responseData?.error) {
        setError(responseData.error);
      } else {
        setError(responseData?.message || content.errors.loginFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSuccess = async (newPassword) => {
    setShowResetPasswordModal(false);
    // After successful password reset, attempt to log in with the new password
    setLoading(true);
    try {
      const payload = { username: resetPasswordUsername, password: newPassword, role: resetPasswordRole };
      const response = await axios.post('https://mahadevaaya.com/golden100days/golden100days_backend/api/login/', payload);
      if (response.data.access) {
        handleLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || content.errors.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern"></div>
      <div className="login-container">
          <div className="login-right">
          <div className="uttarakhand-section">
            <img src={UkLogo} alt="Uttarakhand Logo" className="uttarakhand-logo" />
            <h2 className="uttarakhand-title">महिला सशक्तिकरण एवं बाल विकास विभाग<br/>Women Empowerment & Child Development Department</h2>
            
          </div>

         
        </div>
        <div className="login-left">
          <div className="login-content">
            <div className="login-header">
              <div className="brand-logo">
                <img src={Womenlogo} alt="Brand Logo" />
              </div>
              <h1>{loginTitle}</h1>
              <p>{content.brandSubtitle}</p>
            </div>

            <div className="welcome-section">
              <h2>{content.welcomeTitle}</h2>
              <p>{content.welcomeSubtitle}</p>
            </div>

            {/* Radio Button Selection */}
            <div className="role-selector">
              <label className="role-selector-title">{content.roleLabel}</label>
              <div className="radio-selection">
                {roleOptions.map((option) => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleChange}
                    />
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="alert-message error">
                  <i className="bi bi-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>{content.userIdLabel}</label>
                <div className="input-wrapper-text">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    name="email_or_phone"
                    value={formData.email_or_phone}
                    onChange={handleChange}
                    placeholder={content.userIdPlaceholder}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{content.passwordLabel}</label>
                <div className="input-wrapper">
                  <i className="bi bi-lock"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={content.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>{content.rememberMe}</span>
                </label>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {content.signingIn}
                  </>
                ) : (
                  content.signIn
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>{content.needAccess}<Link to="/contact">{content.contactAdmin}</Link></p>
            </div>
          </div>
        </div>

      
      </div>

      {showResetPasswordModal && (
        <ResetPasswordModal
          isOpen={showResetPasswordModal}
          onClose={() => setShowResetPasswordModal(false)}
          username={resetPasswordUsername}
          role={resetPasswordRole}
          onPasswordResetSuccess={handlePasswordResetSuccess}
          content={content.resetPassword}
        />
      )}
    </div>
  );
};

export default Login;