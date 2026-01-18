"use client"

import { useState, useEffect } from "react"
import { SimpleBarChart, MetricCard } from "./analytics/charts"
import { Shield, HardDrive, FileText, Download, RefreshCcw, AlertTriangle } from "lucide-react"

export function SecurityTab() {
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalSize: 0, fileCount: 0 });

    useEffect(() => {
        fetch('/api/admin/audit').then(r => r.json()).then(setLogs);
        fetch('/api/admin/stats').then(r => r.json()).then(setStats);
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Storage Health */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="flex items-center gap-2 font-bold mb-6">
                        <HardDrive size={18} /> Storage Health
                    </h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold">{formatSize(stats.totalSize)}</span>
                        <span className="text-sm text-muted-foreground mb-1">used total</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{stats.fileCount} files</span>
                        <span>10GB Quote</span>
                    </div>
                    {/* Fake bar viz */}
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((stats.totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100)}%` }} />
                    </div>
                </div>

                {/* Backup / Restore */}
                <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 font-bold mb-2">
                            <Shield size={18} /> Disaster Recovery
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Download a full backup of content and metadata.
                        </p>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button onClick={() => alert("Backup started...")} className="flex-1 py-2 bg-secondary hover:bg-secondary/80 rounded font-medium flex items-center justify-center gap-2 transition-colors">
                            <Download size={16} /> Backup
                        </button>
                        <button onClick={() => alert("Contact SysAdmin for restore")} className="flex-1 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded font-medium flex items-center justify-center gap-2 transition-colors">
                            <RefreshCcw size={16} /> Restore
                        </button>
                    </div>
                </div>
            </div>

            {/* Audit Log */}
            <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-secondary/50 p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2"><FileText size={16} /> Audit Log</h3>
                    <span className="text-xs text-muted-foreground">Recent Actions</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground text-xs uppercase bg-background">
                            <tr>
                                <th className="p-4">Time</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Target</th>
                                <th className="p-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {logs.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No logs found.</td></tr>
                            ) : logs.map(log => (
                                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="p-4 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="p-4">{log.user}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${log.action === 'create' || log.action === 'restore' ? 'bg-green-500/20 text-green-500' :
                                                log.action === 'delete' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium">{log.target}</td>
                                    <td className="p-4 text-muted-foreground">{log.details || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
