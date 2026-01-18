import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_logs.json');

export type AuditAction = 'create' | 'update' | 'delete' | 'upload' | 'backup' | 'restore';

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: AuditAction;
    target: string; // "Project: ID", "Upload: filename.jpg"
    details?: string;
}

export function logAudit(user: string, action: AuditAction, target: string, details?: string) {
    try {
        let logs: AuditLog[] = [];
        if (fs.existsSync(AUDIT_FILE)) {
            logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
        }

        const entry: AuditLog = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            timestamp: new Date().toISOString(),
            user,
            action,
            target,
            details
        };

        logs.unshift(entry);

        // Keep last 5000 logs
        if (logs.length > 5000) logs = logs.slice(0, 5000);

        fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2));
    } catch (e) {
        console.error("Failed to write audit log", e);
    }
}

export function getAuditLogs(): AuditLog[] {
    try {
        if (!fs.existsSync(AUDIT_FILE)) return [];
        return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
    } catch {
        return [];
    }
}
