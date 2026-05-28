import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your FAQ assistant. Ask me anything about the FAQs or type a keyword to search!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchFAQs = async (query) => {
    try {
      const res = await axios.get('http://localhost:5000/faq');
      const faqs = res.data;
      
      // Simple keyword matching
      const queryLower = query.toLowerCase();
      const matchingFAQs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(queryLower) ||
        faq.answer.toLowerCase().includes(queryLower)
      );

      if (matchingFAQs.length > 0) {
        return matchingFAQs.slice(0, 3).map((faq, i) => 
          `${i + 1}. Q: ${faq.question}\n   A: ${faq.answer}`
        ).join('\n\n');
      }
      return null;
    } catch (err) {
      console.error('Error searching FAQs:', err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Search for matching FAQs
      const results = await searchFAQs(userMessage);

      if (results) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I found some relevant FAQs:\n\n${results}\n\nWould you like me to show more?` 
        }]);
      } else {
        // Check if user is greeting
        const greetings = ['hi', 'hello', 'hey', 'howdy'];
        if (greetings.some(g => userMessage.toLowerCase().includes(g))) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Hello! 👋 How can I help you today? Feel free to ask about any FAQs or use the search bar above.' 
          }]);
        } else if (userMessage.toLowerCase().includes('help')) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'I can help you find answers! Just type a keyword or question, and I\'ll search our FAQ database. You can also:\n\n• Use the search bar on the page\n• Expand/collapse FAQ items\n• Click "Add FAQ" to contribute new questions' 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'I couldn\'t find a specific answer for that. Try using different keywords, or feel free to add a new FAQ yourself! Click "Add FAQ" in the navigation to contribute.' 
          }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.chatButton}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <span>🤖 FAQ Assistant</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
          </div>
          
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
                }}
              >
                <div style={styles.messageContent}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div style={styles.assistantMessage}>
                <div style={styles.messageContent}>Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendBtn} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#4285F4',
    color: 'white',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatWindow: {
    position: 'fixed',
    bottom: '100px',
    right: '30px',
    width: '380px',
    height: '500px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000
  },
  chatHeader: {
    background: '#4285F4',
    color: 'white',
    padding: '15px 20px',
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  message: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap'
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: '#4285F4',
    color: 'white',
    borderBottomRightRadius: '4px'
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    background: '#f1f3f4',
    color: '#333',
    borderBottomLeftRadius: '4px'
  },
  messageContent: {
    wordBreak: 'break-word'
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    borderTop: '1px solid #eee'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '14px'
  },
  sendBtn: {
    padding: '10px 20px',
    background: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default Chatbot;