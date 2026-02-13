import React, { createContext, useState, useEffect, useContext } from 'react';
import { format, subDays, isSameDay } from 'date-fns';

const MedicineContext = createContext();

export const useMedicine = () => useContext(MedicineContext);

export const MedicineProvider = ({ children }) => {
    // --- State ---
    const [medicines, setMedicines] = useState(() => {
        const saved = localStorage.getItem('medicines');
        return saved ? JSON.parse(saved) : [];
    });

    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('logs');
        return saved ? JSON.parse(saved) : [];
    });

    // Simulated User Database
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('users');
        return saved ? JSON.parse(saved) : [];
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : {
            name: '',
            email: '',
            loggedIn: false,
            streak: 0,
            healthScore: 85,
            achievements: []
        };
    });

    const [emergencyMode, setEmergencyMode] = useState(false);

    // --- Effects ---
    useEffect(() => {
        localStorage.setItem('medicines', JSON.stringify(medicines));
    }, [medicines]);

    useEffect(() => {
        localStorage.setItem('logs', JSON.stringify(logs));
        checkEmergencyTrigger();
        updateStreakAndScore();
    }, [logs]);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }, [user]);


    // --- Auth Actions ---

    const register = (userData) => {
        // Validation handled in component, this just stores
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: btoa(userData.password), // Simulated Hashing
            streak: 0,
            healthScore: 85,
            achievements: []
        };

        // Check for duplicates
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        setUsers([...users, newUser]);
        setUser({ ...newUser, loggedIn: true });
        return { success: true };
    };

    const login = (email, password) => {
        const hashedPassword = btoa(password); // Hash input to compare
        const foundUser = users.find(u => u.email === email && u.password === hashedPassword);

        if (foundUser) {
            setUser({ ...foundUser, loggedIn: true });
            return { success: true };
        } else {
            // Check if email exists to give specific error
            const emailExists = users.some(u => u.email === email);
            if (emailExists) return { success: false, message: 'Incorrect password' };
            return { success: false, message: 'Account not found' };
        }
    };

    const logout = () => {
        setUser({ name: '', email: '', loggedIn: false });
    };

    // --- Actions ---

    const addMedicine = (med) => {
        const newMed = {
            ...med,
            id: Date.now().toString(),
            quantity: med.quantity || 30,
            totalQuantity: med.totalQuantity || 30,
            refillThreshold: med.refillThreshold || 5
        };
        setMedicines([...medicines, newMed]);
    };

    const logDose = (medId, status) => {
        const timestamp = new Date().toISOString();
        const date = format(new Date(), 'yyyy-MM-dd');

        // Update Logs
        const newLog = {
            id: Date.now().toString(),
            medicineId: medId,
            timestamp,
            date,
            status
        };
        setLogs([...logs, newLog]);

        // Inventory Logic
        if (status === 'taken') {
            setMedicines(prevMeds => prevMeds.map(m => {
                if (m.id === medId && m.quantity > 0) {
                    return { ...m, quantity: m.quantity - 1 };
                }
                return m;
            }));
        }
    };

    const refillMedicine = (medId) => {
        setMedicines(prevMeds => prevMeds.map(m => {
            if (m.id === medId) {
                return { ...m, quantity: m.totalQuantity };
            }
            return m;
        }));
    };

    // --- AI/Smart Logic ---

    const getDailyProgress = () => {
        let totalDoses = 0;
        medicines.forEach(m => totalDoses += m.times.length);

        const today = format(new Date(), 'yyyy-MM-dd');
        const takenToday = logs.filter(l => l.date === today && l.status === 'taken').length;

        if (totalDoses === 0) return 0;
        return Math.min(Math.round((takenToday / totalDoses) * 100), 100);
    };

    const updateStreakAndScore = () => {
        // Simplified streak logic
        const adherence = getDailyProgress();
        const newScore = Math.min(100, Math.max(50, 80 + (adherence * 0.2)));

        if (user.loggedIn && user.healthScore !== Math.round(newScore)) {
            setUser(prev => ({ ...prev, healthScore: Math.round(newScore) }));
        }
    };

    const checkEmergencyTrigger = () => {
        const recentLogs = logs.slice(-3);
        if (recentLogs.length === 3 && recentLogs.every(l => l.status === 'missed')) {
            setEmergencyMode(true);
        }
    };

    return (
        <MedicineContext.Provider value={{
            medicines,
            logs,
            user,
            setUser, // Exposed for direct updates if needed
            register,
            login,
            logout,
            addMedicine,
            logDose,
            refillMedicine,
            getDailyProgress,
            emergencyMode,
            setEmergencyMode
        }}>
            {children}
        </MedicineContext.Provider>
    );
};
