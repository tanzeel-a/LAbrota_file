import Link from 'next/link';

export default function TaskTable({ tasks, state, onDrop, onRemoveSkip, onRemoveExtra, onMarkDone }) {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, taskIndex, type) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const personName = e.dataTransfer.getData('text/plain');
        onDrop(taskIndex, personName, type);
    };

    return (
        <div className="table-container">
            <table id="statusTable">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Next In Charge (Blue)</th>
                        <th>Skipped (Red)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => {
                        const taskState = state[index];
                        if (!taskState) return null;

                        const currentPerson = task.roster[taskState.currentIndex];

                        return (
                            <tr key={task.name}>
                                <td>
                                    <Link href={`/task-history?task=${encodeURIComponent(task.name)}`} className="task-link">
                                        {task.name}
                                    </Link>
                                </td>
                                <td
                                    className="drop-zone drop-zone-blue"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index, 'blue')}
                                >
                                    <span className="badge-blue">{currentPerson}</span>
                                    {taskState.extras.map(extraIndex => {
                                        const personName = task.roster[extraIndex];
                                        return (
                                            <span key={personName} className="badge-blue badge-extra">
                                                {personName} <span className="remove-x" onClick={() => onRemoveExtra(index, personName)}>×</span>
                                            </span>
                                        );
                                    })}
                                </td>
                                <td
                                    className="drop-zone drop-zone-red"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index, 'red')}
                                >
                                    {taskState.skips.length > 0 ? (
                                        taskState.skips.map(skipIndex => {
                                            const personName = task.roster[skipIndex];
                                            return (
                                                <span key={personName} className="badge-red">
                                                    {personName} <span className="remove-x" onClick={() => onRemoveSkip(index, personName)}>×</span>
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-muted">-</span>
                                    )}
                                </td>
                                <td>
                                    <button className="btn-done" onClick={() => onMarkDone(index)}>Mark Done</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
