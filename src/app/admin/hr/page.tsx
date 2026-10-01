"use client";

import React, { useState, useEffect } from "react";
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    DollarSign, 
    Clock,
    MoreVertical,
    ChevronRight,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";
import { SyncService } from "@/lib/tauri/sync";

export default function HRPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const syncService = new SyncService();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // In a real tauri app, this would fetch from SQLite 'employees' table
            const data = await syncService.getLocalData("employees") as any[];
            setEmployees(data || []);
        } catch (e) {
            console.error("Failed to load employees:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Human <span className="text-accent italic">Resources</span></h1>
                    <p className="text-muted-foreground text-sm font-medium italic">Manage employee directories, roles, and operational status.</p>
                </div>
                <button className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20">
                    <UserPlus size={18} /> Add New Employee
                </button>
            </div>

            {/* Selection & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search employees by name, role or email..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium appearance-none cursor-pointer">
                        <option value="all" className="bg-zinc-900">All Departments</option>
                        <option value="ads" className="bg-zinc-900">Advertising</option>
                        <option value="ops" className="bg-zinc-900">Operations</option>
                        <option value="fin" className="bg-zinc-900">Finance</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-6 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <Users size={14} className="text-accent" />
                    <span>Total Staff: {employees.length}</span>
                </div>
            </div>

            {/* Employee Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-accent mb-4" size={32} />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Staff Records...</p>
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <Users size={48} className="text-zinc-800 mb-4" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No personnel records found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEmployees.map((emp, i) => (
                        <div 
                            key={emp.id}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent overflow-hidden relative">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&color=fff`} 
                                            alt={emp.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight group-hover:text-accent transition-colors">{emp.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{emp.designation}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <MoreVertical size={16} className="text-muted-foreground" />
                                </button>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Mail size={14} className="text-accent/60" />
                                    <span className="font-medium">{emp.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Phone size={14} className="text-accent/60" />
                                    <span className="font-medium">{emp.phone || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Briefcase size={14} className="text-accent/60" />
                                    <span className="font-medium">Joined: {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Base Salary</span>
                                    <span className="text-sm font-black text-accent">{formatPKR(emp.salary)}</span>
                                </div>
                                <button className="px-4 py-2 bg-white/5 hover:bg-accent hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    View File
                                </button>
                            </div>
                            
                            {/* Department Badge */}
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-white/5 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-white/5">
                                    {emp.department || "General"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
