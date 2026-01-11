import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/students/profile');
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-wide">
      <h1 className="university-title">KLE Technological University</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        My Profile
      </h2>

      <Link to="/dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : profile ? (
        <div className="profile-grid">
          <div className="profile-item">
            <label>Name</label>
            <p>{profile.name || 'N/A'}</p>
          </div>
          <div className="profile-item">
            <label>SRN</label>
            <p>{profile.srn || 'N/A'}</p>
          </div>
          <div className="profile-item">
            <label>Semester</label>
            <p>{profile.semester || 'N/A'}</p>
          </div>
          <div className="profile-item">
            <label>Year</label>
            <p>{profile.year || 'N/A'}</p>
          </div>
          <div className="profile-item" style={{ gridColumn: '1 / -1' }}>
            <label>Department</label>
            <p>{profile.department || 'N/A'}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
