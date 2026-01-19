"use client"

import { useSandbox } from "@/lib/sandbox/context"
import { Monitor, RefreshCcw, Lock, GripVertical, Trash2, Copy, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Reorder } from "framer-motion"

export default function SandboxProjects() {
    const { store, forceUpdate } = useSandbox();

    // We create a local state mirroring the store for smooth drag and drop
    // but we must sync it back to the store on reorder
    const projects = store.projects;

    const handleReorder = (newOrder: any[]) => {
        store.projects = newOrder;
        forceUpdate();
    }

    const handleDelete = (id: string) => {
        if (confirm("Delete this mock project? It's gone forever (until you reset).")) {
            store.deleteProject(id);
            forceUpdate();
        }
    }

    const handleDuplicate = (project: any) => {
        store.addProject({
            ...project,
            id: undefined, // let store generate
            title: `${project.title} (Copy)`,
            status: 'draft'
        });
        forceUpdate();
    }

    const handleCreate = () => {
        store.addProject({
            title: "New Sandbox Project",
            status: 'draft'
        });
        forceUpdate();
    }

    return (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Copy className="text-blue-500" />
                        Project Manager (Sandbox)
                    </h1>
                    <p className="text-muted-foreground">Drag to reorder. Changes here do NOT affect the real portfolio.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleCreate} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Plus size={16} /> New Project
                    </button>
                    <Link href="/sandbox" className="text-sm font-medium border px-4 py-2 rounded-lg hover:bg-secondary">
                        Back
                    </Link>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-[40px_1fr_100px_150px] gap-4 p-4 border-b bg-muted/30 font-bold text-sm text-muted-foreground uppercase tracking-wider">
                    <div></div>
                    <div>Project</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                </div>

                <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="divide-y divide-border">
                    {projects.map((project) => (
                        <Reorder.Item key={project.id} value={project} className="grid grid-cols-[40px_1fr_100px_150px] gap-4 p-4 items-center bg-card hover:bg-secondary/20 transition-colors select-none">
                            <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
                                <GripVertical size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{project.title}</h3>
                                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                    {project.tags.map(tag => <span key={tag} className="bg-secondary px-1.5 py-0.5 rounded">{tag}</span>)}
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        store.updateProject(project.id, { status: project.status === 'published' ? 'draft' : 'published' });
                                        forceUpdate();
                                    }}
                                    className={`text-xs px-2 py-1 rounded-full border font-bold uppercase w-24 text-center ${project.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}
                                >
                                    {project.status}
                                </button>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => handleDuplicate(project)} className="p-2 hover:bg-blue-500/10 text-blue-500 rounded transition-colors" title="Duplicate">
                                    <Copy size={18} />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No projects left! Create one or Reset Sandbox.
                </div>
            )}
        </div>
    )
}
