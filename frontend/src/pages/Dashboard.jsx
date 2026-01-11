import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalCourses: 0,
    totalCredits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/courses/summary');
      setSummary({
        totalCourses: response.data.totalCourses || 0,
        totalCredits: response.data.totalCredits || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container container-wide">
      <h1 className="university-title">KLE Technological University</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Dashboard
      </h2>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Courses</h3>
            <p>{summary.totalCourses}</p>
          </div>
          <div className="summary-card">
            <h3>Total Credits</h3>
            <p>{summary.totalCredits}</p>
          </div>
        </div>
      )}

      <div className="dashboard-buttons">
        <Link to="/profile" className="dashboard-btn">
          My Profile
        </Link>
        <Link to="/my-courses" className="dashboard-btn">
          My Courses
        </Link>
        <Link to="/register-courses" className="dashboard-btn">
          Register Courses
        </Link>
        <button onClick={handleLogout} className="dashboard-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
