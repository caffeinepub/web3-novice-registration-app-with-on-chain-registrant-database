import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { getInhabitantPosition, getInhabitantColor } from '../../utils/worldPlacement';

interface InhabitantProps {
  position: [number, number, number];
  color: string;
  isNew: boolean;
}

interface InhabitantData {
  index: number;
  position: [number, number, number];
  color: string;
  isNew: boolean;
}

function Inhabitant({ position, color, isNew }: InhabitantProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(isNew ? 0 : 1);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Animate new inhabitants appearing
      if (isNew && scaleRef.current < 1) {
        scaleRef.current = Math.min(1, scaleRef.current + delta * 2);
        meshRef.current.scale.setScalar(scaleRef.current);
      }
      
      // Gentle floating animation
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={isNew ? 0 : 1}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#1a4d2e"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

interface PlanetWorldSceneProps {
  count: number;
  previousCount: number;
}

export default function PlanetWorldScene({ count, previousCount }: PlanetWorldSceneProps) {
  const inhabitants = useMemo(() => {
    const result: InhabitantData[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        index: i,
        position: getInhabitantPosition(i),
        color: getInhabitantColor(i),
        isNew: i >= previousCount,
      });
    }
    return result;
  }, [count, previousCount]);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      className="w-full h-full"
    >
      <color attach="background" args={['#0a0a0a']} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Planet />
      
      {inhabitants.map((inhabitant) => (
        <Inhabitant
          key={inhabitant.index}
          position={inhabitant.position}
          color={inhabitant.color}
          isNew={inhabitant.isNew}
        />
      ))}
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
