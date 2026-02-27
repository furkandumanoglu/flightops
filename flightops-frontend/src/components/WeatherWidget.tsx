import React from 'react';

const WeatherWidget: React.FC = () => {
    // Mock data for Istanbul/LTBA
    const weather = {
        location: 'LTBA (ISTANBUL)',
        temp: 14,
        wind: '040/12KT',
        visibility: '>10KM',
        qnh: '1013 HPA',
        condition: 'VFR',
        lastUpdated: '03:40 Z'
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5 py-3 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-bold tracking-widest uppercase">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-indigo-400 group-hover:scale-110 transition-transform">📍</span>
                        <span className="text-white">{weather.location}</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                        <span className="text-slate-500">TEMP:</span>
                        <span className="text-emerald-400">{weather.temp}°C</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                        <span className="text-slate-500">WIND:</span>
                        <span className="text-emerald-400">{weather.wind}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6">
                        <span className="text-slate-500">VIS:</span>
                        <span className="text-emerald-400">{weather.visibility}</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-6">
                        <span className="text-slate-500">QNH:</span>
                        <span className="text-emerald-400">{weather.qnh}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`px-3 py-1 rounded-full border ${weather.condition === 'VFR' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {weather.condition} CONDITIONS
                    </div>
                    <div className="text-slate-600 font-medium">
                        UPDATED: {weather.lastUpdated}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
