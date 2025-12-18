import React, { useState } from 'react';
import { Power, Database, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { systemService } from '../services/systemService';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const [isDemo, setIsDemo] = useState(systemService.isDemoMode());
  const { signOut } = useAuth();

  const handleToggleDemo = () => {
    const newValue = !isDemo;
    if (confirm(newValue 
        ? "Switch to Demo Mode? This will load sample data." 
        : "Turn off Demo Mode? You will need to configure the system and creates real accounts. You will be logged out.")) {
        
        systemService.setDemoMode(newValue);
        setIsDemo(newValue);
        
        // Force reload/logout to trigger state changes
        signOut();
        window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage system preferences and modes</p>
            </div>
        </div>

        {/* System Mode Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    System Environment
                </h3>
            </div>
            
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">Demo Mode</h4>
                            {isDemo ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">Active</span>
                            ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">Inactive</span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 max-w-lg">
                            When active, the system uses mock data for demonstration purposes. 
                            Disabling this will clear all data, enable Setup Mode, and require real authentication configuration.
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleToggleDemo}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDemo ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${isDemo ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>

                {!isDemo && (
                     <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-emerald-900">Live Environment Active</h4>
                            <p className="text-sm text-emerald-700 mt-1">
                                You are currently viewing the Setup/Live version. Accounts are persisted locally for this session.
                            </p>
                        </div>
                     </div>
                )}
            </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Security
                </h3>
            </div>
            <div className="p-6">
                <p className="text-sm text-slate-500 mb-4">
                    Current session is protected. Use the button below to sign out securely.
                </p>
                <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    <Power className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    </div>
  );
};
