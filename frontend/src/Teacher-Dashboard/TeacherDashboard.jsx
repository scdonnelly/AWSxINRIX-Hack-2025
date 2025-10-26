import './TeacherDashboard.css'; // We'll create this next

/**
 * Phase 2: The Teacher Dashboard (Route: /dashboard)
 * This is the main "hub" component with the 2-column layout.
 */
const TeacherDashboard = () => {
  return (
    <div className="dashboard-container">
      
      {/* --- 1. Left Column: Navigation Pane --- */}
      <div className="nav-pane">
        <h2 className="nav-title">My Dashboard</h2>
        {/* We'll add the "Create New Class" button and Class List here in the next step */}
        <p>(Navigation Pane)</p>
      </div>

      {/* --- 2. Right Column: Main Content Display --- */}
      <div className="content-pane">
        {/* We'll add the Top Bar and Tabs (Students, Attendence, etc.) here later */}
        <p>(Main Content Area)</p>
      </div>

    </div>
  );
};

export default TeacherDashboard;