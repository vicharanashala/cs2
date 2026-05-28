import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoSection}>
        <Link to="/" style={styles.logo}>💬 FAQ App</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/add-faq" style={styles.link}>Add FAQ</Link>
            <Link to="/faq-replies" style={styles.link}>Replies</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={styles.adminBtn}>Admin</Link>
            )}
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            <div style={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.loginBtn}>Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logoSection: { display: 'flex', alignItems: 'center' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#4285F4', textDecoration: 'none' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#333', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' },
  loginBtn: { background: '#4285F4', color: 'white', padding: '8px 18px', borderRadius: '20px', fontWeight: '500', textDecoration: 'none' },
  logoutBtn: { background: 'transparent', color: '#e53935', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
  adminBtn: { background: '#e53935', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '500', textDecoration: 'none', fontSize: '14px' },
  avatar: { background: '#4285F4', color: 'white', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }
};

export default Navbar;