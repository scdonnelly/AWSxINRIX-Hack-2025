import { Link } from 'react-router-dom';
import { FiUsers, FiClipboard, FiBarChart2, FiCheckSquare } from 'react-icons/fi';
// Import the shared CSS - adjust path if needed
import '../TeacherDashboard.css';

const DashboardHome = () => {
  return (
    <div className="dashboard-hub">
      {/* Links now go to specific routes */}
      <Link to="students" className="hub-button">
        <FiUsers size={40} />
        <span>Manage Students</span>
      </Link>
      <Link to="attendance" className="hub-button">
        <FiCheckSquare size={40} />
        <span>Take Attendance</span>
      </Link>
      <Link to="leaderboard" className="hub-button">
        <FiBarChart2 size={40} />
        <span>View Leaderboard</span>
      </Link>
      <Link to="events" className="hub-button">
        <FiClipboard size={40} />
        <span>Manage Events</span>
      </Link>
    </div>
  );
};

export default DashboardHome;