"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sphere,
  MeshDistortMaterial,
  Float,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

interface ThreeVoiceOrbProps {
  amplitude: number;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

// Smooth orbiting particles (fewer, larger, calmer)
function ParticleField({ amplitude, isActive }: { amplitude: number; isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 40;

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.8 + Math.random() * 1.2;
      return {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        radius,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = Math.min(amplitude / 255, 1);

    // Smooth group rotation
    const speed = isActive ? 0.15 + normalizedAmp * 0.1 : 0.05;
    groupRef.current.rotation.y += speed * 0.01;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Animate individual particles
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;
      const mesh = child as THREE.Mesh;

      // Gentle breathing effect
      const breathe = Math.sin(time * 0.8 + p.offset) * 0.1;
      const activeBoost = isActive ? normalizedAmp * 0.15 : 0;
      const scale = 1 + breathe + activeBoost;
      mesh.scale.setScalar(scale);

      // Fade based on activity
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive ? 0.5 + normalizedAmp * 0.3 : 0.25;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Smooth orbital rings
function OrbitalRings({ amplitude, isActive }: { amplitude: number; isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = Math.min(amplitude / 255, 1);

    groupRef.current.rotation.x = time * 0.15;
    groupRef.current.rotation.y = time * 0.1;

    const scale = isActive ? 1.6 + normalizedAmp * 0.15 : 1.6;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 3) * Math.PI]}>
          <torusGeometry args={[1, 0.003, 16, 128]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#8b5cf6"
            emissiveIntensity={isActive ? 1.5 : 0.3}
            transparent
            opacity={isActive ? 0.35 : 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main glass orb — smooth distortion, no jitter
function GlassOrb({ amplitude, isListening, isSpeaking, isProcessing }: ThreeVoiceOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const smoothAmpRef = useRef(0);
  const isActive = isListening || isSpeaking || isProcessing;

  const color = useMemo(() => {
    if (isSpeaking) return "#8b5cf6";
    if (isListening) return "#6366f1";
    if (isProcessing) return "#a78bfa";
    return "#4f46e5";
  }, [isListening, isSpeaking, isProcessing]);

  useFrame(({ clock }) => {
    if (!orbRef.current) return;
    const time = clock.getElapsedTime();

    // Smooth the amplitude with lerp (key fix for static/jitter)
    const targetAmp = amplitude / 255;
    smoothAmpRef.current += (targetAmp - smoothAmpRef.current) * 0.08;
    const smoothAmp = smoothAmpRef.current;

    // Gentle rotation
    orbRef.current.rotation.y = time * 0.08;
    orbRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;

    // Smooth breathing scale
    const breathe = Math.sin(time * 1.5) * 0.02;
    const ampScale = isActive ? smoothAmp * 0.08 : 0;
    orbRef.current.scale.setScalar(1 + breathe + ampScale);

    // Inner core
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.3;
      innerRef.current.rotation.z = time * 0.2;
      const innerScale = 0.25 + (isActive ? smoothAmp * 0.08 : 0);
      innerRef.current.scale.setScalar(innerScale);
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <group>
        {/* Outer orb — low distortion, smooth */}
        <Sphere ref={orbRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.18}
            roughness={0.1}
            metalness={0.3}
            distort={isActive ? 0.15 : 0.05}
            speed={1.5}
          />
        </Sphere>

        {/* Inner energy core */}
        <Sphere ref={innerRef} args={[0.25, 32, 32]}>
          <meshStandardMaterial
            color="#fff"
            emissive={color}
            emissiveIntensity={isActive ? 2.5 : 0.8}
            transparent
            opacity={0.85}
          />
        </Sphere>

        {/* Soft glow shell */}
        <Sphere args={[1.05, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isActive ? 0.08 : 0.03}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Scene — no ChromaticAberration, calmer bloom
function Scene(props: ThreeVoiceOrbProps) {
  const isActive = props.isListening || props.isSpeaking || props.isProcessing;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, -5, 2]} intensity={0.4} color="#8b5cf6" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={1}
        intensity={0.4}
        color="#a78bfa"
      />

      <ParticleField amplitude={props.amplitude} isActive={isActive} />
      <OrbitalRings amplitude={props.amplitude} isActive={isActive} />
      <GlassOrb {...props} />

      <EffectComposer>
        <Bloom
          intensity={isActive ? 0.8 : 0.4}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette darkness={0.4} offset={0.3} />
      </EffectComposer>
    </>
  );
}

export default function ThreeVoiceOrb(props: ThreeVoiceOrbProps) {
  return (
    <div className="w-full h-full min-h-[250px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
