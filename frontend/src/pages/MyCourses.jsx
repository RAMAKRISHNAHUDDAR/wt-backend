import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/my-courses');
      setCourses(response.data.courses || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-wide">
      <h1 className="university-title">KLE Technological University</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        My Courses
      </h2>

      <Link to="/dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="loading">No courses registered yet.</div>
      ) : (
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={course._id || course.courseId || index} className="course-card">
              <h3>{course.courseCode || course.course?.courseCode || 'N/A'}</h3>
              <p>{course.courseName || course.course?.courseName || 'N/A'}</p>
              <p className="credits">
                {course.credits || course.course?.credits || 0} Credits
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
