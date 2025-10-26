import { useState } from 'react';
import { Link } from 'react-router-dom';
// Import shared CSS
import '../TeacherDashboard.css';

// Note: Events list might need to come from props or context if shared
const initialEvents = [
    { id: 'event1', name: 'September Field Day 9/3' },
    { id: 'event2', name: 'HighView Orientation 9/17' },
    { id: 'event3', name: 'October PD: Communication 10/22' },
];

const EventsTab = () => {
    // We assume mockEvents comes from props or context if dynamic
    const [mockEvents, setMockEvents] = useState(initialEvents);
    const [newEventName, setNewEventName] = useState('');

    const handleAddEvent = (event) => {
        event.preventDefault();
        if (!newEventName.trim()) return;

        const newEvent = {
            id: `event-${Date.now()}`,
            name: newEventName.trim(),
        };

        setMockEvents(prevEvents => [...prevEvents, newEvent]);
        setNewEventName('');
        alert(`Event "${newEvent.name}" added successfully!`);
        // In a real app, you might also update the shared event state here
    };

    return (
        <div className="events-tab">
            <Link to="/dashboard" className="back-button">
                &larr; Back to Dashboard Home
            </Link>
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
        </div>
    );
};

export default EventsTab;