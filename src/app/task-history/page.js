'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { StorageService } from '@/utils/storage';

function TaskHistoryContent() {
    const searchParams = useSearchParams();
    const taskName = searchParams.get('task');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (taskName) {
                const globalHistory = await StorageService.getHistory();
                const taskHistory = globalHistory.filter(entry => entry.taskName === taskName);
                taskHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setHistory(taskHistory);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [taskName]);

    if (!taskName) return <div className="main-content">Task Not Found</div>;
    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="container" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <header>
                <Link href="/" className="back-link">← Back to Dashboard</Link>
                <h1 id="task-name">{taskName}</h1>
                <p>Completion Log</p>
            </header>

            <div className="history-section">
                <div className="table-container">
                    <table id="historyTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Completed By</th>
                            </tr>
                        </thead>
                        <tbody id="historyBody">
                            {history.length > 0 ? (
                                history.map((entry, index) => {
                                    const dateObj = new Date(entry.timestamp);
                                    return (
                                        <tr key={index}>
                                            <td>{dateObj.toLocaleDateString()}</td>
                                            <td>{dateObj.toLocaleTimeString()}</td>
                                            <td>{entry.people.join(', ')}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-muted" style={{ textAlign: 'center' }}>
                                        No history found for this task.
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

export default function TaskHistory() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TaskHistoryContent />
        </Suspense>
    );
}
