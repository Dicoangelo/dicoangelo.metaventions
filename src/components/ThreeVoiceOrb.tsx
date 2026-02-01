"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ThreeVoiceOrbProps {
  amplitude: number;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

// Audio visualizer bars around the crystal
function AudioBars({ amplitude, isActive }: { amplitude: number; isActive: boolean }) {
  const barsRef = useRef<THREE.Group>(null);
  const barCount = 32;

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 1.8;
      return {
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
        rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
        index: i,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!barsRef.current) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;

    barsRef.current.children.forEach((bar, i) => {
      const mesh = bar as THREE.Mesh;
      // Create wave pattern
      const wave = Math.sin(time * 4 + i * 0.3) * 0.5 + 0.5;
      const ampEffect = isActive ? normalizedAmp * 0.8 : 0.1;
      const height = 0.1 + wave * ampEffect + (isActive ? 0.2 : 0.05);

      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, height, 0.2);
      mesh.position.y = mesh.scale.y / 2;

      // Color intensity based on height
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = height * 2;
    });

    // Rotate the whole visualizer
    barsRef.current.rotation.y = time * 0.2;
  });

  return (
    <group ref={barsRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.position} rotation={bar.rotation}>
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#6366f1"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Glass crystal gem
function CrystalGem({ amplitude, isListening, isSpeaking, isProcessing }: ThreeVoiceOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const isActive = isListening || isSpeaking || isProcessing;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;

    // Rotate crystal
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;

    // Pulse when active
    const baseScale = 1;
    const pulse = isActive ? Math.sin(time * 3) * 0.05 + normalizedAmp * 0.1 : 0;
    meshRef.current.scale.setScalar(baseScale + pulse);

    // Inner glow rotation
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.5;
      innerRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <group>
      {/* Outer glass crystal */}
      <Icosahedron ref={meshRef} args={[1, 1]} scale={1}>
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.2}
          temporalDistortion={0.1}
          transmission={1}
          roughness={0.1}
          ior={1.5}
          color="#a78bfa"
        />
      </Icosahedron>

      {/* Inner glowing core */}
      <Icosahedron ref={innerRef} args={[0.4, 0]} scale={1}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#8b5cf6"
          emissiveIntensity={isActive ? 2 : 0.8}
          transparent
          opacity={0.9}
        />
      </Icosahedron>
    </group>
  );
}

export default function ThreeVoiceOrb(props: ThreeVoiceOrbProps) {
  const isActive = props.isListening || props.isSpeaking || props.isProcessing;

  return (
    <div className="w-full h-full min-h-[250px] relative">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm" />

      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-3, -3, 2]} intensity={0.6} color="#8b5cf6" />
        <pointLight position={[0, -5, 0]} intensity={0.4} color="#6366f1" />

        {/* Audio visualizer ring */}
        <AudioBars amplitude={props.amplitude} isActive={isActive} />

        {/* Crystal gem in center */}
        <CrystalGem {...props} />
      </Canvas>
    </div>
  );
}
