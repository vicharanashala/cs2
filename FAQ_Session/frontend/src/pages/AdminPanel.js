import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ user }) => {
  const [faqs, setFaqs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ question: '', answer: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const res = await axios.get('http://localhost:5000/faq');
    setFaqs(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await axios.delete(`http://localhost:5000/faq/${id}`, { withCredentials: true });
      setMessage('✅ FAQ deleted!');
      fetchFaqs();
    } catch (err) {
      setMessage('❌ Error deleting FAQ!');
    }
  };

  const handleEdit = (faq) => {
    setEditId(faq._id);
    setEditData({ question: faq.question, answer: faq.answer });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/faq/${id}`, editData, { withCredentials: true });
      setMessage('✅ FAQ updated!');
      setEditId(null);
      fetchFaqs();
    } catch (err) {
      setMessage('❌ Error updating FAQ!');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={styles.container}>
        <div style={styles.denied}>
          <h2>🚫 Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛠️ Admin Panel</h2>
      <p style={styles.subtitle}>Manage all FAQs</p>
      {message && <p style={styles.message}>{message}</p>}

      {faqs.length === 0 ? (
        <p>No FAQs yet!</p>
      ) : (
        faqs.map((faq, index) => (
          <div key={faq._id} style={styles.card}>
            {editId === faq._id ? (
              // Edit mode
              <div>
                <input
                  value={editData.question}
                  onChange={e => setEditData({ ...editData, question: e.target.value })}
                  style={styles.input}
                  placeholder="Question"
                />
                <textarea
                  value={editData.answer}
                  onChange={e => setEditData({ ...editData, answer: e.target.value })}
                  style={styles.textarea}
                  placeholder="Answer"
                />
                <div style={styles.btnGroup}>
                  <button onClick={() => handleUpdate(faq._id)} style={styles.saveBtn}>💾 Save</button>
                  <button onClick={() => setEditId(null)} style={styles.cancelBtn}>✖ Cancel</button>
                </div>
              </div>
            ) : (
              // View mode
              <div>
                <h3 style={styles.question}>{index + 1}. {faq.question}</h3>
                <p style={styles.answer}>{faq.answer}</p>
                <small style={styles.meta}>By: {faq.createdBy} | Replies: {faq.replies.length}</small>
                <div style={styles.btnGroup}>
                  <button onClick={() => handleEdit(faq)} style={styles.editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDelete(faq._id)} style={styles.deleteBtn}>🗑️ Delete</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  title: { marginBottom: '5px' },
  subtitle: { color: '#888', marginBottom: '20px' },
  message: { padding: '10px', borderRadius: '8px', background: '#f0f7ff', marginBottom: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  question: { marginBottom: '8px', color: '#333' },
  answer: { color: '#555', marginBottom: '8px' },
  meta: { color: '#888', fontSize: '12px' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '12px' },
  editBtn: { padding: '8px 15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { padding: '8px 15px', background: '#e53935', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  saveBtn: { padding: '8px 15px', background: '#43a047', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { padding: '8px 15px', background: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  input: { width: '100%', padding: '10px', fontSize: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' },
  textarea: { width: '100%', padding: '10px', fontSize: '15px', borderRadius: '8px', border: '1px solid #ddd', height: '100px', marginBottom: '10px' },
  denied: { textAlign: 'center', marginTop: '100px', color: '#e53935' }
};

export default AdminPanel;