'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { StorageService } from '@/utils/storage';

function ProfileContent() {
    const searchParams = useSearchParams();
    const name = searchParams.get('name');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (name) {
                const globalHistory = await StorageService.getHistory();
                const personHistory = globalHistory.filter(entry => entry.people.includes(name));
                personHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setHistory(personHistory);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [name]);

    if (!name) return <div className="main-content">Person Not Found</div>;
    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="container" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <header>
                <Link href="/" className="back-link">← Back to Dashboard</Link>
                <h1 id="profile-name">{name}</h1>
                <p>Task History</p>
            </header>

            <div className="history-section">
                <div className="table-container">
                    <table id="historyTable">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Team</th>
                            </tr>
                        </thead>
                        <tbody id="historyBody">
                            {history.length > 0 ? (
                                history.map((entry, index) => {
                                    const dateObj = new Date(entry.timestamp);
                                    return (
                                        <tr key={index}>
                                            <td>{entry.taskName}</td>
                                            <td>{dateObj.toLocaleDateString()}</td>
                                            <td>{dateObj.toLocaleTimeString()}</td>
                                            <td>{entry.people.join(', ')}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-muted" style={{ textAlign: 'center' }}>
                                        No history found for this person.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function Profile() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
