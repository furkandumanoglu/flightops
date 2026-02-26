import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Sidebar / Navigation Placeholder */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">✈️</span>
                            <span className="text-xl font-bold text-white tracking-tight">FlightOps</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-white leading-none">{user?.fullName || 'Pilot'}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{user?.role || 'Flight Crew'}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-slate-800 hover:bg-red-900/40 hover:text-red-400 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-slate-700 hover:border-red-500/30"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-white">Dashboard Overview</h2>
                    <p className="text-slate-400 mt-1">Welcome back, Captain. Systems are nominal.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Weight & Balance Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                        <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-500/20 transition-all">
                            ⚖️
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Weight & Balance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Calculate takeoff weights, center of gravity, and performance data for your aircraft.
                        </p>
                        <div className="inline-flex items-center text-blue-400 text-sm font-bold gap-2">
                            Launch Calculator <span className="text-xs">→</span>
                        </div>
                    </div>

                    {/* Recent Flights Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-500/20 transition-all">
                            📅
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Flight Schedule</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            View upcoming training flights, aircraft availability, and instructor assignments.
                        </p>
                        <div className="inline-flex items-center text-emerald-400 text-sm font-bold gap-2">
                            View Calendar <span className="text-xs">→</span>
                        </div>
                    </div>

                    {/* Maintenance Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                        <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-amber-500/20 transition-all">
                            🛠️
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Fleet Status</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Real-time maintenance logs and airworthiness status for the school's fleet.
                        </p>
                        <div className="inline-flex items-center text-amber-400 text-sm font-bold gap-2">
                            Check Readiness <span className="text-xs">→</span>
                        </div>
                    </div>
                </div>

                {/* Placeholder for Weight & Balance Implementation */}
                <section className="mt-12 bg-slate-950 border border-slate-800 border-dashed rounded-3xl p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="text-4xl mb-4 opacity-50">🚧</div>
                        <h4 className="text-xl font-bold text-white mb-2">W&B System Coming Soon</h4>
                        <p className="text-slate-500 text-sm">
                            We are currently finalizing the W&B calculation engine. This module will allow precise loading and CG verification for Cessna and Piper aircraft.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
