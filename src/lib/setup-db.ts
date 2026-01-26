
import { sql } from '@vercel/postgres';

export async function createTables() {
    try {
        console.log("Creating tables...");

        // Projects
        await sql`
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                slug TEXT UNIQUE,
                title TEXT,
                description TEXT,
                content JSONB, 
                tags TEXT[],
                tools TEXT[],
                year TEXT,
                location TEXT,
                camera TEXT,
                lens TEXT,
                cover_image TEXT,
                gallery_images TEXT[],
                featured BOOLEAN,
                status TEXT DEFAULT 'published',
                version INTEGER,
                created_at TIMESTAMP,
                updated_at TIMESTAMP,
                published_at TIMESTAMP,
                "order" BIGINT
            );
        `;
        console.log("- Projects table created");

        // Photos
        await sql`
            CREATE TABLE IF NOT EXISTS photos (
                id TEXT PRIMARY KEY,
                url TEXT,
                alt_text TEXT,
                caption TEXT,
                width INTEGER,
                height INTEGER,
                blur_data_url TEXT,
                variants JSONB,
                tags TEXT[],
                featured BOOLEAN,
                status TEXT DEFAULT 'published',
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            );
        `;
        console.log("- Photos table created");

        // Analytics
        await sql`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                type TEXT,
                path TEXT,
                data JSONB,
                timestamp TIMESTAMP
            );
        `;
        // Index for faster time-range queries
        await sql`CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);`;
        console.log("- Analytics table created");

        // Audit Logs
        await sql`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id TEXT PRIMARY KEY,
                timestamp TIMESTAMP,
                "user" TEXT,
                action TEXT,
                target TEXT,
                details TEXT
            );
        `;
        console.log("- Audit Logs table created");

        // Global Settings (One row usually)
        await sql`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value JSONB,
                updated_at TIMESTAMP
            );
        `;
        console.log("- Settings table created");

        // Contact form inbox
        await sql`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                read BOOLEAN DEFAULT false
            );
        `;
        console.log("- Contact messages table created");

        // --- Migrations / Updates ---
        // Add embedding column if it doesn't exist (Phase 2)
        try {
            await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS embedding JSONB;`;
            console.log("Added embedding column to projects");
        } catch (e) {
            console.log("Embedding column might already exist on projects or error:", e);
        }

        try {
            await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS embedding JSONB;`;
            console.log("Added embedding column to photos");
        } catch (e) {
            console.log("Embedding column might already exist on photos or error:", e);
        }

        // Phase 4: Photos AI
        try {
            await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS colors JSONB;`;
            await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS mood TEXT;`;
            console.log("Added colors and mood columns to photos");
        } catch (e) {
            console.log("Colors/Mood columns might already exist or error:", e);
        }

        // Contact inbox (for existing DBs that ran createTables before this was added)
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS contact_messages (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP NOT NULL,
                    read BOOLEAN DEFAULT false
                );
            `;
            console.log("Contact messages table ensured");
        } catch (e) {
            console.log("Contact messages table might already exist or error:", e);
        }

        console.log("All tables created/updated successfully.");
    } catch (e) {
        console.error("Error creating tables:", e);
    }
}
