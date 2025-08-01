import React, { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const getReport = async () => {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const res = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance`
      );
      const data = await res.json();
      if (data.lighthouseResult) {
        setReport(data.lighthouseResult);
      } else {
        setError('No report found. Please check the URL and try again.');
      }
    } catch (err) {
      setError('Error fetching PageSpeed Insights data.');
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'green';
    if (score >= 50) return 'orange';
    return 'red';
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>🔧 PageSpeed Optimizer</h1>
      <p>Enter your website URL to get performance tips from Google PageSpeed Insights.</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={getReport} disabled={loading || !url}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {report && (
        <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 4 }}>
          <h2>Results for {report.finalUrl}</h2>
          <p>
            Performance Score:{' '}
            <span style={{ color: getScoreColor(report.categories.performance.score * 100) }}>
              {Math.round(report.categories.performance.score * 100)} / 100
            </span>
          </p>
          <h3>Key Opportunities:</h3>
          <ul>
            {report.audits['uses-optimized-images']?.score !== 1 && (
              <li>Optimize your images for faster load time.</li>
            )}
            {report.audits['render-blocking-resources']?.score !== 1 && (
              <li>Eliminate render-blocking resources.</li>
            )}
            {report.audits['unused-css-rules']?.score !== 1 && <li>Remove unused CSS.</li>}
            {report.audits['server-response-time']?.score !== 1 && <li>Improve server response time.</li>}
            {report.audits['unminified-javascript']?.score !== 1 && <li>Minify JavaScript files.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}