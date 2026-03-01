import React, { useEffect, useState } from 'react';
import API_CLIENT from '../api/client';

interface Aircraft {
    id: string;
    tailNumber: string;
    model: string;
}

interface DemoInfoPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const DemoInfoPanel: React.FC<DemoInfoPanelProps> = ({ isOpen, onClose }) => {
    const [aircraft, setAircraft] = useState<Aircraft[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchAircraft = async () => {
                try {
                    const response = await API_CLIENT.get('/aircraft');
                    setAircraft(response.data);
                } catch (error) {
                    console.error('Failed to fetch aircraft for demo panel:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAircraft();
        }
    }, [isOpen]);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-80 z-[60] p-4 pointer-events-none">
            <div className="h-full w-full bg-slate-950/40 backdrop-blur-2xl border border-emerald-500/30 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto ring-1 ring-white/5 animate-in slide-in-from-right-8 duration-500">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
                    <div>
                        <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Demo Toolkit
                        </h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Reviewer Quick Access</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {/* Aircraft Section */}
                    <section>
                        <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="h-px flex-1 bg-white/5"></span>
                            Aircraft Fleet
                            <span className="h-px flex-1 bg-white/5"></span>
                        </h4>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : aircraft.length > 0 ? (
                            <div className="space-y-3">
                                {aircraft.map((ac) => (
                                    <button
                                        key={ac.id}
                                        onClick={() => handleCopy(ac.id)}
                                        className="w-full group text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all relative overflow-hidden active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-white font-black italic tracking-tight">{ac.tailNumber}</span>
                                            <span className="text-[10px] text-emerald-500 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                {copiedId === ac.id ? 'COPIED!' : 'CLICK TO COPY UUID'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono truncate">{ac.id}</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No Aircraft Found</p>
                                <p className="text-[8px] text-slate-600 mt-1 uppercase font-black">Run seed data on backend</p>
                            </div>
                        )}
                    </section>

                    {/* Crew Section */}
                    <section>
                        <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="h-px flex-1 bg-white/5"></span>
                            Flight Crew
                            <span className="h-px flex-1 bg-white/5"></span>
                        </h4>

                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">
                                        🏴‍☠️
                                    </div>
                                    <div>
                                        <p className="text-white font-black tracking-tight text-sm">Captain Jack Sparrow</p>
                                        <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Instructor</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopy('7c9e6679-7425-40de-944b-617a22676767')}
                                    className="w-full group text-left p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">UUID</span>
                                        <span className="text-[8px] text-emerald-500 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                            {copiedId === '7c9e6679-7425-40de-944b-617a22676767' ? 'COPIED' : 'COPY'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-mono truncate">7c9e6679... (Seed ID)</p>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-950/80 border-t border-white/5">
                    <p className="text-[9px] text-slate-600 font-medium leading-relaxed">
                        This toolkit is for <span className="text-emerald-500/50">review purposes only</span>. All data shown is fetched from the experimental database seed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DemoInfoPanel;
