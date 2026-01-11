import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterCourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState({
    courseCode: '',
    courseName: '',
    credits: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCurrentCourse({
      ...currentCourse,
      [e.target.name]: e.target.value,
    });
  };

  const addCourse = () => {
    if (!currentCourse.courseCode || !currentCourse.courseName || !currentCourse.credits) {
      setError('Please fill in all fields');
      return;
    }

    const credits = parseInt(currentCourse.credits);
    if (isNaN(credits) || credits <= 0) {
      setError('Credits must be a positive number');
      return;
    }

    setCourses([...courses, { ...currentCourse, credits }]);
    setCurrentCourse({
      courseCode: '',
      courseName: '',
      credits: '',
    });
    setError('');
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (courses.length === 0) {
      setError('Please add at least one course');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create and register each course
      for (const course of courses) {
        // First create the course
        const createResponse = await api.post('/courses/create', {
          courseCode: course.courseCode,
          courseName: course.courseName,
          credits: course.credits,
        });

        // Then register it for the student
        await api.post('/courses/register', {
          courseId: createResponse.data.course?._id || createResponse.data._id,
        });
      }

      setSuccess('All courses registered successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to register courses. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-wide">
      <h1 className="university-title">KLE Technological University</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Register Courses
      </h2>

      <Link to="/dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="course-form">
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Add Course</h3>
        <div className="course-form-row">
          <input
            type="text"
            name="courseCode"
            value={currentCourse.courseCode}
            onChange={handleChange}
            placeholder="Course Code"
            required
          />
          <input
            type="text"
            name="courseName"
            value={currentCourse.courseName}
            onChange={handleChange}
            placeholder="Course Name"
            required
          />
          <input
            type="number"
            name="credits"
            value={currentCourse.credits}
            onChange={handleChange}
            placeholder="Credits"
            min="1"
            required
          />
        </div>
        <button type="button" onClick={addCourse} className="btn" style={{ width: 'auto', padding: '10px 20px' }}>
          Add Course
        </button>
      </div>

      {courses.length > 0 && (
        <div className="course-list">
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Courses to Register</h3>
          {courses.map((course, index) => (
            <div key={index} className="course-list-item">
              <span>
                <strong>{course.courseCode}</strong> - {course.courseName} ({course.credits} credits)
              </span>
              <button type="button" onClick={() => removeCourse(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <button type="submit" className="btn" disabled={loading || courses.length === 0}>
          {loading ? 'Registering...' : 'Register All Courses'}
        </button>
      </form>
    </div>
  );
};

export default RegisterCourses;
