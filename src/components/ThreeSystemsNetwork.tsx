"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Html, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

interface SystemNode {
    id: string;
    name: string;
    description: string;
    metric: string;
    position: [number, number, number];
    connections: string[]; // IDs of connected nodes
}

const SYSTEMS: SystemNode[] = [
    { id: "cog", name: "Cognitive OS", description: "Energy-aware task routing", metric: "Circadian-adaptive", position: [0, 2, 0], connections: ["dq", "mac", "obs"] },
    { id: "dq", name: "DQ Routing", description: "Decision Quality scoring", metric: "0.889 score", position: [-2, 0.5, 0], connections: ["rec", "ace"] },
    { id: "rec", name: "Recovery Engine", description: "Self-healing & detection", metric: "70% auto-fix", position: [-2, -1.5, 0], connections: ["obs"] },
    { id: "mem", name: "Supermemory", description: "Cross-session learning", metric: "700+ patterns", position: [2, 0.5, 0], connections: ["lh", "ctx"] },
    { id: "mac", name: "Multi-Agent", description: "Parallel orchestration", metric: "3+ concurrent", position: [0, 0, 0], connections: ["dq", "mem", "ace"] },
    { id: "ace", name: "ACE Consensus", description: "Adaptive Consensus", metric: "50% faster", position: [0, -2, 0], connections: ["mac"] },
    { id: "obs", name: "Observatory", description: "Unified analytics", metric: "Real-time", position: [-3, 1.5, 1], connections: [] },
    { id: "ctx", name: "Context Packs", description: "Semantic selection", metric: "Smart prefetch", position: [3, 1.5, 1], connections: ["mac"] },
    { id: "lh", name: "Learning Hub", description: "Cross-domain correlation", metric: "Weekly sync", position: [2, -1.5, 0], connections: [] },
];

function Node({ data, hoveredNode, setHoveredNode }: { data: SystemNode; hoveredNode: string | null; setHoveredNode: (id: string | null) => void }) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const meshRef = useRef<THREE.Mesh>(null!);
    const isHovered = hoveredNode === data.id;

    useFrame((state: any) => {
        if (!meshRef.current) return;
        // Gentle floating
        meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime + data.position[0]) * 0.1;

        // Scale up on hover
        const targetScale = isHovered ? 1.5 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    const color = isLight ? (isHovered ? "#4f46e5" : "#6366f1") : (isHovered ? "#a855f7" : "#818cf8");

    return (
        <group position={data.position as any}>
            <Sphere
                ref={meshRef}
                args={[0.3, 32, 32]}
                onClick={() => setHoveredNode(isHovered ? null : data.id)}
                onPointerOver={() => setHoveredNode(data.id)}
                onPointerOut={() => setHoveredNode(null)}
            >
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isHovered ? 2 : 0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>

            {/* Label (Always visible but small, bigger on hover) */}
            <Text
                position={[0, -0.6, 0]}
                fontSize={isHovered ? 0.35 : 0.25}
                color={isLight ? "#1f2937" : "#e5e7eb"}
                anchorX="center"
                anchorY="top"
            >
                {data.name}
            </Text>

            {/* Info Card (Visible on hover) */}
            {isHovered && (
                <Html distanceFactor={10}>
                    <div className={`p-3 rounded-xl border shadow-xl w-48 pointer-events-none backdrop-blur-md transition-all duration-200 transform translate-y-4 ${isLight
                        ? "bg-white/90 border-indigo-100 text-gray-800"
                        : "bg-black/80 border-indigo-500/30 text-white"
                        }`}>
                        <h4 className="font-bold text-sm mb-1 text-indigo-500">{data.name}</h4>
                        <p className="text-xs mb-2 opacity-90 leading-tight">{data.description}</p>
                        <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded inline-block ${isLight ? "bg-indigo-50 text-indigo-600" : "bg-indigo-500/20 text-indigo-300"
                            }`}>
                            {data.metric}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

function Connections({ systems }: { systems: SystemNode[] }) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const lines = useMemo(() => {
        const l: any[] = [];
        systems.forEach(node => {
            node.connections.forEach(targetId => {
                const target = systems.find(s => s.id === targetId);
                if (target) {
                    l.push({
                        start: new THREE.Vector3(...node.position),
                        end: new THREE.Vector3(...target.position),
                        id: `${node.id}-${target.id}`
                    });
                }
            });
        });
        return l;
    }, [systems]);

    return (
        <>
            {lines.map((line) => (
                <Line
                    key={line.id}
                    points={[line.start, line.end]}
                    color={isLight ? "#cbd5e1" : "#4b5563"}
                    lineWidth={1}
                    transparent
                    opacity={0.3}
                />
            ))}
        </>
    );
}

export default function ThreeSystemsNetwork() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <div className="w-full h-[600px] relative rounded-2xl overflow-hidden touch-none cursor-move">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <group rotation={[0, 0, 0]}>
                    <Connections systems={SYSTEMS} />
                    {SYSTEMS.map(sys => (
                        <Node
                            key={sys.id}
                            data={sys}
                            hoveredNode={hoveredNode}
                            setHoveredNode={setHoveredNode}
                        />
                    ))}
                </group>
                {/* Helper Instructions */}
                <Html position={[0, -3.5, 0]} center>
                    <div className="pointer-events-none opacity-50 text-[10px] uppercase tracking-widest text-center">
                        Interactive Network
                    </div>
                </Html>
            </Canvas>
        </div>
    );
}
