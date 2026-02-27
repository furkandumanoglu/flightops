import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WeightBalanceCalculator from '../components/WeightBalanceCalculator';
import FlightList from '../components/FlightList';
import ScheduleFlightForm from '../components/ScheduleFlightForm';
import FleetStatus from '../components/FleetStatus';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    // State-driven UI toggles
    const [openModule, setOpenModule] = useState<string | null>(null);

    const toggleModule = (moduleName: string) => {
        setOpenModule(openModule === moduleName ? null : moduleName);
    };

    const modules = [
        {
            id: 'scheduling',
            title: 'Schedule & Missions',
            icon: '🗓️',
            description: 'Coordinate training flights, assignments, and mission logs.',
            color: 'emerald',
            secondaryIcon: '📅'
        },
        {
            id: 'wb',
            title: 'Weight & Balance',
            icon: '⚖️',
            description: 'Precision calculation for takeoff performance and safety.',
            color: 'indigo',
            secondaryIcon: '🎯'
        },
        {
            id: 'fleet',
            title: 'Fleet Readiness',
            icon: '✈️',
            description: 'Monitor airworthiness, maintenance, and fleet status.',
            color: 'amber',
            secondaryIcon: '🛡️'
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
            <WeatherWidget />

            {/* Main Navigation */}
            <nav className="bg-slate-900/20 backdrop-blur-md border-b border-white/5 sticky top-[53px] z-40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                            ⚙️
                        </div>
                        <div>
                            <span className="text-xl font-black text-white tracking-tighter uppercase italic">FlightOps</span>
                            <div className="flex items-center gap-2 -mt-1">
                                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">System Linked</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-white leading-none tracking-tight">{user?.fullName || 'COMMANDER'}</p>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] mt-1">{user?.role || 'PILOT'}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 px-5 py-2.5 rounded-xl text-xs font-black transition-all border border-white/5 hover:border-red-500/30 uppercase tracking-widest"
                        >
                            Log Off
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Mission Control</h2>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">Operational units synchronized. Select a mission module below.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {modules.map((mod) => (
                        <button
                            key={mod.id}
                            onClick={() => toggleModule(mod.id)}
                            className={`group relative overflow-hidden rounded-[2.5rem] border p-8 text-left transition-all duration-500 
                                ${openModule === mod.id
                                    ? `bg-${mod.color}-500/10 border-${mod.color}-500/50 ring-4 ring-${mod.color}-500/10`
                                    : 'bg-slate-900/30 border-white/5 hover:border-white/20'}`}
                        >
                            <div className={`absolute -right-4 -top-4 text-8xl opacity-[0.03] transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12`}>
                                {mod.secondaryIcon}
                            </div>

                            <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-3xl mb-6 shadow-2xl transition-all duration-500 group-hover:scale-110
                                ${openModule === mod.id
                                    ? `bg-${mod.color}-500 text-white`
                                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                                {mod.icon}
                            </div>

                            <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors uppercase italic">{mod.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {mod.description}
                            </p>

                            <div className="mt-6 flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-all
                                    ${openModule === mod.id ? `text-${mod.color}-400` : 'text-slate-600 group-hover:text-slate-400'}`}>
                                    {openModule === mod.id ? 'System Active' : 'Initialize Command'}
                                </span>
                                <div className={`h-1 w-1 rounded-full ${openModule === mod.id ? `bg-${mod.color}-400 animate-pulse` : 'bg-slate-800'}`}></div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Modular Display Areas */}
                <div className="space-y-12">
                    {openModule === 'scheduling' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <ScheduleFlightForm />
                            <FlightList />
                        </div>
                    )}

                    {openModule === 'wb' && (
                        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                            <WeightBalanceCalculator />
                        </div>
                    )}

                    {openModule === 'fleet' && (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                            <FleetStatus />
                        </div>
                    )}
                </div>

                {!openModule && (
                    <div className="flex flex-col items-center justify-center py-24 text-center opacity-30 select-none">
                        <div className="text-6xl mb-6 grayscale">🛡️</div>
                        <h3 className="text-lg font-black tracking-widest uppercase mb-2">Systems Standby</h3>
                        <p className="text-sm font-bold max-w-xs uppercase tracking-tighter">Await command initialization via modular interface</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
