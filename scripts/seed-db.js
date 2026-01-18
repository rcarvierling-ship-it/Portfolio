
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const DATA_DIR = path.join(process.cwd(), 'src/data');

function readJson(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) return [];
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        console.error("Read Error", e);
        return [];
    }
}

async function seed() {
    console.log("Seeding Database from local JSON...");

    // Projects
    const projects = readJson('projects.json');
    console.log(`Found ${projects.length} projects.`);
    for (const p of projects) {
        try {
            await sql`
            INSERT INTO projects (id, slug, title, description, content, tags, tools, year, location, camera, lens, cover_image, gallery_images, featured, status, version, created_at, updated_at, "order")
            VALUES (
                ${p.id}, ${p.slug}, ${p.title}, ${p.description}, ${JSON.stringify(p.content || {})}, 
                ${p.tags}, ${p.tools}, ${p.year}, ${p.location}, 
                ${p.camera}, ${p.lens}, ${p.coverImage}, ${p.galleryImages}, 
                ${p.featured}, ${p.status}, ${p.version}, ${p.createdAt}, ${p.updatedAt}, 
                ${p.order || 0}
            ) ON CONFLICT (id) DO NOTHING;
        `;
        } catch (e) {
            console.error(`Error seeding project ${p.slug}:`, e.message);
        }
    }

    // Analytics (Limit to last 500?)
    const analytics = readJson('analytics_events.json');
    console.log(`Found ${analytics.length} analytics events.`);
    const recent = analytics.slice(-500); // Last 500
    for (const e of recent) {
        try {
            await sql`
            INSERT INTO analytics_events (id, session_id, type, path, data, timestamp)
            VALUES (
                ${e.id}, ${e.sessionId}, ${e.type}, ${e.path}, 
                ${JSON.stringify(e.data || {})}, ${e.timestamp}
            ) ON CONFLICT (id) DO NOTHING;
        `;
        } catch (err) {
            console.error("Error seeding event:", err.message);
        }
    }

    console.log("Seeding complete.");
}

seed();
