import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FAQReplies = () => {
  const [faqs, setFaqs] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/faq')
      .then(res => setFaqs(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleReply = async (faqId) => {
    try {
      await axios.post(`http://localhost:5000/faq/${faqId}/reply`,
        { text: replyText[faqId] },
        { withCredentials: true }
      );
      const res = await axios.get('http://localhost:5000/faq');
      setFaqs(res.data);
      setReplyText({ ...replyText, [faqId]: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>FAQ Replies</h2>
      {faqs.map(faq => (
        <div key={faq._id} style={styles.card}>
          <h3>Q: {faq.question}</h3>
          <p>A: {faq.answer}</p>
          <div style={styles.replies}>
            <h4>Replies ({faq.replies.length}):</h4>
            {faq.replies.map((reply, index) => (
              <div key={index} style={styles.reply}>
                <p>{reply.text}</p>
                <small>By: {reply.createdBy}</small>
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
            />
            <button onClick={() => handleReply(faq._id)} style={styles.button}>Reply</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  card: { background: '#f5f5f5', padding: '15px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #4285F4' },
  replies: { marginTop: '10px', paddingLeft: '15px' },
  reply: { background: 'white', padding: '8px', marginBottom: '8px', borderRadius: '5px' },
  replyForm: { display: 'flex', gap: '10px', marginTop: '10px' },
  input: { flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '8px 15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default FAQReplies;