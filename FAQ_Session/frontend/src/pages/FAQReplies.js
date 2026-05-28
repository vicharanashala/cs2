import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const FAQReplies = () => {
  const [faqs, setFaqs] = useState([]);
  const [replyText, setReplyText] = useState({});
  const { user } = useContext(AuthContext);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/faq');
      setFaqs(res.data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    }
  };

  const handleReply = async (faqId) => {
    if (!replyText[faqId]?.trim()) return;
    try {
      await axios.post(`http://localhost:5000/faq/${faqId}/reply`,
        { text: replyText[faqId] },
        getAuthHeader()
      );
      setReplyText({ ...replyText, [faqId]: '' });
      fetchFaqs();
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>FAQ Replies</h2>
      {faqs.length === 0 ? (
        <p style={styles.empty}>No FAQs yet! Be the first to ask.</p>
      ) : (
        faqs.map((faq, index) => (
          <div key={faq._id} style={styles.card}>
            <h3 style={styles.question}>Q{index + 1}: {faq.question}</h3>
            <p style={styles.answer}>{faq.answer || 'No answer yet'}</p>
            <small style={styles.meta}>Asked by: {faq.createdBy || 'Anonymous'}</small>
            
            <div style={styles.replies}>
              <h4 style={styles.replyHeader}>Replies ({faq.replies?.length || 0}):</h4>
              {faq.replies?.map((reply, idx) => (
                <div key={idx} style={styles.reply}>
                  <p style={styles.replyText}>{reply.text}</p>
                  <small style={styles.replyMeta}>By: {reply.createdBy || 'Anonymous'}</small>
                </div>
              ))}
            </div>
            
            <div style={styles.replyForm}>
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[faq._id] || ''}
                onChange={e => setReplyText({ ...replyText, [faq._id]: e.target.value })}
                style={styles.input}
                onKeyPress={e => e.key === 'Enter' && handleReply(faq._id)}
              />
              <button onClick={() => handleReply(faq._id)} style={styles.button}>Reply</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  empty: { textAlign: 'center', color: '#888', marginTop: '40px' },
  card: { background: '#f5f5f5', padding: '20px', marginBottom: '20px', borderRadius: '12px', borderLeft: '4px solid #4285F4' },
  question: { marginBottom: '8px', color: '#333' },
  answer: { color: '#555', marginBottom: '8px' },
  meta: { color: '#888', fontSize: '12px' },
  replies: { marginTop: '15px', paddingLeft: '10px' },
  replyHeader: { fontSize: '14px', color: '#666', marginBottom: '10px' },
  reply: { background: 'white', padding: '10px', marginBottom: '8px', borderRadius: '6px' },
  replyText: { margin: '0 0 4px 0', color: '#333' },
  replyMeta: { color: '#888', fontSize: '11px' },
  replyForm: { display: 'flex', gap: '10px', marginTop: '15px' },
  input: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  button: { padding: '10px 20px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }
};

export default FAQReplies;