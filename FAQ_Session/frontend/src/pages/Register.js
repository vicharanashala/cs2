import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/auth/register', formData);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join the FAQ community</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
        </p>

        <div style={styles.divider}>
          <span>or continue with</span>
        </div>

        <a href="http://localhost:5000/auth/google">
          <button style={styles.googleBtn}>
            <img src="https://www.google.com/favicon.ico" alt="google" style={styles.icon} />
            Google
          </button>
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '20px' },
  card: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' },
  title: { fontSize: '28px', color: '#333', marginBottom: '8px' },
  subtitle: { color: '#888', marginBottom: '25px', fontSize: '15px' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  form: { textAlign: 'left' },
  formGroup: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#555', fontSize: '14px' },
  input: { width: '100%', padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' },
  button: { width: '100%', padding: '14px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' },
  footer: { marginTop: '20px', color: '#666', fontSize: '14px' },
  link: { color: '#4285F4', fontWeight: '600' },
  divider: { margin: '25px 0', color: '#888', fontSize: '13px', position: 'relative' },
  googleBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontSize: '15px', cursor: 'pointer', background: 'white', border: '2px solid #ddd', borderRadius: '8px', width: '100%', justifyContent: 'center', fontWeight: '500' },
  icon: { width: '20px', height: '20px' }
};

export default Register;