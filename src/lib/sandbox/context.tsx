"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockStore, sandboxStore } from './store';

// We wrap the plain class in a React state to trigger re-renders
const SandboxContext = createContext<{
    store: MockStore;
    forceUpdate: () => void;
} | null>(null);

export function SandboxProvider({ children }: { children: React.ReactNode }) {
    // We use a tick to force updates because the store itself is mutable (in-memory)
    // In a real app we might use Zustand/Redux, but for a simple sandbox this is fine.
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Persist to local storage to simulate "session" but reset on full reload if desired?
    // User requested "changes reset on reload OR via reset button".
    // So simple in-memory is perfect.

    // Maybe we want ONE effect to just initialize if absolutely empty, but the class does that.

    return (
        <SandboxContext.Provider value={{ store: sandboxStore, forceUpdate }}>
            {children}
        </SandboxContext.Provider>
    );
}

export function useSandbox() {
    const ctx = useContext(SandboxContext);
    if (!ctx) throw new Error("useSandbox must be used within a SandboxProvider");
    return ctx;
}
