import React, { useState, useEffect } from 'react';
import API_CLIENT from '../api/client';

interface Aircraft {
    id: string;
    tailNumber: string;
    model: string;
    status: 'READY' | 'MAINTENANCE' | 'GROUNDED';
    nextMaintenanceHours: number;
}

const FleetStatus: React.FC = () => {
    const [fleet, setFleet] = useState<Aircraft[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFleet();
    }, []);

    const fetchFleet = async () => {
        try {
            const response = await API_CLIENT.get('/aircraft');
            setFleet(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch fleet status');
        } finally {
            setLoading(false);
        }
    };

    const statusStyles = {
        READY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        MAINTENANCE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        GROUNDED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    if (loading) return <div className="text-slate-400 animate-pulse text-sm">Synchronizing fleet telemetry...</div>;

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full">
            <div className="p-8">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <span className="text-indigo-500">🛡️</span>
                            Fleet Airworthiness
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Real-time Readiness Status</p>
                    </div>
                    <button
                        onClick={fetchFleet}
                        className="text-slate-500 hover:text-white transition-colors"
                        title="Refresh Fleet Data"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </header>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                        <p className="text-red-400 text-xs font-medium">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {fleet.map((aircraft) => (
                        <div key={aircraft.id} className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-xl border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                                        🛩️
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold tracking-tight">{aircraft.tailNumber}</h4>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase">{aircraft.model}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border ${statusStyles[aircraft.status]}`}>
                                    {aircraft.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${aircraft.nextMaintenanceHours < 10 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${Math.min(100, (aircraft.nextMaintenanceHours / 50) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                        {aircraft.nextMaintenanceHours}H REMAINING
                                    </span>
                                </div>
                                <div className="text-[10px] font-black text-slate-600 group-hover:text-indigo-400 transition-colors cursor-pointer">
                                    LOGS →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FleetStatus;
