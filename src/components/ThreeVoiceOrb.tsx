"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import {
  Sphere,
  MeshDistortMaterial,
  Float,
  Environment,
  Stars,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

interface ThreeVoiceOrbProps {
  amplitude: number;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

// Floating particles around the orb
function ParticleField({ amplitude, isActive }: { amplitude: number; isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.5 + Math.random() * 2;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return [pos, vel];
  }, []);

  useFrame(({ clock }) => {
    if (!particlesRef.current || !particlesRef.current.geometry) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;
    const posAttr = particlesRef.current.geometry.attributes.position;
    if (!posAttr) return;
    const positions = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Orbital motion
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);

      // Rotate around center
      const angle = time * 0.1 + i * 0.01;
      const speed = isActive ? 0.3 + normalizedAmp * 0.5 : 0.1;

      positions[i3] = x * Math.cos(speed * 0.01) - z * Math.sin(speed * 0.01);
      positions[i3 + 2] = x * Math.sin(speed * 0.01) + z * Math.cos(speed * 0.01);

      // Pulse effect when active
      if (isActive) {
        const pulse = Math.sin(time * 4 + i) * 0.02 * normalizedAmp;
        const scale = 1 + pulse;
        positions[i3] *= scale;
        positions[i3 + 1] *= scale;
        positions[i3 + 2] *= scale;
      }
    }

    posAttr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#a78bfa"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Audio waveform ring
function AudioWaveRing({ amplitude, isActive }: { amplitude: number; isActive: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const ringCount = 3;

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;

    // Rotate and pulse
    ringRef.current.rotation.x = time * 0.2;
    ringRef.current.rotation.y = time * 0.3;

    const scale = isActive ? 1.8 + normalizedAmp * 0.3 : 1.8;
    ringRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={ringRef}>
      {[...Array(ringCount)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / ringCount) * Math.PI]}>
          <torusGeometry args={[1, 0.005, 16, 100]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#8b5cf6"
            emissiveIntensity={isActive ? 2 : 0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main glass orb with distortion
function GlassOrb({ amplitude, isListening, isSpeaking, isProcessing }: ThreeVoiceOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const isActive = isListening || isSpeaking || isProcessing;

  // Color based on state
  const color = useMemo(() => {
    if (isSpeaking) return "#8b5cf6"; // Purple when speaking
    if (isListening) return "#6366f1"; // Indigo when listening
    if (isProcessing) return "#a78bfa"; // Light purple when processing
    return "#4f46e5"; // Deep indigo idle
  }, [isListening, isSpeaking, isProcessing]);

  useFrame(({ clock }) => {
    if (!orbRef.current) return;
    const time = clock.getElapsedTime();
    const normalizedAmp = amplitude / 255;

    // Subtle rotation
    orbRef.current.rotation.y = time * 0.1;
    orbRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;

    // Scale pulse based on amplitude
    const baseScale = 1;
    const pulse = isActive ? Math.sin(time * 3) * 0.03 + normalizedAmp * 0.1 : 0;
    orbRef.current.scale.setScalar(baseScale + pulse);

    // Inner core animation
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.5;
      innerRef.current.rotation.z = time * 0.3;
      const innerScale = 0.3 + (isActive ? normalizedAmp * 0.1 : 0);
      innerRef.current.scale.setScalar(innerScale);
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group>
        {/* Outer glass orb */}
        <Sphere ref={orbRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.15}
            roughness={0}
            metalness={0.2}
            distort={isActive ? 0.3 + (amplitude / 255) * 0.2 : 0.1}
            speed={2}
            envMapIntensity={1}
          />
        </Sphere>

        {/* Inner energy core */}
        <Sphere ref={innerRef} args={[0.3, 32, 32]}>
          <meshStandardMaterial
            color="#fff"
            emissive={color}
            emissiveIntensity={isActive ? 3 : 1}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Glow layer */}
        <Sphere args={[1.02, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isActive ? 0.1 : 0.05}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Main scene
function Scene(props: ThreeVoiceOrbProps) {
  const isActive = props.isListening || props.isSpeaking || props.isProcessing;

  return (
    <>
      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Key lights */}
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, 2]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#6366f1" />

      {/* Subtle spotlight from above */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#a78bfa"
      />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Particle field */}
      <ParticleField amplitude={props.amplitude} isActive={isActive} />

      {/* Audio wave rings */}
      <AudioWaveRing amplitude={props.amplitude} isActive={isActive} />

      {/* Main orb */}
      <GlassOrb {...props} />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={isActive ? 1.5 : 0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={isActive ? new THREE.Vector2(0.002, 0.002) : new THREE.Vector2(0.001, 0.001)}
        />
        <Vignette
          darkness={0.5}
          offset={0.3}
        />
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
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
