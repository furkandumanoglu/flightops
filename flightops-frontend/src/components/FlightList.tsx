import React, { useState, useEffect } from 'react';
import API_CLIENT from '../api/client';

interface Flight {
    id: string;
    flightNumber: string;
    scheduledDeparture: string;
    scheduledArrival: string;
    status: string;
    aircraft: {
        tailNumber: string;
        model: string;
    };
}

const FlightList: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await API_CLIENT.get('/flights/me');
            setFlights(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch flights');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-slate-400 animate-pulse text-sm">Loading schedules...</div>;

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full">
            <div className="p-8">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <span className="text-emerald-500">📅</span>
                            My Flights
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Upcoming Schedule</p>
                    </div>
                    <button
                        onClick={fetchFlights}
                        className="text-slate-500 hover:text-white transition-colors"
                        title="Refresh"
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

                {flights.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-slate-500 font-bold">No flights scheduled</p>
                        <p className="text-slate-600 text-xs mt-1">Book your next training session below.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {flights.map((flight) => (
                            <div key={flight.id} className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 hover:border-slate-700 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">{flight.flightNumber}</span>
                                        <h4 className="text-white font-bold">{flight.aircraft.tailNumber}</h4>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${flight.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' :
                                        flight.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-slate-800 text-slate-500'
                                        }`}>
                                        {flight.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Departure</p>
                                        <p className="text-xs text-slate-300 font-medium">
                                            {new Date(flight.scheduledDeparture).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Arrival</p>
                                        <p className="text-xs text-slate-300 font-medium">
                                            {new Date(flight.scheduledArrival).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightList;
