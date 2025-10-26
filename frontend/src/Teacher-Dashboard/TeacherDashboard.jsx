import { useState } from 'react';
import './TeacherDashboard.css';
// 1. UPDATED ICON IMPORT
import { FiFileText, FiUsers, FiClipboard, FiBarChart2, FiCheckSquare } from 'react-icons/fi'; 

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
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  // --- Mock Data ---
  const mockStudents = [
    { id: 101, name: 'Sara Lee', attendance: '95%', points: 120, notes: 'Peanut allergy. EpiPen in bag.' },
    { id: 102, name: 'Espy Chen', attendance: '100%', points: 150, notes: '' }, // No note
    { id: 103, name: 'Faith Kim', attendance: '85%', points: 80, notes: 'Needs extra time on tests (per 504 plan).' },
  ];

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

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleCloseNote = () => {
    setIsNoteModalOpen(false);
    setSelectedNote('');
  };

  return (
    <div className="dashboard-container">
      
      {/* --- 1. Left Column: Navigation Pane --- */}
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

      {/* --- 2. Right Column: Main Content Display --- */}
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
          
          {/* --- Home Hub (Big Buttons) --- */}
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
              {/* --- 2. THIS BUTTON IS NOW "EVENTS" --- */}
              <button 
                className="hub-button" 
                onClick={() => setActiveTab('events')}
              >
                <FiClipboard size={40} />
                <span>Manage Events</span>
              </button>
            </div>
          )}

          {/* --- Students Tab --- */}
          {activeTab === 'students' && (
            <div className="students-tab">
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>
              <h3>Student Roster</h3>
              <table className="students-table">
                {/* ... (table code is unchanged) ... */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Attendance %</th>
                    <th>Bonus Points</th>
                    <th>Health Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.attendance}</td>
                      <td>{student.points}</td>
                      <td>
                        {student.notes ? (
                          <button 
                            className="action-button note"
                            onClick={() => handleOpenNote(student.notes)}
                          >
                            <FiFileText /> View Note
                          </button>
                        ) : (
                          <span className="no-note">—</span>
                        )}
                      </td>
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

          {/* --- Other Tab Placeholders --- */}
          {activeTab === 'attendance' && (
            <div>
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>
              <h2>Attendance Content</h2>
              <p>This is where the attendance form will go.</p>
            </div>
          )}
          {activeTab === 'leaderboard' && (
            <div>
              <button className="back-button" onClick={() => setActiveTab('home')}>
                &larr; Back to Dashboard Home
              </button>
              <h2>Leaderboard Content</h2>
              <p>This is where the leaderboard will go.</p>
            </div>
          )}
          {/* --- 3. THIS PLACEHOLDER IS NOW "EVENTS" --- */}
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

      {/* --- Create Class Modal --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Class</h2>
            <form onSubmit={handleCreateSubmit} className="modal-form">
              {/* ... (rest of modal form is unchanged) ... */}
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
      
      {/* --- Health Note Modal --- */}
      {isNoteModalOpen && (
        <div className="modal-overlay" onClick={handleCloseNote}>
          <div className="modal-content note-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Student Health Note</h2>
            <p className="note-content">{selectedNote}</p>
            <div className="modal-buttons">
              <button
                type="button"
                className="modal-button primary"
                onClick={handleCloseNote}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;