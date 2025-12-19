'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskTable from '@/components/TaskTable';
import RosterEditor from '@/components/RosterEditor';
import HistoryModal from '@/components/HistoryModal';
import { TASKS, STANDARD_TEAM, INITIAL_STATE_CONFIG } from '@/utils/data';

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [state, setState] = useState({});
    const [globalHistory, setGlobalHistory] = useState([]);
    const [customRoster, setCustomRoster] = useState(null);
    const [rosterHistory, setRosterHistory] = useState([]);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load state from localStorage
    useEffect(() => {
        const loadState = () => {
            const storedState = JSON.parse(localStorage.getItem('labTaskState'));
            const storedHistory = JSON.parse(localStorage.getItem('labTaskHistory')) || [];
            const storedCustomRoster = JSON.parse(localStorage.getItem('labTaskCustomRoster'));
            const storedRosterHistory = JSON.parse(localStorage.getItem('labTaskRosterHistory')) || [];

            setGlobalHistory(storedHistory);
            setCustomRoster(storedCustomRoster);
            setRosterHistory(storedRosterHistory);

            if (!storedState) {
                const newState = {};
                TASKS.forEach((task, index) => {
                    // Apply custom roster logic if needed
                    let currentTaskRoster = task.roster;
                    if (storedCustomRoster) {
                        const specialTasks = ["200ul tip filling", "10ul tip filling", "Thrombin", "FPLC column wash with 0.5M NaOH (once/month)", "Computer area cleaning"];
                        if (!specialTasks.includes(task.name)) {
                            currentTaskRoster = [...storedCustomRoster];
                        }
                    }

                    const config = INITIAL_STATE_CONFIG[index];
                    if (config) {
                        const currentIndex = currentTaskRoster.indexOf(config.current);
                        const skipIndices = config.skips.map(name => currentTaskRoster.indexOf(name)).filter(i => i !== -1);

                        newState[index] = {
                            currentIndex: currentIndex !== -1 ? currentIndex : 0,
                            skips: skipIndices,
                            extras: []
                        };
                    } else {
                        newState[index] = {
                            currentIndex: 0,
                            skips: [],
                            extras: []
                        };
                    }
                });
                setState(newState);
                localStorage.setItem('labTaskState', JSON.stringify(newState));
            } else {
                setState(storedState);
            }
            setIsLoaded(true);
        };

        loadState();
    }, []);

    // Save state helper
    const saveState = (newState, newHistory) => {
        setState(newState);
        localStorage.setItem('labTaskState', JSON.stringify(newState));
        if (newHistory) {
            setGlobalHistory(newHistory);
            localStorage.setItem('labTaskHistory', JSON.stringify(newHistory));
        }
    };

    const getTaskRoster = (task) => {
        if (customRoster) {
            const specialTasks = ["200ul tip filling", "10ul tip filling", "Thrombin", "FPLC column wash with 0.5M NaOH (once/month)", "Computer area cleaning"];
            if (!specialTasks.includes(task.name)) {
                return customRoster;
            }
        }
        return task.roster;
    };

    // Prepare tasks with correct roster
    const tasksWithRoster = TASKS.map(task => ({
        ...task,
        roster: getTaskRoster(task)
    }));

    // Sidebar Logic
    const teamList = (() => {
        const allPeopleSet = new Set();
        tasksWithRoster.forEach(task => {
            task.roster.forEach(p => allPeopleSet.add(p));
        });
        return Array.from(allPeopleSet).sort();
    })();

    const handleDrop = (taskIndex, personName, type) => {
        const task = tasksWithRoster[taskIndex];
        const personIndex = task.roster.indexOf(personName);

        if (personIndex === -1) {
            alert(`"${personName}" is not in the roster for this task.`);
            return;
        }

        const newState = { ...state };
        const taskState = { ...newState[taskIndex] };

        if (type === 'blue') {
            if (taskState.currentIndex === personIndex) return;
            if (!taskState.extras.includes(personIndex)) {
                taskState.extras = [...taskState.extras, personIndex];
            }
            taskState.skips = taskState.skips.filter(i => i !== personIndex);
        } else if (type === 'red') {
            if (!taskState.skips.includes(personIndex)) {
                taskState.skips = [...taskState.skips, personIndex];
            }
            taskState.extras = taskState.extras.filter(i => i !== personIndex);

            if (taskState.currentIndex === personIndex) {
                // Advance logic
                const rosterLength = task.roster.length;
                let nextIndex = (taskState.currentIndex + 1) % rosterLength;
                let attempts = 0;

                let tempSkips = [...taskState.skips];

                while (tempSkips.includes(nextIndex) && attempts < rosterLength) {
                    tempSkips = tempSkips.filter(i => i !== nextIndex);
                    nextIndex = (nextIndex + 1) % rosterLength;
                    attempts++;
                }
                taskState.skips = tempSkips;
                taskState.currentIndex = nextIndex;
            }
        }

        newState[taskIndex] = taskState;
        saveState(newState);
    };

    const advanceCurrentPerson = (taskIndex, currentState) => {
        const taskState = { ...currentState[taskIndex] };
        const rosterLength = tasksWithRoster[taskIndex].roster.length;

        let nextIndex = (taskState.currentIndex + 1) % rosterLength;
        let attempts = 0;

        while (taskState.skips.includes(nextIndex) && attempts < rosterLength) {
            taskState.skips = taskState.skips.filter(i => i !== nextIndex);
            nextIndex = (nextIndex + 1) % rosterLength;
            attempts++;
        }

        taskState.currentIndex = nextIndex;
        return taskState;
    };

    const handleMarkDone = (taskIndex) => {
        const task = tasksWithRoster[taskIndex];
        const taskState = state[taskIndex];

        const currentPerson = task.roster[taskState.currentIndex];
        const extraPeople = taskState.extras.map(i => task.roster[i]);
        const allDoers = [currentPerson, ...extraPeople];

        const timestamp = new Date().toISOString();
        const newHistory = [...globalHistory, {
            taskName: task.name,
            people: allDoers,
            timestamp: timestamp
        }];

        let newState = { ...state };
        let newTaskState = advanceCurrentPerson(taskIndex, newState);
        newTaskState.extras = []; // Clear extras

        newState[taskIndex] = newTaskState;
        saveState(newState, newHistory);
    };

    const handleRemoveSkip = (taskIndex, personName) => {
        const task = tasksWithRoster[taskIndex];
        const personIndex = task.roster.indexOf(personName);
        if (personIndex !== -1) {
            const newState = { ...state };
            newState[taskIndex].skips = newState[taskIndex].skips.filter(i => i !== personIndex);
            saveState(newState);
        }
    };

    const handleRemoveExtra = (taskIndex, personName) => {
        const task = tasksWithRoster[taskIndex];
        const personIndex = task.roster.indexOf(personName);
        if (personIndex !== -1) {
            const newState = { ...state };
            newState[taskIndex].extras = newState[taskIndex].extras.filter(i => i !== personIndex);
            saveState(newState);
        }
    };

    const handleSaveRoster = (newRoster) => {
        localStorage.setItem('labTaskCustomRoster', JSON.stringify(newRoster));

        const logEntry = {
            timestamp: new Date().toISOString(),
            details: `Roster updated. New count: ${newRoster.length}. Names: ${newRoster.join(', ')}`
        };
        const newRosterHistory = [...rosterHistory, logEntry];
        setRosterHistory(newRosterHistory);
        localStorage.setItem('labTaskRosterHistory', JSON.stringify(newRosterHistory));

        alert("Roster saved! The page will reload to apply changes.");
        window.location.reload();
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="app-container">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                teamList={teamList}
            />

            <main id="main-content" className="main-content">
                <header>
                    <div className="main-header-row">
                        {!sidebarOpen && (
                            <button
                                id="btn-show-sidebar"
                                className="btn btn-clear"
                                onClick={() => setSidebarOpen(true)}
                            >
                                Show Roster
                            </button>
                        )}
                        <h1>Lab Task Manager</h1>
                    </div>
                    <p>Drag and drop people to assign or skip.</p>
                </header>

                <div className="status-section">
                    <TaskTable
                        tasks={tasksWithRoster}
                        state={state}
                        onDrop={handleDrop}
                        onRemoveSkip={handleRemoveSkip}
                        onRemoveExtra={handleRemoveExtra}
                        onMarkDone={handleMarkDone}
                    />
                </div>

                <RosterEditor
                    currentRoster={customRoster || STANDARD_TEAM}
                    onSave={handleSaveRoster}
                    onViewHistory={() => setHistoryModalOpen(true)}
                />
            </main>

            <HistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={rosterHistory}
            />
        </div>
    );
}
