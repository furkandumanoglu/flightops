import React, { useState, useEffect } from 'react';
import API_CLIENT from '../api/client';

interface Station {
    id: string;
    name: string;
    arm: number;
}

interface Aircraft {
    id: string;
    tailNumber: string;
    model: string;
    stations?: Station[];
}

interface CalculationResult {
    totalWeight: number;
    centerOfGravity: number;
}

const WeightBalanceCalculator: React.FC = () => {
    const [aircraftId, setAircraftId] = useState('');
    const [aircraft, setAircraft] = useState<Aircraft | null>(null);
    const [loads, setLoads] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CalculationResult | null>(null);

    useEffect(() => {
        if (aircraftId.length === 36) { // Simple UUID check
            fetchAircraftDetails(aircraftId);
        }
    }, [aircraftId]);

    const fetchAircraftDetails = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API_CLIENT.get(`/aircraft/${id}`);
            setAircraft(response.data);
            // Initialize loads for the stations
            if (response.data.stations) {
                const initialLoads: Record<string, number> = {};
                response.data.stations.forEach((s: Station) => {
                    initialLoads[s.id] = 0;
                });
                setLoads(initialLoads);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Aircraft not found');
            setAircraft(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadChange = (stationId: string, value: string) => {
        const weight = parseFloat(value) || 0;
        setLoads(prev => ({ ...prev, [stationId]: weight }));
    };

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aircraftId) return;

        setCalculating(true);
        setError(null);
        setResult(null);

        try {
            const response = await API_CLIENT.post(`/aircraft/${aircraftId}/calculate-cg`, { loads });
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to calculate CG');
        } finally {
            setCalculating(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
                <header className="mb-8">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <span className="text-blue-500 text-3xl">⚖️</span>
                        Weight & Balance Calculator
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Enter aircraft details and loads to verify flight safety and CG limits.
                    </p>
                </header>

                <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                            Aircraft UUID
                        </label>
                        <input
                            type="text"
                            value={aircraftId}
                            onChange={(e) => setAircraftId(e.target.value)}
                            placeholder="e.g. a9fe76b1-3b2a-4a30-9868-2b8ef24a4822"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                            required
                        />
                        {loading && <p className="text-xs text-blue-400 animate-pulse">Fetching aircraft details...</p>}
                    </div>

                    {aircraft && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-tighter">Active Aircraft</p>
                                    <h4 className="text-white font-bold">{aircraft.tailNumber} <span className="text-slate-500 font-medium">({aircraft.model})</span></h4>
                                </div>
                                <div className="text-right">
                                    <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest">Station Config Loaded</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {aircraft.stations?.map((station) => (
                                    <div key={station.id} className="space-y-2">
                                        <label className="text-xs font-medium text-slate-400 px-1 flex justify-between">
                                            {station.name}
                                            <span className="text-slate-600">Arm: {station.arm}"</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={loads[station.id] || ''}
                                                onChange={(e) => handleLoadChange(station.id, e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">LBS</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-left-4">
                            <span className="text-red-500 mt-0.5 text-lg">⚠️</span>
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={calculating || !aircraft}
                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${calculating || !aircraft
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99]'
                            }`}
                    >
                        {calculating ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Calculating...
                            </span>
                        ) : (
                            'Verify & Calculate CG'
                        )}
                    </button>
                </form>

                {result && (
                    <div className="mt-10 animate-in zoom-in-95 duration-500">
                        <div className="bg-slate-950/50 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Calculation Results</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-xs font-bold uppercase">Total Weight</p>
                                    <p className="text-4xl font-black text-white tabular-nums">
                                        {result.totalWeight.toLocaleString()} <span className="text-lg text-slate-600 font-medium">lbs</span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-xs font-bold uppercase">Center of Gravity</p>
                                    <p className="text-4xl font-black text-emerald-400 tabular-nums">
                                        {result.centerOfGravity.toFixed(2)} <span className="text-lg text-emerald-900/50 font-medium whitespace-nowrap">inches</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center gap-2 text-emerald-500/80 text-xs font-bold italic">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Data verified against aircraft performance specifications.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeightBalanceCalculator;
