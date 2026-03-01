import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CLIENT from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log("Attempting login for:", email);
            const response = await API_CLIENT.post('/auth/login', { email, password });
            console.log("Login success, received token:", !!response.data.token);

            login(response.data.token);
            console.log("Token saved, navigating to dashboard...");
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Login Error:", err);
            const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white flex items-center justify-center gap-3">
                        <span className="text-blue-500">✈️</span> FlightOps
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Aviation Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="pilot@flightops.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Clearing for Takeoff...' : 'Login to Cockpit'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800">
                    <div className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <span className="text-2xl">🔑</span>
                        </div>
                        <h4 className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Demo Credentials
                        </h4>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between group/item">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Email</p>
                                    <p className="text-sm text-slate-300 font-mono">admin@example.com</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('admin@example.com');
                                    }}
                                    className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500/50 hover:text-emerald-400 transition-colors"
                                    title="Copy Email"
                                >
                                    <span className="text-sm">📋</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between group/item">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Password</p>
                                    <p className="text-sm text-slate-300 font-mono">password123</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('password123');
                                    }}
                                    className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500/50 hover:text-emerald-400 transition-colors"
                                    title="Copy Password"
                                >
                                    <span className="text-sm">📋</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-slate-500 text-xs">
                    Secure biometric encryption enabled by default.
                </div>
            </div>
        </div>
    );
};

export default Login;
