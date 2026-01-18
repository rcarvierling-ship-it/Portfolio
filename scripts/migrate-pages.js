
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migratePages() {
    try {
        console.log("Migrating Pages table...");
        await sql`ALTER TABLE pages ADD COLUMN IF NOT EXISTS content JSONB;`;
        console.log("- Added content column");
        await sql`ALTER TABLE pages ADD COLUMN IF NOT EXISTS description TEXT;`;
        console.log("- Added description column");
        console.log("Migration complete.");
    } catch (e) {
        console.error("Migration error:", e);
    }
}

migratePages();
