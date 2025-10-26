import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
// Import shared CSS
import '../TeacherDashboard.css';

// Mock Data (defined within this component)
const mockStudents = [
    { id: 101, name: 'Sara Lee' }, { id: 102, name: 'Espy Chen' }, { id: 103, name: 'Faith Kim' },
    { id: 104, name: 'Frodo Baggins' }, { id: 105, name: 'Bo Peep' }, { id: 106, name: 'Sven Reindeer' },
    { id: 107, name: 'Jessie Cowgirl' },
];
// Note: Events list might need to come from props/context if managed elsewhere
const initialEvents = [
    { id: 'event1', name: 'September Field Day 9/3' },
    { id: 'event2', name: 'HighView Orientation 9/17' },
    { id: 'event3', name: 'October PD: Communication 10/22' },
];

const AttendanceTab = () => {
    // We assume mockEvents comes from props or context if dynamic
    const [mockEvents, setMockEvents] = useState(initialEvents);
    const [selectedEvent, setSelectedEvent] = useState(mockEvents.length > 0 ? mockEvents[0].id : '');
    const [attendanceData, setAttendanceData] = useState(
      mockStudents.reduce((acc, student) => {
        acc[student.id] = 'present';
        return acc;
      }, {})
    );

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData(prevData => ({ ...prevData, [studentId]: status }));
    };

    const handleAddBonusPoints = (studentId) => {
        console.log(`Opening bonus points modal for student ${studentId}...`);
    };

    const handleSubmitAttendance = () => {
        console.log('Submitting attendance for event:', selectedEvent);
        console.log(attendanceData);
        alert('Attendance submitted successfully!');
    };

    return (
        <div className="attendance-tab">
            <Link to="/dashboard" className="back-button">
                &larr; Back to Dashboard Home
            </Link>

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
    );
};

export default AttendanceTab;