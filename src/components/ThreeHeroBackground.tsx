"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

// Crystalline geometric structure
function CrystallineStructure({ mouse, scroll }: { mouse: { x: number; y: number }; scroll: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.LineSegments>(null!);

  // Create icosahedron geometry for crystalline look
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.8, 1), []);
  const wireGeometry = useMemo(() => new THREE.WireframeGeometry(geometry), [geometry]);

  useFrame((state, delta) => {
    if (!meshRef.current || !wireRef.current) return;

    // Smooth rotation based on mouse position
    const targetRotationX = mouse.y * 0.3;
    const targetRotationY = mouse.x * 0.3;

    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.02;

    // Continuous slow rotation
    meshRef.current.rotation.z += delta * 0.05;

    // Sync wireframe rotation
    wireRef.current.rotation.copy(meshRef.current.rotation);

    // Scale based on scroll (shrink as user scrolls)
    const targetScale = 1 - scroll * 0.3;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    wireRef.current.scale.copy(meshRef.current.scale);

    // Pulse effect
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    meshRef.current.scale.multiplyScalar(pulse);
    wireRef.current.scale.multiplyScalar(pulse);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={[0, 0, 0]}>
        {/* Inner glowing mesh */}
        <mesh ref={meshRef} geometry={geometry}>
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.2 + scroll * 0.1}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Wireframe overlay */}
        <lineSegments ref={wireRef} geometry={wireGeometry}>
          <lineBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.4}
            linewidth={1}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

// Orbiting particles around the structure
function OrbitingParticles({ scroll }: { scroll: number }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = 2.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    // Slow orbit
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;

    // Expand on scroll
    const scale = 1 + scroll * 0.5;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6 - scroll * 0.3}
      />
    </Points>
  );
}

// Background particle field
function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const count = 1500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;

      // Gradient from cyan to purple to pink
      const t = Math.random();
      if (t < 0.33) {
        color.set("#06b6d4"); // Cyan
      } else if (t < 0.66) {
        color.set("#8b5cf6"); // Purple
      } else {
        color.set("#ec4899"); // Pink
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 30;
    ref.current.rotation.y -= delta / 40;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

// Mouse tracker component
function MouseTracker({ onMouseMove }: { onMouseMove: (x: number, y: number) => void }) {
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      onMouseMove(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [onMouseMove, viewport]);

  return null;
}

export default function ThreeHeroBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for mobile and reduced motion
    setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleScroll = () => {
      const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      setScroll(scrollProgress);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Render simplified version on mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return (
      <div
        className={`absolute inset-0 -z-0 pointer-events-none ${
          isLight ? "opacity-20" : "opacity-30"
        }`}
      >
        {/* Static gradient fallback */}
        <div
          className="absolute inset-0"
          style={{
            background: isLight
              ? "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          }}
        />
        {/* Gradient edges */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isLight ? "from-white via-transparent to-white" : "from-[#0a0a0a] via-transparent to-[#0a0a0a]"
          }`}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 -z-0 pointer-events-none ${
        isLight ? "opacity-40 mix-blend-multiply" : "opacity-60 mix-blend-screen"
      }`}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{ antialias: true, alpha: true }}
      >
        <MouseTracker onMouseMove={(x, y) => setMouse({ x, y })} />

        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />

        {/* Main crystalline structure */}
        <CrystallineStructure mouse={mouse} scroll={scroll} />

        {/* Orbiting particles */}
        <OrbitingParticles scroll={scroll} />

        {/* Background particle field */}
        <ParticleField />
      </Canvas>

      {/* Gradient overlays to blend edges */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          isLight ? "from-white/90 via-transparent to-white/90" : "from-[#0a0a0a] via-transparent to-[#0a0a0a]"
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          isLight ? "from-white/70 via-transparent to-white/70" : "from-[#0a0a0a] via-transparent to-[#0a0a0a]"
        }`}
      />
    </div>
  );
}
