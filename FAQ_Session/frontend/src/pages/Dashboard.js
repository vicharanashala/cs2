import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome back, {user?.name}! 👋</h2>
        <span style={styles.role}>{user?.role}</span>
      </div>
      <div style={styles.cards}>
        <Link to="/add-faq" style={styles.card}>
          <div style={styles.icon}>➕</div>
          <h3>Add FAQ</h3>
          <p>Submit a new question and answer</p>
        </Link>
        <Link to="/faq-replies" style={styles.card}>
          <div style={styles.icon}>💬</div>
          <h3>FAQ Replies</h3>
          <p>View and reply to questions</p>
        </Link>
        <Link to="/" style={styles.card}>
          <div style={styles.icon}>📋</div>
          <h3>View FAQs</h3>
          <p>Browse all public FAQs</p>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
  role: { background: '#e8f0fe', color: '#4285F4', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { background: 'white', padding: '30px 20px', borderRadius: '12px', textDecoration: 'none', color: '#333', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', transition: 'transform 0.2s', border: '1px solid #eee' },
  icon: { fontSize: '36px', marginBottom: '15px' }
};

export default Dashboard;