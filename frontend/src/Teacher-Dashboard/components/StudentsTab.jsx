import { useState } from 'react';
import { Link } from 'react-router-dom';
// Import shared CSS
import '../TeacherDashboard.css';

// Mock Data (defined within this component now)
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


const StudentsTab = () => {
  const [companyFilter, setCompanyFilter] = useState('all');
  // You might need to get searchTerm via props or context if shared
  const searchTerm = ''; // Placeholder - search won't work yet unless passed down

  // Filter logic
   const filteredStudents = mockStudents.filter(student => {
     const companyMatch = companyFilter === 'all' || student.company === companyFilter;
     const searchMatch = !searchTerm || student.name.toLowerCase().includes(searchTerm.toLowerCase());
     return companyMatch && searchMatch;
   });

  const handleRemoveStudent = (studentId) => {
      // Add logic later
      console.log(`Removing student ${studentId}`);
      alert(`Simulating removal of student ${studentId}`);
  }

  return (
    <div className="students-tab">
      {/* Use Link for Back button */}
      <Link to="/dashboard" className="back-button">
        &larr; Back to Dashboard Home
      </Link>

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
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.company}</td>
              <td>{student.attendance}</td>
              <td>{student.points}</td>
              <td>
                <button
                  className="action-button remove"
                  onClick={() => handleRemoveStudent(student.id)}
                 >
                  Remove Student
                </button>
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
             <tr>
                 <td colSpan="5" className="no-results-message">No students match your filter criteria.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTab;