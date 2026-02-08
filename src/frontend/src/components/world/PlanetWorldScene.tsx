import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { getInhabitantPosition, getInhabitantColor } from '../../utils/worldPlacement';

interface InhabitantData {
  position: [number, number, number];
  color: string;
  scale: number;
}

interface PlanetWorldSceneProps {
  inhabitantCount: number;
}

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#e8a87c"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

function StarShape() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.08;
    const innerRadius = 0.03;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return geometry;
}

function Inhabitants({ inhabitants }: { inhabitants: InhabitantData[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const starGeometry = StarShape();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      
      groupRef.current.children.forEach((child, index) => {
        const floatOffset = Math.sin(state.clock.getElapsedTime() * 2 + index * 0.5) * 0.02;
        const basePosition = inhabitants[index].position;
        child.position.set(
          basePosition[0],
          basePosition[1] + floatOffset,
          basePosition[2]
        );
      });
    }
  });

  return (
    <group ref={groupRef}>
      {inhabitants.map((inhabitant, index) => (
        <mesh
          key={index}
          position={inhabitant.position}
          scale={inhabitant.scale}
          geometry={starGeometry}
        >
          <meshStandardMaterial
            color={inhabitant.color}
            emissive={inhabitant.color}
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function PlanetWorldScene({ inhabitantCount }: PlanetWorldSceneProps) {
  const prevCountRef = useRef(0);

  const inhabitants = useMemo<InhabitantData[]>(() => {
    const newInhabitants: InhabitantData[] = [];
    const previousCount = prevCountRef.current;

    for (let i = 0; i < inhabitantCount; i++) {
      const position = getInhabitantPosition(i);
      const color = getInhabitantColor(i);
      const isNew = i >= previousCount;
      const scale = isNew ? 0 : 1;

      newInhabitants.push({ position, color, scale });
    }

    prevCountRef.current = inhabitantCount;
    return newInhabitants;
  }, [inhabitantCount]);

  const animatedInhabitants = useMemo<InhabitantData[]>(() => {
    return inhabitants.map((inhabitant, index) => {
      if (inhabitant.scale === 0) {
        setTimeout(() => {
          inhabitant.scale = 1;
        }, index * 50);
      }
      return inhabitant;
    });
  }, [inhabitants]);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: 'linear-gradient(to bottom, #0a0a1a, #1a0a2a)' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e8a87c" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Planet />
      <Inhabitants inhabitants={animatedInhabitants} />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
