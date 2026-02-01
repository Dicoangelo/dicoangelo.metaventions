"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

interface ThreeVoiceOrbProps {
  amplitude: number; // 0 to 255
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

function OrbMesh({ amplitude, isListening, isSpeaking, isProcessing }: ThreeVoiceOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Smooth color transitions
  const colors = useMemo(() => ({
    idle: new THREE.Color(isLight ? "#6366f1" : "#6366f1"),
    listening: new THREE.Color("#22c55e"),
    speaking: new THREE.Color("#a855f7"),
    processing: new THREE.Color("#f59e0b"),
  }), [isLight]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;

    // Dynamic distortion based on state
    let targetDistort = 0.2;
    let targetSpeed = 1;

    if (isSpeaking) {
      targetDistort = 0.3 + normalizedAmp * 0.5;
      targetSpeed = 3 + normalizedAmp * 4;
    } else if (isProcessing) {
      targetDistort = 0.5;
      targetSpeed = 6;
    } else if (isListening) {
      targetDistort = 0.25 + normalizedAmp * 0.3;
      targetSpeed = 2 + normalizedAmp * 2;
    }

    // Smooth transitions
    materialRef.current.distort = THREE.MathUtils.lerp(
      materialRef.current.distort,
      targetDistort,
      0.08
    );
    materialRef.current.speed = THREE.MathUtils.lerp(
      materialRef.current.speed,
      targetSpeed,
      0.08
    );

    // Color based on state
    let targetColor = colors.idle;
    if (isSpeaking) targetColor = colors.speaking;
    else if (isProcessing) targetColor = colors.processing;
    else if (isListening) targetColor = colors.listening;

    materialRef.current.color.lerp(targetColor, 0.06);

    // Scale pulse when active
    const isActive = isListening || isSpeaking || isProcessing;
    const targetScale = isActive ? 1.8 + normalizedAmp * 0.3 : 1.7;
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
    meshRef.current.scale.setScalar(newScale);

    // Glow effect
    if (glowRef.current) {
      const glowScale = newScale * 1.15;
      glowRef.current.scale.setScalar(glowScale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        isActive ? 0.15 + normalizedAmp * 0.1 : 0.08;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Main orb */}
        <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.7}>
          <MeshDistortMaterial
            ref={materialRef}
            color="#6366f1"
            distort={0.2}
            speed={1}
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.85}
            envMapIntensity={1}
          />
        </Sphere>

        {/* Outer glow */}
        <Sphere ref={glowRef} args={[1, 32, 32]} scale={1.95}>
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
}

export default function ThreeVoiceOrb(props: ThreeVoiceOrbProps) {
  return (
    <div className="w-full h-full min-h-[280px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.4} color="#6366f1" />
        <pointLight position={[0, -10, 5]} intensity={0.3} color="#8b5cf6" />

        {/* Environment for reflections */}
        <Environment preset="city" />

        <OrbMesh {...props} />
      </Canvas>
    </div>
  );
}
