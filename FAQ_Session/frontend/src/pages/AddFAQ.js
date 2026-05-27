import React, { useState } from 'react';
import axios from 'axios';

const AddFAQ = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/faq/add',
        { question, answer },
        { withCredentials: true }
      );
      setMessage('✅ FAQ added successfully!');
      setQuestion('');
      setAnswer('');
    } catch (err) {
      setMessage('❌ Error adding FAQ!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>➕ Add New FAQ</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Question</label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              style={styles.input}
              placeholder="Enter your question..."
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              style={styles.textarea}
              placeholder="Enter the answer..."
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Adding...' : 'Add FAQ'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', display: 'flex', justifyContent: 'center' },
  card: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', width: '100%', maxWidth: '600px' },
  title: { marginBottom: '25px', color: '#333' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' },
  input: { width: '100%', padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  textarea: { width: '100%', padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #ddd', height: '120px', outline: 'none', resize: 'vertical' },
  button: { width: '100%', padding: '12px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' },
  message: { padding: '10px', borderRadius: '8px', background: '#f0f7ff', marginBottom: '20px', fontWeight: '500' }
};

export default AddFAQ;