import React, { useState } from 'react';
import API_CLIENT from '../api/client';

interface ScheduleFlightFormProps {
    onSuccess?: () => void;
}

const ScheduleFlightForm: React.FC<ScheduleFlightFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        aircraftId: '',
        instructorId: '',
        scheduledDeparture: '',
        scheduledArrival: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await API_CLIENT.post('/flights', {
                ...formData,
                instructorId: formData.instructorId.trim() === '' ? null : formData.instructorId,
            });
            setSuccess(true);
            setFormData({
                aircraftId: '',
                instructorId: '',
                scheduledDeparture: '',
                scheduledArrival: '',
            });
            if (onSuccess) onSuccess();
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('Scheduling Conflict: This aircraft or instructor is already booked for the selected time.');
            } else {
                const serverMsg = err.response?.data?.message || err.response?.data?.error;
                setError(serverMsg || 'Failed to schedule flight. Please check your connection or try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full">
            <div className="p-8">
                <header className="mb-8">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <span className="text-blue-500">✍️</span>
                        Book a Flight
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">New Mission Request</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Aircraft UUID</label>
                        <input
                            type="text"
                            required
                            value={formData.aircraftId}
                            onChange={(e) => setFormData({ ...formData, aircraftId: e.target.value })}
                            placeholder="e.g. a9fe76b1-3b2a-4a30-9868-2b8ef24a4822"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Instructor ID (Optional)</label>
                        <input
                            type="text"
                            value={formData.instructorId}
                            onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                            placeholder="Instructor UUID"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Departure</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.scheduledDeparture}
                                onChange={(e) => setFormData({ ...formData, scheduledDeparture: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Arrival</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.scheduledArrival}
                                onChange={(e) => setFormData({ ...formData, scheduledArrival: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                            <p className="text-red-400 text-xs font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 text-center">
                            <p className="text-emerald-400 text-xs font-bold">✓ Flight Scheduled Successfully!</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${loading
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleFlightForm;
