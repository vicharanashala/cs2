import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/faq')
      .then(res => setFaqs(res.data))
      .catch(err => console.log('Error fetching FAQs:', err));
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
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
    (faq.answer && faq.answer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Frequently Asked Questions</h1>
        <p style={styles.subtitle}>Find answers to common questions</p>
      </div>

      {/* Search bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search the FAQ — type a keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* Results count */}
      {search && (
        <p style={styles.resultCount}>
          {filteredFaqs.length} result(s) found for "{search}"
        </p>
      )}

      {/* Expand/Collapse buttons */}
      <div style={styles.controls}>
        <button 
          onClick={handleExpandAll} 
          style={styles.controlBtn}
          disabled={filteredFaqs.length === 0}
        >
          📖 Expand all
        </button>
        <button 
          onClick={handleCollapseAll} 
          style={styles.controlBtn}
          disabled={filteredFaqs.length === 0}
        >
          📕 Collapse all
        </button>
      </div>

      {/* FAQ List */}
      {filteredFaqs.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📭</p>
          <p>{search ? 'No FAQs match your search.' : 'No FAQs yet!'}</p>
          <p style={styles.emptyHint}>
            {search ? 'Try different keywords or' : 'Be the first to'}{' '}
            <a href="/add-faq" style={styles.emptyLink}>add an FAQ</a>
          </p>
        </div>
      ) : (
        <div style={styles.faqList}>
          {filteredFaqs.map((faq, index) => (
            <div key={faq._id} style={styles.card}>
              <div
                style={styles.question}
                onClick={() => toggleFAQ(faq._id)}
              >
                <div style={styles.questionLeft}>
                  <span style={styles.questionNumber}>{index + 1}</span>
                  <span style={styles.questionText}>{faq.question}</span>
                </div>
                <span style={styles.arrow}>
                  {expandAll || openId === faq._id ? '▲' : '▼'}
                </span>
              </div>
              {(expandAll || openId === faq._id) && (
                <div style={styles.answer}>
                  <p style={styles.answerText}>{faq.answer || 'No answer provided yet.'}</p>
                  <div style={styles.meta}>
                    <span>👤 {faq.createdBy || 'Anonymous'}</span>
                    {faq.replies?.length > 0 && (
                      <span>💬 {faq.replies.length} {faq.replies.length === 1 ? 'reply' : 'replies'}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '900px', margin: '0 auto', paddingBottom: '80px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '32px', color: '#333', marginBottom: '8px' },
  subtitle: { color: '#888', fontSize: '16px' },
  searchContainer: { marginBottom: '15px' },
  search: { 
    width: '100%', 
    padding: '15px 20px', 
    fontSize: '16px', 
    borderRadius: '12px', 
    border: '2px solid #e0e0e0', 
    marginBottom: '10px', 
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },
  resultCount: { color: '#4285F4', fontSize: '14px', marginBottom: '15px', fontWeight: '500' },
  controls: { display: 'flex', gap: '12px', marginBottom: '25px', justifyContent: 'flex-end' },
  controlBtn: { 
    padding: '8px 16px', 
    background: 'white', 
    border: '1px solid #ddd', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    color: '#555',
    transition: 'all 0.2s'
  },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#888' },
  emptyIcon: { fontSize: '48px', marginBottom: '15px' },
  emptyHint: { fontSize: '14px', marginTop: '8px' },
  emptyLink: { color: '#4285F4', fontWeight: '600' },
  faqList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden', background: 'white' },
  question: { 
    padding: '18px 20px', 
    background: '#fafafa', 
    cursor: 'pointer', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    transition: 'background 0.2s'
  },
  questionLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  questionNumber: { 
    background: '#4285F4', 
    color: 'white', 
    width: '28px', 
    height: '28px', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  questionText: { fontWeight: '600', fontSize: '15px', color: '#333' },
  arrow: { color: '#888', fontSize: '12px', marginLeft: '10px' },
  answer: { padding: '20px', background: 'white', borderTop: '1px solid #f0f0f0' },
  answerText: { color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '12px' },
  meta: { display: 'flex', gap: '20px', color: '#888', fontSize: '13px' }
};

export default Home;