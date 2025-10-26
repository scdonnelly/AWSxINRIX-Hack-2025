import { useState } from 'react';
import './TeacherDashboard.css';
// 1. IMPORT THE NEW ICON
import { FiUsers, FiClipboard, FiBarChart2, FiCheckSquare, FiPlusCircle } from 'react-icons/fi'; 

const TeacherDashboard = () => {
  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('Main Subject');
  const [classes, setClasses] = useState([
    { id: 1, name: 'Fall 2025 Cohort' },
    { id: 2, name: 'Spring 2026 Cohort' },
  ]);
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [activeTab, setActiveTab] = useState('home');
  const [companyFilter, setCompanyFilter] = useState('all');

  // --- UPDATED: Mock Data with Company ---
  const mockStudents = [
    { id: 101, name: 'Sara Lee', attendance: '95%', points: 120, company: 'Adobe' },
    { id: 102, name: 'Espy Chen', attendance: '100%', points: 150, company: 'AWS' },
    { id: 103, name: 'Faith Kim', attendance: '85%', points: 80, company: 'DaVita' },
    { id: 104, name: 'Frodo Baggins', attendance: '90%', points: 110, company: 'IMA' },
    { id: 105, name: 'Bo Peep', attendance: '100%', points: 130, company: 'Adobe' },
    { id: 106, name: 'Sven Reindeer', attendance: '75%', points: 60, company: 'Accenture' },
    { id: 107, name: 'Jessie Cowgirl', attendance: '98%', points: 140, company: 'Guild' },
  ];
  
  const companyList = [...new Set(mockStudents.map(s => s.company))].sort();

  // --- 2. NEW: MOCK DATA & STATE FOR ATTENDANCE ---
  const mockEvents = [
    { id: 'event1', name: 'September Field Day 9/3' },
    { id: 'event2', name: 'HighView Orientation 9/17' },
    { id: 'event3', name: 'October PD: Communication 10/22' },
  ];

  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0].id); // Default to first event
  
  // Create an initial state for attendance. e.g., { 101: 'present', 102: 'present', ... }
  const [attendanceData, setAttendanceData] = useState(
    mockStudents.reduce((acc, student) => {
      acc[student.id] = 'present'; // Default everyone to 'present'
      return acc;
    }, {})
  );

  // --- Handlers ---
  const handleCreateClass = () => setIsModalOpen(true);

  const handleCreateSubmit = (event) => {
    event.preventDefault();
    const newClass = { id: classes.length + 1, name: newClassName };
    setClasses([...classes, newClass]);
    setSelectedClass(newClass);
    setIsModalOpen(false);
    setNewClassName('');
    setNewSubject('Main Subject');
  };

  // --- 3. NEW: HANDLERS FOR ATTENDANCE PAGE ---
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prevData => ({
      ...prevData,
      [studentId]: status,
    }));
  };

  const handleAddBonusPoints = (studentId) => {
    // We'll wire this up to a modal later
    console.log(`Opening bonus points modal for student ${studentId}...`);
  };

  const handleSubmitAttendance = () => {
    // In a real app, you'd send this data to your backend
    console.log('Submitting attendance for event:', selectedEvent);
    console.log(attendanceData);
    alert('Attendance submitted successfully!'); // Simple confirmation
  };

  return (
    <div className="dashboard-container">
      
      {/* --- Left Column: Navigation Pane (No changes) --- */}
      <div className="nav-pane">
        <h1 className="nav-logo">HighView</h1>
        <button className="create-class-btn" onClick={handleCreateClass}>
          + Create New Class
        </button>
        <h3 className="class-list-title">Your Classes</h3>
        <div className="class-list">
          {classes.map((cls) => (
            <button
              key={cls.id}
              className={`class-list-item ${selectedClass.id === cls.id ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- Right Column: Main Content Display (No changes) --- */}
      <div className="content-pane">
        
        <header className="content-header">
          <div className="header-left">
            <h2 className="header-title">{selectedClass.name}</h2>
            <div className="join-code">
              <span>Join Code: SCU-2025</span>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input type="text" placeholder="Search students..." />
            </div>
          </div>
        </header>
        
        <main className="content-main">
          
          {/* --- Home Hub (No changes) --- */}
          {activeTab === 'home' && (
            <div className="dashboard-hub">
              <button 
                className="hub-button" 
                onClick={() => setActiveTab('students')}
              >
                <FiUsers size={40} />
                <span>Manage Students</span>
              </button>
              <button 
                className="hub-button" 
                onClick={() => setActiveTab('attendance')}
              >
                <FiCheckSquare size={40} />
                <span>Take Attendance</span>
              </button>
              <button 
                className="hub-button" 
                onClick={() => setActiveTab('leaderboard')}
              >
                <FiBarChart2 size={40} />
                <span>View Leaderboard</span>
              </button>
              <button 
                className="hub-button" 
                onClick={() => setActiveTab('events')}
              >
                <FiClipboard size={40} />
                <span>Manage Events</span>
              </button>
            </div>
          )}

          {/* --- Students Tab (No changes) --- */}
          {activeTab === 'students' && (
            <div className="students-tab">
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>

              <div className="student-tab-header">
                <h3>Student Roster</h3>
                <div className="filter-group">
                  <label htmlFor="companyFilter">Filter by Company:</label>
                  <select 
                    id="companyFilter" 
                    value={companyFilter} 
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  >
                    <option value="all">All Companies</option>
                    {companyList.map(company => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Attendance %</th>
                    <th>Bonus Points</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents
                    .filter(student => 
                      companyFilter === 'all' || student.company === companyFilter
                    )
                    .map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.company}</td>
                        <td>{student.attendance}</td>
                        <td>{student.points}</td>
                        <td>
                          <button className="action-button remove">
                            Remove Student
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- 4. UPDATED: Attendance Tab --- */}
          {activeTab === 'attendance' && (
            <div className="attendance-tab">
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>
              
              <div className="attendance-header">
                <h2>Take Attendance</h2>
                <div className="filter-group">
                  <label htmlFor="eventFilter">Select Event:</label>
                  <select 
                    id="eventFilter" 
                    value={selectedEvent} 
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    {mockEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <table className="students-table attendance-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Attendance Status</th>
                    <th>Add Bonus Points</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student) => (
                    <tr key={student.id}>
                      {/* --- Student Name --- */}
                      <td>{student.name}</td>
                      
                      {/* --- Attendance Dropdown --- */}
                      <td>
                        <select
                          className="attendance-dropdown"
                          value={attendanceData[student.id]}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          // This applies the color class based on the value
                          data-status={attendanceData[student.id]}
                        >
                          <option value="present">Present</option>
                          <option value="excused">Excused Absence</option>
                          <option value="unexcused">Unexcused Absence</option>
                        </select>
                      </td>
                      
                      {/* --- Bonus Points Button --- */}
                      <td>
                        <button 
                          className="action-button bonus"
                          onClick={() => handleAddBonusPoints(student.id)}
                        >
                          <FiPlusCircle /> Add Points
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button className="submit-attendance-btn" onClick={handleSubmitAttendance}>
                Submit Attendance
              </button>

            </div>
          )}

          {/* --- Other Tab Placeholders (No changes) --- */}
          {activeTab === 'leaderboard' && (
            <div>
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>
              <h2>Leaderboard Content</h2>
              <p>This is where the leaderboard will go.</p>
            </div>
          )}
          {activeTab === 'events' && (
            <div>
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>
              <h2>Events Content</h2>
              <p>This is where the events page will go.</p>
            </div>
          )}

        </main>
      </div>

      {/* --- Create Class Modal (No changes) --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Class</h2>
            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="modal-form-group">
                <label htmlFor="className">Class Name</label>
                <input
                  type="text"
                  id="className"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., 'Fall 2025 Cohort'"
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                >
                  <optgroup label="Main Subjects">
                    <option value="Main Subject">Main Subject</option>
                    <option value="SAT Prep">SAT Prep</option>
                    <option value="Writing">Writing</option>
                  </optgroup>
                  <optgroup label="Electives">
                    <option value="Career Skills">Career Skills</option>
                    <option value="Computer Science">Computer Science</option>
                  </optgroup>
                </select>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-button secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-button primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* --- REMOVED: Health Note Modal --- */}
    </div>
  );
};

export default TeacherDashboard;