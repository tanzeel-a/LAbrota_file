import Link from 'next/link';

export default function Sidebar({ isOpen, onClose, teamList }) {
    const handleDragStart = (e, person) => {
        e.dataTransfer.setData('text/plain', person);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <aside id="sidebar" className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="header-row">
                    <h2>Team Roster</h2>
                    <button id="btn-close-sidebar" className="btn-icon" title="Close Sidebar" onClick={onClose}>×</button>
                </div>
                <p>Drag names to table</p>
            </div>
            <div id="team-list" className="team-list">
                {teamList.map(person => (
                    <Link
                        key={person}
                        href={`/profile?name=${encodeURIComponent(person)}`}
                        className="draggable-person"
                        draggable
                        onDragStart={(e) => handleDragStart(e, person)}
                    >
                        {person}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
