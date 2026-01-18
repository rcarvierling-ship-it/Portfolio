"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, MeshTransmissionMaterial, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

function Geometery() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.getElapsedTime()

        // Gentle rotation
        meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
        meshRef.current.rotation.y += 0.01

        // Slight floating movement (handled by Float wrapper mostly, but adding organic shift)
    })

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <MeshTransmissionMaterial
                backside
                samples={16}
                thickness={2}
                chromaticAberration={0.2}
                anisotropy={0.3}
                distortion={0.5}
                distortionScale={0.5}
                temporalDistortion={0.5}
                clearcoat={1}
                attenuationDistance={0.5}
                attenuationColor="#ffffff"
                color="#ffffff"
                bg="#000000"
            />
        </mesh>
    )
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 opacity-40 md:opacity-100 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Environment preset="city" />

                <Float
                    speed={2}
                    rotationIntensity={1}
                    floatIntensity={1}
                    floatingRange={[-0.2, 0.2]}
                >
                    <Geometery />
                </Float>

                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4.5} />
            </Canvas>
        </div>
    )
}
