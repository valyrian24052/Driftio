"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const topics = ['Technology', 'Science', 'Business', 'Health', 'Education', 'Arts', 'Sports', 'Politics']; // Add more topics as needed

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, keywords, email, selectedTopics }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch. Status:', response.status);
        return;
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResult(data.summaries);
    } catch (error) {
      console.error('Failed to submit form', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Hi, I am Driftio</h1>
      <p>Your personalized AI newsletter. Select a topic or explain in words what you need in your newsletter, add your email, and get a personalized email delivered.</p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <div className="input-section">
          <InputGroup 
            id="description"
            label="Describe in words what you want to read" 
            placeholder="Text here ..."
            className="input-left"
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
          <TopicSelector 
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            topics={topics}
          />
        </div>

        <div className="email-section">
          <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
          <SubmitButton loading={loading} />
        </div>
      </form>

      {result && (
        <div className="results-section">
          <h2>Generated Summaries</h2>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
                <a href={item[2]} target="_blank" rel="noopener noreferrer">Read more</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InputGroup({ id, label, placeholder, className, value, onChange }) {
  return (
    <div className={`input-group ${className}`}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} placeholder={placeholder} value={value} onChange={onChange}></textarea>
    </div>
  );
}

function EmailInput({ value, onChange }) {
  return (
    <div className="email-input-container">
      <input type="email" id="email" placeholder="Enter your email address" value={value} onChange={onChange} />
    </div>
  );
}

function SubmitButton({ loading }) {
  return (
    <button type="submit" className="submit-button" disabled={loading}>
      {loading ? 'Processing...' : 'Get Your Newsletter'}
    </button>
  );
}

function TopicSelector({ selectedTopics, setSelectedTopics, topics }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleTopicChange = (topic) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else if (prev.length < 4) {
        return [...prev, topic];
      }
      return prev;
    });
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="input-group input-right">
      <label htmlFor="topics" className="topics-label">Select Topics (up to 4)</label>
      <div className="topics-container" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="topics-button"
        >
          <span className="topics-button-text">Topics</span>
          <span className="topics-dropdown-indicator">▼</span>
        </button>
        {isOpen && (
          <div className="topics-dropdown">
            {topics.map(topic => (
              <div
                key={topic}
                className={`topics-dropdown-item ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                onClick={() => handleTopicChange(topic)}
              >
                {topic}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedTopics.length > 0 && (
        <div className="selected-topics">
          <h3>Selected Topics:</h3>
          <ul>
            {selectedTopics.map(topic => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
