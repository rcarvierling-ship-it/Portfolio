"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

function ParticleField() {
    // @ts-ignore
    const ref = useRef<any>(null);
    const count = 2000;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;   // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.05;
            ref.current.rotation.x += delta * 0.02;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#888888"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    )
}

export function ParticlesBackground() {
    return (
        <div className="absolute inset-0 z-[-1] opacity-50 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleField />
            </Canvas>
        </div>
    )
}
