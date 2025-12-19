import { useState, useEffect } from 'react';

export default function RosterEditor({ currentRoster, onSave, onViewHistory }) {
    const [rosterText, setRosterText] = useState('');

    useEffect(() => {
        if (currentRoster) {
            setRosterText(currentRoster.join(', '));
        }
    }, [currentRoster]);

    const handleSave = () => {
        const newRoster = rosterText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (newRoster.length === 0) {
            alert("Roster cannot be empty.");
            return;
        }
        onSave(newRoster);
    };

    return (
        <div className="roster-editor-section">
            <h3>Roster Configuration</h3>
            <p>Edit the Standard Team list below. Changes will be saved to history.</p>
            <textarea
                id="roster-editor"
                rows="5"
                placeholder="Enter names separated by commas..."
                value={rosterText}
                onChange={(e) => setRosterText(e.target.value)}
            ></textarea>
            <div className="editor-controls">
                <button id="btn-save-roster" className="btn btn-blue" onClick={handleSave}>Save Roster</button>
                <button id="btn-view-history" className="btn btn-clear" onClick={onViewHistory}>View Change Log</button>
            </div>
        </div>
    );
}
