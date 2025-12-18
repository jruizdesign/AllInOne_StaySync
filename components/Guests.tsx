import React, { useState } from 'react';
import { Mail, Star, Phone, Calendar, MoreVertical, Sparkles, Send } from 'lucide-react';
import { Guest } from '../types';
import { generateEmailDraft } from '../services/geminiService';
import { sendEmail } from '../services/emailService';

interface GuestsProps {
  guests: Guest[];
}

export const Guests: React.FC<GuestsProps> = ({ guests }) => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [emailDraft, setEmailDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDraftEmail = async (type: 'welcome' | 'confirmation' | 'apology') => {
    if (!selectedGuest) return;
    setIsDrafting(true);
    setEmailDraft('Asking AI to draft email...');
    const draft = await generateEmailDraft(selectedGuest.name, type);
    setEmailDraft(draft);
    setIsDrafting(false);
  };

  const handleSendEmail = async () => {
    if (!selectedGuest || !emailDraft) return;
    
    setIsSending(true);
    try {
        await sendEmail({
            to: selectedGuest.email,
            subject: 'Message from StaySync Hotel',
            body: emailDraft
        });
        alert(`Email successfully sent to ${selectedGuest.email}`);
        setEmailDraft(''); // Clear draft after send
    } catch (error) {
        alert('Failed to send email. Please check SMTP configuration.');
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-slate-900">Guest Directory</h1>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Guest List */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <input 
              type="text" 
              placeholder="Search guests..." 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {guests.map(guest => (
              <div 
                key={guest.id} 
                onClick={() => { setSelectedGuest(guest); setEmailDraft(''); }}
                className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center ${selectedGuest?.id === guest.id ? 'bg-indigo-50 border-indigo-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${guest.vip ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                        {guest.name}
                        {guest.vip && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </h4>
                    <p className="text-xs text-slate-500">{guest.email}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Last Stay</p>
                  <p className="text-xs font-medium text-slate-600">{guest.lastStay}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Detail / AI Panel */}
        <div className="w-full lg:w-[450px] bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6">
          {selectedGuest ? (
            <>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${selectedGuest.vip ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {selectedGuest.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedGuest.name}</h2>
                    {selectedGuest.vip && <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium mt-1">VIP Member</span>}
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5"/></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><Mail className="w-3 h-3"/> Email</div>
                    <div className="text-sm font-medium text-slate-900 truncate" title={selectedGuest.email}>{selectedGuest.email}</div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><Phone className="w-3 h-3"/> Phone</div>
                    <div className="text-sm font-medium text-slate-900">{selectedGuest.phone}</div>
                 </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">Guest Notes</h4>
                <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                    {selectedGuest.notes || "No notes available."}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-slate-900">AI Actions</h3>
                    </div>
                    {emailDraft && !isDrafting && (
                        <button 
                            onClick={handleSendEmail} 
                            disabled={isSending}
                            className="flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {isSending ? "Sending..." : "Send via SMTP"}
                            <Send className="w-3 h-3" />
                        </button>
                    )}
                </div>
                
                <div className="flex gap-2 mb-4">
                    <button onClick={() => handleDraftEmail('welcome')} className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors">Draft Welcome</button>
                    <button onClick={() => handleDraftEmail('confirmation')} className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors">Confirm Booking</button>
                    <button onClick={() => handleDraftEmail('apology')} className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors">Apology</button>
                </div>

                <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 overflow-y-auto relative min-h-[150px]">
                    {isDrafting ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                            <span className="text-indigo-600 animate-pulse font-medium">Generating draft...</span>
                        </div>
                    ) : (
                        <textarea 
                            className="w-full h-full bg-transparent border-none resize-none focus:outline-none"
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                            placeholder="Select an AI action above to generate a draft email..."
                        />
                    )}
                </div>
              </div>

            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p>Select a guest to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple Icon component mock since Users is imported in Guests but used in fallback
const Users: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
