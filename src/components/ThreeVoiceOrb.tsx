"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ThreeVoiceOrbProps {
  amplitude: number;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

function OrbMesh({ amplitude, isListening, isSpeaking, isProcessing }: ThreeVoiceOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const isActive = isListening || isSpeaking || isProcessing;

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.1;

    // Distortion based on state
    let targetDistort = 0.3;
    let targetSpeed = 2;

    if (isSpeaking) {
      targetDistort = 0.4 + normalizedAmp * 0.3;
      targetSpeed = 4 + normalizedAmp * 3;
    } else if (isProcessing) {
      targetDistort = 0.5;
      targetSpeed = 5;
    } else if (isListening) {
      targetDistort = 0.35 + normalizedAmp * 0.2;
      targetSpeed = 3;
    }

    // Smooth transitions
    materialRef.current.distort = THREE.MathUtils.lerp(
      materialRef.current.distort,
      targetDistort,
      0.1
    );
    materialRef.current.speed = THREE.MathUtils.lerp(
      materialRef.current.speed,
      targetSpeed,
      0.1
    );

    // Pulse scale when active
    const baseScale = 1.6;
    const pulse = isActive ? Math.sin(time * 3) * 0.05 : 0;
    const targetScale = baseScale + pulse + (normalizedAmp * 0.15);
    const currentScale = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.1));
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.6}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#6366f1"
        emissive="#4f46e5"
        emissiveIntensity={isActive ? 0.3 : 0.1}
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

export default function ThreeVoiceOrb(props: ThreeVoiceOrbProps) {
  return (
    <div className="w-full h-full min-h-[250px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#8b5cf6" />
        <OrbMesh {...props} />
      </Canvas>
    </div>
  );
}
