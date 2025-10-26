import { useState } from 'react';
import './TeacherDashboard.css';
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
    const [selectedClass, setSelectedClass] = useState(classes.length > 0 ? classes[0] : null); // Handle empty initial classes
    const [activeTab, setActiveTab] = useState('home');
    const [companyFilter, setCompanyFilter] = useState('all');

    // --- Mock Data ---
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

    // --- Events State ---
    const [mockEvents, setMockEvents] = useState([
        { id: 'event1', name: 'September Field Day 9/3' },
        { id: 'event2', name: 'HighView Orientation 9/17' },
        { id: 'event3', name: 'October PD: Communication 10/22' },
    ]);

    // --- Attendance State ---
    const [selectedEvent, setSelectedEvent] = useState(mockEvents.length > 0 ? mockEvents[0].id : '');
    const [attendanceData, setAttendanceData] = useState(
        mockStudents.reduce((acc, student) => {
            acc[student.id] = 'present';
            return acc;
        }, {})
    );

    // --- Leaderboard State ---
    const [leaderboardSortKey, setLeaderboardSortKey] = useState('points');

    // --- State for the "Add Event" input ---
    const [newEventName, setNewEventName] = useState('');

    // --- Handlers ---
    const handleCreateClass = () => setIsModalOpen(true);

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        const newClass = { id: Date.now(), name: newClassName };
        setClasses(prevClasses => {
            const updatedClasses = [...prevClasses, newClass];
            // If this is the first class added, select it
            if (prevClasses.length === 0) {
                setSelectedClass(newClass);
            }
            return updatedClasses;
        });
        setIsModalOpen(false);
        setNewClassName('');
        setNewSubject('Main Subject');
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData(prevData => ({
            ...prevData,
            [studentId]: status,
        }));
    };

    const handleAddBonusPoints = (studentId) => {
        console.log(`Opening bonus points modal for student ${studentId}...`);
    };

    const handleSubmitAttendance = () => {
        console.log('Submitting attendance for event:', selectedEvent);
        console.log(attendanceData);
        alert('Attendance submitted successfully!');
    };

    const handleAddEvent = (event) => {
        event.preventDefault();
        if (!newEventName.trim()) return;

        const newEvent = {
            id: `event-${Date.now()}`,
            name: newEventName.trim(),
        };

        setMockEvents(prevEvents => {
            const updatedEvents = [...prevEvents, newEvent];
            if (prevEvents.length === 0) {
                setSelectedEvent(newEvent.id);
            }
            return updatedEvents;
        });
        setNewEventName('');
        alert(`Event "${newEvent.name}" added successfully!`);
    };

    // --- Leaderboard Sorting Logic ---
    const sortedStudents = mockStudents.slice().sort((a, b) => {
        if (leaderboardSortKey === 'points') {
            return b.points - a.points;
        }
        if (leaderboardSortKey === 'attendance') {
            return parseFloat(b.attendance) - parseFloat(a.attendance);
        }
        return 0;
    });

    return (
        <div className="dashboard-container">

            {/* --- Left Column: Navigation Pane --- */}
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
                            className={`class-list-item ${selectedClass && selectedClass.id === cls.id ? 'active' : ''}`}
                            onClick={() => setSelectedClass(cls)}
                        >
                            {cls.name}
                        </button>
                    ))}
                    {classes.length === 0 && <p className="no-classes-message">No classes yet. Create one!</p>}
                </div>
            </div>

            {/* --- Right Column: Main Content Display --- */}
            <div className="content-pane">

                <header className="content-header">
                    <div className="header-left">
                        <h2 className="header-title">{selectedClass ? selectedClass.name : "No Class Selected"}</h2>
                        {selectedClass && (
                            <div className="join-code">
                                <span>Join Code: SCU-2025</span>
                            </div>
                        )}
                    </div>
                    {selectedClass && (
                        <div className="header-right">
                            <div className="search-bar">
                                <input type="text" placeholder="Search students..." />
                            </div>
                        </div>
                    )}
                </header>

                <main className="content-main">

                    {/* Show hub only if a class is selected */}
                    {selectedClass && activeTab === 'home' && (
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

                    {/* Show message if no class is selected */}
                    {!selectedClass && (
                        <div className="no-class-selected">
                            <h2>Welcome!</h2>
                            <p>Please select a class from the left sidebar or create a new one to get started.</p>
                        </div>
                    )}


                    {/* --- Students Tab --- */}
                    {selectedClass && activeTab === 'students' && (
                        <div className="students-tab">
                           <button className="back-button" onClick={() => setActiveTab('home')}>
                                &larr; Back to Dashboard Home
                            </button>
                            {/* ... (rest of students tab is the same) ... */}
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

                    {/* --- Attendance Tab --- */}
                    {selectedClass && activeTab === 'attendance' && (
                         <div className="attendance-tab">
                           <button className="back-button" onClick={() => setActiveTab('home')}>
                             &larr; Back to Dashboard Home
                           </button>
                           {/* ... (rest of attendance tab is the same) ... */}
                            <div className="attendance-header">
                                <h2>Take Attendance</h2>
                                <div className="filter-group">
                                <label htmlFor="eventFilter">Select Event:</label>
                                <select
                                    id="eventFilter"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    disabled={mockEvents.length === 0}
                                >
                                    {mockEvents.length === 0 ? (
                                        <option>No events created yet</option>
                                    ) : (
                                        mockEvents.map(event => (
                                        <option key={event.id} value={event.id}>
                                            {event.name}
                                        </option>
                                        ))
                                    )}
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
                                    <td>{student.name}</td>
                                    <td>
                                        <select
                                        className="attendance-dropdown"
                                        value={attendanceData[student.id]}
                                        onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                                        data-status={attendanceData[student.id]}
                                        disabled={mockEvents.length === 0}
                                        >
                                        <option value="present">Present</option>
                                        <option value="excused">Excused Absence</option>
                                        <option value="unexcused">Unexcused Absence</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                        className="action-button bonus"
                                        onClick={() => handleAddBonusPoints(student.id)}
                                        disabled={mockEvents.length === 0}
                                        >
                                        <FiPlusCircle /> Add Points
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <button
                                className="submit-attendance-btn"
                                onClick={handleSubmitAttendance}
                                disabled={mockEvents.length === 0}
                            >
                                Submit Attendance
                            </button>
                        </div>
                    )}

                    {/* --- Leaderboard Tab --- */}
                    {selectedClass && activeTab === 'leaderboard' && (
                        <div className="leaderboard-tab">
                            <button className="back-button" onClick={() => setActiveTab('home')}>
                                &larr; Back to Dashboard Home
                            </button>
                           {/* ... (rest of leaderboard tab is the same) ... */}
                            <div className="leaderboard-header">
                                <h2>Student Leaderboard</h2>
                                <div className="filter-group">
                                <label htmlFor="leaderboardSort">Rank by:</label>
                                <select
                                    id="leaderboardSort"
                                    value={leaderboardSortKey}
                                    onChange={(e) => setLeaderboardSortKey(e.target.value)}
                                >
                                    <option value="points">Bonus Points</option>
                                    <option value="attendance">Attendance %</option>
                                </select>
                                </div>
                            </div>
                            <table className="students-table leaderboard-table">
                                <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th className={leaderboardSortKey === 'attendance' ? 'sorted-by' : ''}>
                                    Attendance %
                                    </th>
                                    <th className={leaderboardSortKey === 'points' ? 'sorted-by' : ''}>
                                    Bonus Points
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {sortedStudents.map((student, index) => (
                                    <tr key={student.id}>
                                    <td className="rank-cell">{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.company}</td>
                                    <td className={leaderboardSortKey === 'attendance' ? 'sorted-by' : ''}>
                                        {student.attendance}
                                    </td>
                                    <td className={leaderboardSortKey === 'points' ? 'sorted-by' : ''}>
                                        {student.points}
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- UPDATED: Events Tab (Added current events list back) --- */}
                    {selectedClass && activeTab === 'events' && (
                        <div className="events-tab">
                            <button className="back-button" onClick={() => setActiveTab('home')}>
                                &larr; Back to Dashboard Home
                            </button>
                            <h2>Manage Events</h2>

                            <form className="add-event-form" onSubmit={handleAddEvent}>
                                <input
                                    type="text"
                                    className="add-event-input"
                                    placeholder="Enter new event name (e.g., 'Workshop 11/5')"
                                    value={newEventName}
                                    onChange={(e) => setNewEventName(e.target.value)}
                                    required
                                />
                                <button type="submit" className="add-event-button">
                                    Add Event
                                </button>
                            </form>

                            {/* --- ADDED THIS BACK --- */}
                            <div className="current-events-list">
                                <h3>Current Events</h3>
                                {mockEvents.length > 0 ? (
                                    <ul>
                                        {mockEvents.map(event => (
                                            <li key={event.id}>{event.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No events added yet.</p>
                                )}
                            </div>
                            {/* --- END OF ADDED SECTION --- */}
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

        </div>
    );
};

export default TeacherDashboard;