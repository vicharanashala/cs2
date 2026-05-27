import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💬 FAQ App</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/add-faq" style={styles.link}>Add FAQ</Link>
            <Link to="/faq-replies" style={styles.link}>Replies</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" style={styles.adminBtn}>Admin</Link>
            )}
            <a href="http://localhost:5000/auth/logout" style={styles.logoutBtn}>Logout</a>
            <div style={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#4285F4' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#333', fontWeight: '500', transition: 'color 0.2s' },
  loginBtn: { background: '#4285F4', color: 'white', padding: '8px 18px', borderRadius: '20px', fontWeight: '500' },
  logoutBtn: { color: '#e53935', fontWeight: '500' },
  adminBtn: { background: '#e53935', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '500' },
  avatar: { background: '#4285F4', color: 'white', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }
};

export default Navbar;