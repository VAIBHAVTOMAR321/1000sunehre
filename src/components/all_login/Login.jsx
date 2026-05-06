import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../../assets/css/login.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    role: '',
    email_or_phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const roleOptions = useMemo(() => {
    const allRoles = [
      { value: 'director', label: 'Director', icon: 'bi-person-workspace' },
      { value: 'dpo', label: 'DPO', icon: 'bi-briefcase' },
      { value: 'cdpo', label: 'CDPO', icon: 'bi-person-badge' },
      { value: 'supervisor', label: 'Supervisor', icon: 'bi-person-check' },
      { value: 'anganbadi', label: 'Anganbadi', icon: 'bi-house-door' },
    ];

    if (searchParams.has('director')) return allRoles.filter(r => r.value === 'director');
    if (searchParams.has('district')) return allRoles.filter(r => ['dpo', 'cdpo'].includes(r.value));
    
    // Default view shows Supervisor and Anganbadi
    return allRoles.filter(r => ['supervisor', 'anganbadi'].includes(r.value));
  }, [searchParams]);

  const loginTitle = useMemo(() => {
    if (searchParams.has('director')) {
      return 'Director Login';
    } else if (searchParams.has('district')) {
      return 'DPO / CDPO Login';
    } else {
      return 'Field Staff Login'; // Default for Supervisor and Anganbadi
    }
  }, [searchParams]);

  useEffect(() => {
    // Sync selected role with filtered options on mount or param change
    if (roleOptions.length > 0 && !roleOptions.some(o => o.value === formData.role)) {
      setFormData(prev => ({ ...prev, role: roleOptions[0].value }));
    }
  }, [roleOptions, formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email_or_phone) {
      setError("User ID / Phone is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        role: formData.role,
        password: formData.password,
        email_or_phone: formData.email_or_phone,
      };

      const response = await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/login/',
        payload
      );

      if (response.data.access) {
        login({
          access: response.data.access,
          refresh: response.data.refresh,
          role: response.data.role,
          unique_id: response.data.unique_id,
          user: response.data.user || null,
        });
        alert("Login successful!");
        
        // Update navigation routes based on your dashboard implementation
        if (['director', 'dpo', 'cdpo'].includes(response.data.role)) {
          navigate('/DashBord');
        } else {
          navigate('/UserDashboard'); 
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern"></div>
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="brand-logo">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <h1>{loginTitle}</h1>
            <p>Skill Today, Empower Tomorrow</p>
          </div>

          <div className="welcome-section">
            <h2>Welcome Back!</h2>
            <p>Continue your learning journey</p>
          </div>

          {roleOptions.length > 1 && (
            <div className="role-selector">
              <label>Select Your Role</label>
              <div className="role-tabs">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`role-tab ${formData.role === option.value ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: option.value })}
                  >
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert-message error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>User ID / Phone</label>
              <div className="input-wrapper-text">
                <i className="bi bi-person"></i>
                <input
                  type="text"
                  name="email_or_phone"
                  value={formData.email_or_phone}
                  onChange={handleChange}
                  placeholder="Enter User ID or Phone"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
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
                <span>Remember me</span>
              </label>
              {/* <a href="/" className="forgot-link">Forgot password?</a> */}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Need access? <Link to="/contact">Contact Administration</Link></p>
          </div>
        </div>

        <div className="login-highlights">
          <div className="highlight-item">
            <i className="bi bi-book"></i>
              <h3>Learn</h3>
              <p>Access quality education and new courses</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-graph-up"></i>
              <h3>Grow</h3>
              <p>Track your academic progress</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-rocket-takeoff"></i>
              <h3>Succeed</h3>
              <p>Build your career from class 9 to 12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;