import React, { useState, useEffect } from 'react';
import { 
  getPeriods, 
  getWeeklySchedule, 
  getDailySchedule,
  createPeriod,
  updatePeriod,
  deletePeriod,
  generateTimetable
} from '../../../../services/PeriodService';
import { AcademicService } from '../../../../services/AcademicService';
import { getTerms } from '../../../../services/AdministrationService';

const Calendar = () => {
  const [periods, setPeriods] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [allocatedSubjects, setAllocatedSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '09:00',
    allocated_subject: '', // This should be AllocatedSubject ID
    classroom: '', // This should be ClassRoom ID
    teacher: '' // This will be auto-filled from AllocatedSubject
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // Demo data for when API is not available
  const demoPeriods = [
    {
      id: 1,
      day_of_week: 'Monday',
      start_time: '08:00',
      end_time: '09:00',
      subject: { name: 'Mathematics' },
      classroom: { name: 'Room 101' },
      teacher: { first_name: 'John', last_name: 'Smith' }
    },
    {
      id: 2,
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '10:00',
      subject: { name: 'English' },
      classroom: { name: 'Room 102' },
      teacher: { first_name: 'Sarah', last_name: 'Johnson' }
    },
    {
      id: 3,
      day_of_week: 'Tuesday',
      start_time: '08:00',
      end_time: '09:00',
      subject: { name: 'Science' },
      classroom: { name: 'Lab 201' },
      teacher: { first_name: 'Mike', last_name: 'Davis' }
    },
    {
      id: 4,
      day_of_week: 'Wednesday',
      start_time: '10:00',
      end_time: '11:00',
      subject: { name: 'History' },
      classroom: { name: 'Room 103' },
      teacher: { first_name: 'Lisa', last_name: 'Wilson' }
    }
  ];

  const demoClassrooms = [
    { id: 1, name: 'Room 101' },
    { id: 2, name: 'Room 102' },
    { id: 3, name: 'Room 103' },
    { id: 4, name: 'Lab 201' },
    { id: 5, name: 'Lab 202' }
  ];

  const demoAllocatedSubjects = [
    { id: 1, name: 'Mathematics - Room 101 - John Smith' },
    { id: 2, name: 'English - Room 102 - Sarah Johnson' },
    { id: 3, name: 'Science - Lab 201 - Mike Davis' },
    { id: 4, name: 'History - Room 103 - Lisa Wilson' },
    { id: 5, name: 'Geography - Room 104 - Tom Brown' }
  ];

  useEffect(() => {
    loadCalendarData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadWeeklySchedule();
    }
  }, [selectedDate]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Please log in to access the calendar. Authentication token not found.');
        setLoading(false);
        return;
      }

      const [periodsData, classroomsData, allocatedSubjectsData, termsData] = await Promise.all([
        getPeriods().catch((e) => { 
          console.debug('Periods error:', e?.response?.data || e.message); 
          if (e?.response?.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          }
          return []; 
        }),
                 AcademicService.getClassrooms().catch((e) => { 
          console.debug('Classrooms error:', e?.response?.data || e.message); 
          if (e?.response?.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          }
          return []; 
        }),
                 AcademicService.getAllocatedSubjects().catch((e) => { 
          console.debug('Allocated Subjects error:', e?.response?.data || e.message); 
          if (e?.response?.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          }
          return []; 
        }),
        getTerms().catch((e) => { 
          console.debug('Terms error:', e?.response?.data || e.message); 
          if (e?.response?.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          }
          return []; 
        })
      ]);

      // Check if we got any real data
      if (periodsData.length > 0 || classroomsData.length > 0 || allocatedSubjectsData.length > 0) {
        setPeriods(periodsData);
        setClassrooms(classroomsData);
        setAllocatedSubjects(allocatedSubjectsData);
        setTerms(termsData);
        setDemoMode(false);
      } else {
        // Fall back to demo mode if no real data
        setPeriods(demoPeriods);
        setClassrooms(demoClassrooms);
        setAllocatedSubjects(demoAllocatedSubjects);
        setDemoMode(true);
      }
    } catch (err) {
      console.error('Error loading calendar data:', err);
      if (err.message.includes('Authentication failed')) {
        setError(err.message);
      } else if (err?.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err?.response?.status === 0 || err?.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check if the backend is running.');
        // Fall back to demo mode
        setPeriods(demoPeriods);
        setClassrooms(demoClassrooms);
        setAllocatedSubjects(demoAllocatedSubjects);
        setDemoMode(true);
      } else {
        setError(err.message || 'Failed to load calendar data');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklySchedule = async () => {
    try {
      const weekStart = getWeekStart(selectedDate);
      const weekEnd = getWeekEnd(selectedDate);
      const weeklyData = await getWeeklySchedule(weekStart, weekEnd);
      setSelectedWeek(weeklyData);
    } catch (err) {
      console.error('Error loading weekly schedule:', err);
    }
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (date) => {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (demoMode) {
      alert('This is demo mode. In a real environment, this would save the period to the database.');
      setShowAddModal(false);
      setShowEditModal(false);
      return;
    }

    // Validate required fields
    if (!formData.allocated_subject || !formData.classroom) {
      alert('Please select both Allocated Subject and Classroom.');
      return;
    }

    try {
      // Prepare data for Django backend
      const periodData = {
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        allocated_subject: formData.allocated_subject, // AllocatedSubject ID
        classroom: formData.classroom // ClassRoom ID
        // Note: teacher will be auto-filled by Django from AllocatedSubject
      };

      if (editingPeriod) {
        await updatePeriod(editingPeriod.id, periodData);
        setShowEditModal(false);
      } else {
        await createPeriod(periodData);
        setShowAddModal(false);
      }
      setEditingPeriod(null);
      setFormData({
        day_of_week: 'Monday',
        start_time: '08:00',
        end_time: '09:00',
        allocated_subject: '',
        classroom: '',
        teacher: ''
      });
      loadCalendarData();
    } catch (err) {
      console.error('Error saving period:', err);
      if (err?.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert('Error saving period: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setFormData({
      day_of_week: period.day_of_week,
      start_time: period.start_time,
      end_time: period.end_time,
      allocated_subject: period.allocated_subject?.id || period.subject?.id || '',
      classroom: period.classroom?.id || '',
      teacher: period.teacher?.id || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (periodId) => {
    if (demoMode) {
      alert('This is demo mode. In a real environment, this would delete the period from the database.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this period?')) {
      try {
        await deletePeriod(periodId);
        loadCalendarData();
      } catch (err) {
        console.error('Error deleting period:', err);
        if (err?.response?.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert('Error deleting period: ' + (err.message || 'Unknown error'));
        }
      }
    }
  };

  const handleGenerateTimetable = async () => {
    if (demoMode) {
      alert('This is demo mode. In a real environment, this would generate a timetable using the backend algorithm.');
      return;
    }

    try {
      await generateTimetable();
      alert('Timetable generated successfully!');
      loadCalendarData();
    } catch (err) {
      console.error('Error generating timetable:', err);
      if (err?.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert('Error generating timetable: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const getPeriodForSlot = (day, time) => {
    return periods.find(period => 
      period.day_of_week === day && 
      period.start_time === time
    );
  };

  const handleRetry = () => {
    loadCalendarData();
  };

  const handleLoginRedirect = () => {
    // Redirect to login page or refresh token
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-3">Loading calendar data...</p>
      </div>
    );
  }

  if (error && !demoMode) {
    return (
      <div className="calendar-error-container text-center py-5">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>
          <h4 className="alert-heading">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Calendar Loading Error
          </h4>
          <p className="mb-3">{error}</p>
          
          {error.includes('Authentication failed') ? (
            <div>
              <button 
                className="btn btn-primary me-2"
                onClick={handleLoginRedirect}
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Go to Login
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleRetry}
              >
                <i className="fas fa-redo me-2"></i>
                Retry
              </button>
            </div>
          ) : (
            <div>
              <button 
                className="btn btn-primary me-2"
                onClick={handleRetry}
              >
                <i className="fas fa-redo me-2"></i>
                Retry
              </button>
              <button 
                className="btn btn-outline-info"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-sync me-2"></i>
                Refresh Page
              </button>
            </div>
          )}
          
          <hr />
          <p className="mb-0 small text-muted">
            If the problem persists, please contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="heading mb-0">School Timetable</h4>
        <div>
          {demoMode && (
            <div className="alert alert-warning d-inline-block me-3 mb-0 py-2 px-3">
              <i className="fas fa-info-circle me-2"></i>
              Demo Mode
            </div>
          )}
          <button 
            className="btn btn-primary me-2"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus me-2"></i>Add Period
          </button>
          <button 
            className="btn btn-success"
            onClick={handleGenerateTimetable}
          >
            <i className="fas fa-magic me-2"></i>Generate Timetable
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '120px' }}>Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="fw-bold text-center" style={{ backgroundColor: '#f8f9fa' }}>
                  {time}
                </td>
                {daysOfWeek.map(day => {
                  const period = getPeriodForSlot(day, time);
                  return (
                    <td key={`${day}-${time}`} className="text-center position-relative">
                      {period ? (
                        <div className="period-slot p-2" style={{ backgroundColor: '#e3f2fd' }}>
                          <div className="fw-bold small">{period.subject?.name || 'Unknown'}</div>
                          <div className="small text-muted">{period.classroom?.name || 'Unknown'}</div>
                          <div className="small text-muted">{period.teacher?.first_name} {period.teacher?.last_name}</div>
                          <div className="position-absolute top-0 end-0 p-1">
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEdit(period)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(period.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted small">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Period Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Period</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {demoMode && (
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      This is demo mode. Changes will not be saved to the database.
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Day of Week</label>
                        <select
                          name="day_of_week"
                          value={formData.day_of_week}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Classroom</label>
                        <select
                          name="classroom"
                          value={formData.classroom}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          <option value="">Select Classroom</option>
                          {classrooms.map(classroom => (
                            <option key={classroom.id} value={classroom.id}>
                              {classroom.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <select
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <select
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Allocated Subject</label>
                    <select
                      name="allocated_subject"
                      value={formData.allocated_subject}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Allocated Subject</option>
                      {allocatedSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      This will automatically assign the teacher and subject details
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Add Period</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Period Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Period</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {demoMode && (
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      This is demo mode. Changes will not be saved to the database.
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Day of Week</label>
                        <select
                          name="day_of_week"
                          value={formData.day_of_week}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Classroom</label>
                        <select
                          name="classroom"
                          value={formData.classroom}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          <option value="">Select Classroom</option>
                          {classrooms.map(classroom => (
                            <option key={classroom.id} value={classroom.id}>
                              {classroom.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <select
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <select
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Allocated Subject</label>
                    <select
                      name="allocated_subject"
                      value={formData.allocated_subject}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Allocated Subject</option>
                      {allocatedSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      This will automatically assign the teacher and subject details
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Update Period</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
