import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom'; // Import Outlet and Link
import './TeacherDashboard.css';
import { FiSearch } from 'react-icons/fi'; // Only need FiSearch here now

// Note: Most state and handlers will move into the specific child components
const TeacherDashboard = () => {
  // State for the layout (sidebar, header, modal) remains here
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('Main Subject');
  const [classes, setClasses] = useState([
    { id: 1, name: 'Fall 2025 Cohort' },
    { id: 2, name: 'Spring 2026 Cohort' },
  ]);
  const [selectedClass, setSelectedClass] = useState(classes.length > 0 ? classes[0] : null);
  const [searchTerm, setSearchTerm] = useState(''); // Search might stay if it affects multiple tabs

  // Handlers related to the layout can stay
  const handleCreateClass = () => setIsModalOpen(true);

  const handleCreateSubmit = (event) => {
    event.preventDefault();
    const newClass = { id: Date.now(), name: newClassName };
    setClasses(prevClasses => {
        const updatedClasses = [...prevClasses, newClass];
        if (prevClasses.length === 0) {
            setSelectedClass(newClass);
        }
        return updatedClasses;
    });
    setIsModalOpen(false);
    setNewClassName('');
    setNewSubject('Main Subject');
  };

  return (
    <div className="dashboard-container">

      {/* --- Left Column: Navigation Pane --- */}
      <div className="nav-pane">
        {/* Link the logo back to the dashboard home */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
             <h1 className="nav-logo">HighView</h1>
        </Link>
        <button className="create-class-btn" onClick={handleCreateClass}>
          + Create New Class
        </button>
        <h3 className="class-list-title">Your Classes</h3>
        <div className="class-list">
          {classes.map((cls) => (
            <button
              key={cls.id}
              className={`class-list-item ${selectedClass && selectedClass.id === cls.id ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)} // Still just selects the class context
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
                       <FiSearch className="search-icon" />
                       <input
                           type="text"
                           placeholder="Search students..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                       />
                   </div>
               </div>
           )}
        </header>

        {/* --- Main Content Area - Renders the Matched Nested Route --- */}
        <main className="content-main">
          {selectedClass ? (
            <Outlet /> // Child route components (DashboardHome, StudentsTab, etc.) render here
          ) : (
             <div className="no-class-selected">
                 <h2>Welcome!</h2>
                 <p>Please select a class from the left sidebar or create a new one to get started.</p>
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