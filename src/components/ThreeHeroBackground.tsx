"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

function ParticleField() {
    const ref = useRef<THREE.Points>(null!);
    const count = 2000;

    // Generate random positions nicely distributed
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Spread particles in a wide area
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Mix cyan and purple colors
            if (Math.random() > 0.5) {
                color.set("#22d3ee"); // Cyan
            } else {
                color.set("#a855f7"); // Purple
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return [positions, colors];
    }, []);

    useFrame((_state: any, delta: number) => {
        if (!ref.current) return;

        // Rotate the entire field slowly
        ref.current.rotation.x -= delta / 20;
        ref.current.rotation.y -= delta / 25;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

export default function ThreeHeroBackground() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <div className="absolute inset-0 -z-0 opacity-40 mix-blend-screen pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                {/* Lighting doesn't affect Basic Points material much but good to have */}
                <ambientLight intensity={0.5} />
                <ParticleField />
            </Canvas>
            {/* Gradient Overlay to fade edges */}
            <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white via-transparent to-white' : 'from-[#0a0a0a] via-transparent to-[#0a0a0a]'}`} />
            <div className={`absolute inset-0 bg-gradient-to-r ${isLight ? 'from-white via-transparent to-white' : 'from-[#0a0a0a] via-transparent to-[#0a0a0a]'}`} />
        </div>
    );
}
