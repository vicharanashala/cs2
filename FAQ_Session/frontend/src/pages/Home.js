import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/faq')
      .then(res => setFaqs(res.data))
      .catch(err => console.log(err));
  }, []);

  const toggleFAQ = (id) => {
    // If expandAll is on, collapse everything first, then toggle the clicked one
    if (expandAll) {
      setExpandAll(false);
      setOpenId(id);
    } else {
      setOpenId(openId === id ? null : id);
    }
  };

  const handleExpandAll = () => {
    setExpandAll(true);
    setOpenId(null);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setOpenId(null);
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2>Frequently Asked Questions</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search the FAQ — type a keyword..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* Results count */}
      {search && (
        <p style={styles.resultCount}>
          {filteredFaqs.length} result(s) found for "{search}"
        </p>
      )}

      {/* Expand/Collapse buttons */}
      <div style={styles.controls}>
        <span onClick={handleExpandAll} style={styles.controlBtn}>Expand all</span>
        <span onClick={handleCollapseAll} style={styles.controlBtn}>Collapse all</span>
      </div>

      {filteredFaqs.length === 0 ? (
        <p>No FAQs found!</p>
      ) : (
        filteredFaqs.map((faq, index) => (
          <div key={faq._id} style={styles.card}>
            <div
              style={styles.question}
              onClick={() => toggleFAQ(faq._id)}
            >
              <span>▶ {index + 1}. {faq.question}</span>
              <span>{expandAll || openId === faq._id ? '▲' : '▼'}</span>
            </div>
            {(expandAll || openId === faq._id) && (
              <div style={styles.answer}>
                <p>{faq.answer}</p>
                <small style={styles.meta}>Asked by: {faq.createdBy}</small>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  search: { width: '100%', padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', boxSizing: 'border-box' },
  resultCount: { color: '#888', fontSize: '14px', marginBottom: '10px' },
  controls: { display: 'flex', gap: '15px', marginBottom: '20px', justifyContent: 'flex-end' },
  controlBtn: { color: '#4285F4', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' },
  card: { marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' },
  question: { padding: '15px', background: '#f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px' },
  answer: { padding: '15px', background: 'white', borderTop: '1px solid #ddd' },
  meta: { color: '#888', fontSize: '12px' }
};

export default Home;