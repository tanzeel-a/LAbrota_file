export default function HistoryModal({ isOpen, onClose, history }) {
    if (!isOpen) return null;

    return (
        <div id="history-modal" className="modal show" onClick={(e) => { if (e.target.className.includes('modal')) onClose(); }}>
            <div className="modal-content">
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2>Roster Change Log</h2>
                <div id="roster-history-list" className="history-list">
                    {history.length === 0 ? (
                        <p className="text-muted">No changes recorded yet.</p>
                    ) : (
                        [...history].reverse().map((entry, index) => {
                            const date = new Date(entry.timestamp);
                            return (
                                <div key={index} className="history-item">
                                    <div className="history-time">{date.toLocaleDateString()} {date.toLocaleTimeString()}</div>
                                    <div>{entry.details}</div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
