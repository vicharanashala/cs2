import React from 'react';

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💬 FAQ App</h1>
        <p style={styles.subtitle}>Sign in to ask and answer questions</p>
        <a href="http://localhost:5000/auth/google">
          <button style={styles.button}>
            <img src="https://www.google.com/favicon.ico" alt="google" style={styles.icon} />
            Continue with Google
          </button>
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '50px 40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '380px' },
  title: { fontSize: '28px', color: '#4285F4', marginBottom: '10px' },
  subtitle: { color: '#888', marginBottom: '30px', fontSize: '15px' },
  button: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: 'white', border: '2px solid #ddd', borderRadius: '8px', width: '100%', justifyContent: 'center', fontWeight: '500', transition: 'box-shadow 0.2s' },
  icon: { width: '20px', height: '20px' }
};

export default Login;