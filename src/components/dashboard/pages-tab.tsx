"use client"

import { useState, useEffect } from "react"
import { Page, ContentBlock } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Plus, Edit3, Trash } from "lucide-react"

export function PagesTab() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = () => {
        fetch('/api/pages').then(res => res.json()).then(data => { setPages(data); setLoading(false); });
    }

    const handleCreate = () => {
        setEditingPage({
            title: "",
            slug: "",
            status: 'draft',
            blocks: []
        });
    }

    const handleSave = async () => {
        if (!editingPage?.title || !editingPage.slug) return alert("Title and Slug required");

        const pageToSave = {
            ...editingPage,
            id: editingPage.id || Date.now().toString(),
            updatedAt: new Date().toISOString()
        } as Page;

        if (!pageToSave.createdAt) pageToSave.createdAt = new Date().toISOString();

        try {
            await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageToSave)
            });
            fetchPages();
            setEditingPage(null);
        } catch (e) {
            alert("Failed to save");
        }
    }

    // --- Block Editor Logic ---
    const addBlock = (type: ContentBlock['type']) => {
        if (!editingPage) return;
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content: type === 'text' ? { html: "" } : type === 'image' ? { url: "" } : {}
        };
        setEditingPage({
            ...editingPage,
            blocks: [...(editingPage.blocks || []), newBlock]
        });
    };

    const updateBlock = (idx: number, content: any) => {
        if (!editingPage || !editingPage.blocks) return;
        const newBlocks = [...editingPage.blocks];
        newBlocks[idx] = { ...newBlocks[idx], content: { ...newBlocks[idx].content, ...content } };
        setEditingPage({ ...editingPage, blocks: newBlocks });
    };

    const removeBlock = (idx: number) => {
        if (!editingPage || !editingPage.blocks) return;
        const newBlocks = [...editingPage.blocks];
        newBlocks.splice(idx, 1);
        setEditingPage({ ...editingPage, blocks: newBlocks });
    };
    // -----------------------

    if (loading) return <div>Loading...</div>;

    if (editingPage) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{editingPage.id ? 'Edit Page' : 'New Page'}</h3>
                    <button onClick={() => setEditingPage(null)} className="text-sm underline">Cancel</button>
                </div>

                <div className="flex gap-4">
                    <input
                        placeholder="Page Title"
                        value={editingPage.title}
                        onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                        className="flex-1 p-2 rounded bg-secondary/30 border border-border"
                    />
                    <input
                        placeholder="slug (e.g. about)"
                        value={editingPage.slug}
                        onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                        className="flex-1 p-2 rounded bg-secondary/30 border border-border"
                    />
                    <select
                        value={editingPage.status || 'draft'}
                        onChange={e => setEditingPage({ ...editingPage, status: e.target.value as any })}
                        className="p-2 rounded bg-secondary/30 border border-border"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="space-y-4 border-t border-border pt-4">
                    <h4 className="font-bold">Content Blocks</h4>
                    {(editingPage.blocks || []).map((block, idx) => (
                        <div key={block.id} className="p-4 border border-border rounded bg-card relative">
                            <button onClick={() => removeBlock(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash size={14} /></button>
                            <div className="mb-2 text-xs uppercase font-bold text-muted-foreground">{block.type} BLOCK</div>

                            {block.type === 'text' && (
                                <textarea
                                    value={block.content.html || ""}
                                    onChange={e => updateBlock(idx, { html: e.target.value })}
                                    className="w-full p-2 h-24 bg-background border border-border rounded"
                                    placeholder="Enter text..."
                                />
                            )}
                            {/* Add logic for other block types */}
                            {block.type !== 'text' && <div className="text-sm italic text-muted-foreground">Editor logic for {block.type} not fully implemented yet.</div>}
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <button onClick={() => addBlock('text')} className="px-3 py-1 bg-secondary text-xs rounded hover:bg-secondary/80">+ Text</button>
                        <button onClick={() => addBlock('image')} className="px-3 py-1 bg-secondary text-xs rounded hover:bg-secondary/80">+ Image</button>
                        <button onClick={() => addBlock('gallery')} className="px-3 py-1 bg-secondary text-xs rounded hover:bg-secondary/80">+ Gallery</button>
                    </div>
                </div>

                <MagneticButton onClick={handleSave} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold">
                    Save Page
                </MagneticButton>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Pages</h3>
                <MagneticButton onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-full flex items-center gap-2">
                    <Plus size={16} /> New Page
                </MagneticButton>
            </div>
            <div className="space-y-2">
                {pages.map(page => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-card border border-border rounded">
                        <div className="font-medium">{page.title} <span className="text-muted-foreground text-sm font-normal">/{page.slug}</span></div>
                        <button onClick={() => setEditingPage(page)} className="p-2 hover:bg-secondary rounded"><Edit3 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    )
}
