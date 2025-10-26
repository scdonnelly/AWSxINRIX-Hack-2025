import { useState } from 'react';
import { Link } from 'react-router-dom';
// Import shared CSS
import '../TeacherDashboard.css';

// Mock Data (defined within this component)
const mockStudents = [
    { id: 101, name: 'Sara Lee', attendance: '95%', points: 120, company: 'Adobe' },
    { id: 102, name: 'Espy Chen', attendance: '100%', points: 150, company: 'AWS' },
    { id: 103, name: 'Faith Kim', attendance: '85%', points: 80, company: 'DaVita' },
    { id: 104, name: 'Frodo Baggins', attendance: '90%', points: 110, company: 'IMA' },
    { id: 105, name: 'Bo Peep', attendance: '100%', points: 130, company: 'Adobe' },
    { id: 106, name: 'Sven Reindeer', attendance: '75%', points: 60, company: 'Accenture' },
    { id: 107, name: 'Jessie Cowgirl', attendance: '98%', points: 140, company: 'Guild' },
];

const LeaderboardTab = () => {
    const [leaderboardSortKey, setLeaderboardSortKey] = useState('points');

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
        <div className="leaderboard-tab">
            <Link to="/dashboard" className="back-button">
                &larr; Back to Dashboard Home
            </Link>

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
    );
};

export default LeaderboardTab;