import React from 'react';
import { AlertTriangle, Phone, Shield, X, Activity, MapPin, Clock, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmergencyOverlayProps {
    onDismiss: () => void;
    sosData?: any;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ onDismiss, sosData }) => {
    // Brand Colors: Dark Blue (#0D2440), Primary Blue (#2E5E99)
    // Emergency Colors: Red (#DC2626)
    // Strategy: Use Brand Dark as base, Red as the "Active State"

    // Extract data
    const contacts = sosData?.contacts_notified || [];
    const timestamp = sosData?.timestamp;
    const location = sosData?.user_location;
    const userInfo = sosData?.user_info;

    return (
        <div className="fixed inset-0 z-[100] bg-brand-dark overflow-y-auto font-sans selection:bg-red-500/30 custom-scrollbar">
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(13, 36, 64, 0.5);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(220, 38, 38, 0.4);
                        border: 2px solid rgba(13, 36, 64, 0.8);
                        border-radius: 10px;
                        transition: all 0.3s;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(220, 38, 38, 0.8);
                    }
                    /* Firefox */
                    .custom-scrollbar {
                        scrollbar-width: auto;
                        scrollbar-color: rgba(220, 38, 38, 0.6) rgba(13, 36, 64, 0.5);
                    }
                `}
            </style>
            {/* Fixed Background Layer */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 via-brand-dark to-brand-dark" />
                <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center py-6 px-4 md:px-8 font-sans">

                {/* Header Section - Compact & High-Impact */}
                <div className="flex flex-col items-center mb-4 animate-fade-in-up">
                    <div className="mb-3 relative group">
                        <div className="absolute inset-0 bg-red-600 blur-[30px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative p-4 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-2xl border border-white/20">
                            <AlertTriangle className="text-white drop-shadow-md" size={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-black font-display uppercase tracking-widest text-white drop-shadow-2xl leading-none mb-1 italic">
                            Emergency
                        </h1>
                        <div className="flex items-center gap-4 justify-center">
                            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-red-500 rounded-full opacity-50"></div>
                            <p className="text-red-400 text-[9px] font-black font-sans tracking-[0.6em] uppercase opacity-90">
                                Global Response Active
                            </p>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-red-500 rounded-full opacity-50"></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid - Optimized 2x2 Matrix */}
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch mb-6">

                    {/* 1. Identity Context */}
                    {userInfo && (
                        <div className="glass-dark rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[6px] border-blue-500 text-left relative overflow-hidden group hover:bg-white/10 transition-all duration-700">
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                <User size={220} className="text-white" />
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-inner">
                                        <User size={22} />
                                    </div>
                                    <span className="text-xs font-black font-sans uppercase tracking-[0.2em] text-blue-400/80">Personal Identification</span>
                                </div>
                                <div className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                    <span className="text-[8px] font-bold text-blue-400 tracking-widest uppercase">Secured</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center flex-1">
                                <div className="relative pl-6 border-l-2 border-blue-500/30">
                                    <p className="text-[10px] font-black font-sans text-blue-400/40 uppercase tracking-[0.25em] mb-2 font-display">Subject Full Name</p>
                                    <h3 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight leading-none group-hover:translate-x-1 transition-transform">
                                        {userInfo.name || "UNKNOWN USER"}
                                    </h3>
                                </div>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-dark/50 rounded-2xl border border-white/5 shadow-2xl">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                                        <span className="text-[10px] font-bold font-sans text-brand-medium uppercase tracking-[0.15em] opacity-80">UID: {userInfo.uid?.substring(0, 18).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Tactical Geospatial */}
                    {location && (
                        <div className="glass-dark rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[6px] border-green-500 text-left relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                <MapPin size={220} className="text-white" />
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20 shadow-inner">
                                        <MapPin size={22} />
                                    </div>
                                    <span className="text-xs font-black font-sans uppercase tracking-[0.2em] text-green-400/80">Live Geospatial Feed</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                                    <span className="text-[8px] font-bold text-green-400 tracking-widest uppercase">Live</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center flex-1 h-[calc(100%-80px)]">
                                {'lat' in location ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-brand-dark/40 p-5 rounded-[2rem] border border-white/5 shadow-2xl group/item hover:bg-white/5 transition-colors">
                                                <p className="text-[9px] font-black font-sans uppercase text-green-400/40 mb-2 tracking-[0.2em]">Latitude</p>
                                                <p className="text-2xl font-black font-display text-white tracking-tighter">{location.lat.toFixed(6)}°</p>
                                            </div>
                                            <div className="bg-brand-dark/40 p-5 rounded-[2rem] border border-white/5 shadow-2xl group/item hover:bg-white/5 transition-colors">
                                                <p className="text-[9px] font-black font-sans uppercase text-green-400/40 mb-2 tracking-[0.2em]">Longitude</p>
                                                <p className="text-2xl font-black font-display text-white tracking-tighter">{location.lng.toFixed(6)}°</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-2xl text-xs font-black font-sans uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-green-900/40 active:scale-[0.98] border border-white/10"
                                        >
                                            <MapPin size={18} />
                                            Initialize Tactical View
                                        </a>
                                    </div>
                                ) : (
                                    <div className="relative pl-6 border-l-2 border-green-500/30">
                                        <p className="text-[10px] font-black font-sans text-green-400/40 uppercase tracking-[0.25em] mb-2">Last Reported Sector</p>
                                        <p className="text-3xl font-black font-display text-white leading-tight">{location.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. Response Relay Matrix */}
                    <div className="glass-dark rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[6px] border-red-600 text-left relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                            <Activity size={220} className="text-white" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 shadow-inner">
                                    <Activity size={22} />
                                </div>
                                <span className="text-xs font-black font-sans uppercase tracking-[0.2em] text-red-500/80">Autonomous Alert Status</span>
                            </div>
                            <div className="px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                                <span className="text-[8px] font-bold text-red-500 tracking-widest uppercase">Active</span>
                            </div>
                        </div>

                        <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {contacts.length > 0 ? (
                                <div className="space-y-4">
                                    {contacts.map((contact: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between bg-brand-dark/60 p-5 rounded-3xl border border-white/5 group/contact hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className={`w-3 h-3 rounded-full ${contact.status === 'sent' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`} />
                                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${contact.status === 'sent' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-lg font-black font-display text-white leading-none tracking-tight">{contact.name}</span>
                                                    <span className="text-[10px] font-bold font-sans text-brand-medium uppercase tracking-[0.2em]">{contact.phone}</span>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black font-sans uppercase tracking-widest shadow-lg ${contact.status === 'sent' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-600 text-white'
                                                }`}>
                                                {contact.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6 border-2 border-dashed border-white/5 rounded-[2rem] p-8 bg-brand-dark/20 shadow-inner">
                                    <div className="p-5 bg-red-500/5 rounded-full border border-red-500/10">
                                        <AlertTriangle size={48} className="text-red-500/40" />
                                    </div>
                                    <p className="text-xs font-black font-sans text-red-500/60 uppercase tracking-[0.3em] max-w-[200px] leading-relaxed">Emergency Network Offline</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Protective Protocols */}
                    <div className="glass-dark rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[6px] border-brand-primary text-left relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                            <Shield size={220} className="text-white" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary border border-brand-primary/20 shadow-inner">
                                    <Shield size={22} />
                                </div>
                                <span className="text-xs font-black font-sans uppercase tracking-[0.2em] text-brand-primary/80">Stabilization Commands</span>
                            </div>
                            <div className="px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                                <span className="text-[8px] font-bold text-brand-primary tracking-widest uppercase">Secured</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between h-[calc(100%-100px)]">
                            {[
                                { id: '01', text: 'Remain Calm.', desc: 'Synchronize 4-7-8 breathing now.', color: 'from-blue-500 to-blue-600' },
                                { id: '02', text: 'Secure Perimeter.', desc: 'Lock all entry points immediately.', color: 'from-indigo-500 to-indigo-600' },
                                { id: '03', text: 'Await Confirmation.', desc: 'Response teams are mobilizing.', color: 'from-brand-primary to-brand-primary' }
                            ].map((step) => (
                                <div key={step.id} className="flex gap-6 items-center bg-brand-dark/40 p-4 rounded-3xl border border-white/5 hover:bg-white/5 transition-all group/step cursor-default">
                                    <div className={`font-black font-sans text-white text-xs bg-gradient-to-br ${step.color} w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover/step:scale-110 transition-transform`}>
                                        {step.id}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm md:text-base font-black font-display text-white uppercase tracking-tight italic leading-tight mb-1 group-hover/step:translate-x-1 transition-transform">{step.text}</span>
                                        <span className="text-[10px] font-bold font-sans text-brand-medium/60 uppercase tracking-widest">{step.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Controls - Elite Aesthetic */}
                <div className="w-full max-w-sm flex flex-col items-center gap-4 mb-2">
                    <button
                        onClick={onDismiss}
                        className="w-full py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white rounded-xl text-[10px] font-black font-sans uppercase tracking-[0.5em] hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(220,38,38,0.4)] transition-all shadow-xl active:scale-95 border border-white/10 group relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            <span>Terminate Alert</span>
                        </div>
                    </button>
                    <div className="flex flex-col items-center gap-1.5 opacity-50">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1.5 h-0.5 bg-red-500/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                            ))}
                        </div>
                        <p className="text-[8px] font-black font-sans text-red-500/80 uppercase tracking-[0.8em] italic leading-none whitespace-nowrap pl-[0.8em]">
                            System Shield Active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
