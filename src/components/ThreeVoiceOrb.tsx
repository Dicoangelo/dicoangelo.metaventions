"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Html } from "@react-three/drei";
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
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Base colors
  const colorCyan = new THREE.Color("#22d3ee");
  const colorPurple = new THREE.Color("#a855f7");
  const colorMagenta = new THREE.Color("#ec4899");
  const colorWhite = new THREE.Color("#ffffff");
  const colorBlack = new THREE.Color("#000000");

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();

    // Rotate the orb
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.z = time * 0.1;

    // React to audio amplitude (smooth transition)
    // Normalize amplitude 0-1
    const normalizedAmp = amplitude / 255;
    
    // Distort based on state + amplitude
    let targetDistort = 0.3;
    let targetSpeed = 1.5;
    
    if (isSpeaking) {
      targetDistort = 0.5 + normalizedAmp * 0.8; // More distortion when speaking
      targetSpeed = 4 + normalizedAmp * 5;
    } else if (isProcessing) {
      targetDistort = 0.8;
      targetSpeed = 8;
    } else if (isListening) {
      targetDistort = 0.4 + normalizedAmp * 0.4;
      targetSpeed = 2;
    }

    // Lerp values for smoothness
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.1);

    // Color transition
    let targetColor = isLight ? colorCyan : colorCyan;
    if (isSpeaking) targetColor = colorPurple;
    else if (isProcessing) targetColor = colorMagenta;

    materialRef.current.color.lerp(targetColor, 0.1);
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.2}>
      <MeshDistortMaterial
        ref={materialRef}
        color={isLight ? "#22d3ee" : "#22d3ee"}
        envMapIntensity={0.4}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        metalness={0.1}
      />
    </Sphere>
  );
}

export default function ThreeVoiceOrb(props: ThreeVoiceOrbProps) {
  return (
    <div className="w-full h-full min-h-[300px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbMesh {...props} />
      </Canvas>
    </div>
  );
}
