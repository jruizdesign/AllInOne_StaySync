import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    // Loading state is handled by the auth context transition, 
    // but we reset locally just in case.
    setLoading(false); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 mb-4 backdrop-blur-sm">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">StaySync</h1>
            <p className="text-indigo-100">Hotel Management System</p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        placeholder="admin@staysync.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
            </form>
            <div className="mt-6 text-center text-xs text-slate-400">
                <p>Protected by Firebase Authentication</p>
            </div>
        </div>
      </div>
    </div>
  );
};
