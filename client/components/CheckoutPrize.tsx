"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { TShirt3D } from "./TShirt3D";

interface TShirtItem {
  color: string;
  name: string;
}

interface CheckoutPrizeProps {
  items: TShirtItem[];
}

interface ShirtConfig {
  x: number;
  y: number;
  z: number;
  rotY: number;
  delay: number;
  scale: number;
  opacity: number;
  color: string;
}

function layoutItems(items: TShirtItem[]): ShirtConfig[] {
  const maxFront = 5;
  const front = items.slice(0, maxFront);
  const back = items.slice(maxFront);
  const configs: ShirtConfig[] = [];

  const frontCount = front.length;
  const arcRadius = 3.5;
  const maxAngle = Math.min(frontCount - 1, 4) * 0.28;

  front.forEach((item, i) => {
    const t = frontCount === 1 ? 0 : (i / (frontCount - 1)) * 2 - 1;
    const angle = t * maxAngle;
    const x = arcRadius * Math.sin(angle);
    const z = arcRadius * Math.cos(angle) - arcRadius;
    const rotY = -angle * 0.6;
    const isCenter = i === Math.floor(frontCount / 2);
    const delayOrder =
      frontCount === 1
        ? [0]
        : frontCount === 2
          ? [0, 1]
          : frontCount === 3
            ? [1, 0, 2]
            : frontCount === 4
              ? [2, 1, 0, 3]
              : [2, 1, 0, 3, 4];
    const delayIdx = delayOrder[i];

    configs.push({
      x,
      y: isCenter ? 0.15 : 0,
      z,
      rotY,
      delay: 0.5 + delayIdx * 0.2,
      scale: isCenter ? 2.1 : 1.9,
      opacity: 1,
      color: item.color,
    });
  });

  const backCount = back.length;
  if (backCount > 0) {
    const backArcRadius = 5.5;
    const backMaxAngle = Math.min(backCount - 1, 4) * 0.25;

    back.forEach((item, i) => {
      const t = backCount === 1 ? 0 : (i / (backCount - 1)) * 2 - 1;
      const angle = t * backMaxAngle;
      const x = backArcRadius * Math.sin(angle);
      const z = backArcRadius * Math.cos(angle) - backArcRadius;

      configs.push({
        x,
        y: -0.1,
        z,
        rotY: -angle * 0.5,
        delay: 0.5 + maxFront * 0.2 + i * 0.15,
        scale: 1.5,
        opacity: 0.6,
        color: item.color,
      });
    });
  }

  return configs;
}

function SingleShirt({ config }: { config: ShirtConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0.1);

  useFrame((state) => {
    const t = state.clock.elapsedTime - config.delay;
    if (t < 0) {
      setScale(0.1);
      return;
    }
    if (t < 1) {
      const progress = t / 1;
      const eased = 1 - Math.pow(1 - progress, 4);
      setScale(0.1 + eased * (config.scale - 0.1));
    } else {
      setScale(config.scale);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group
      position={[config.x, config.y, config.z]}
      rotation={[0, config.rotY, 0]}
    >
      <group ref={groupRef} scale={scale}>
        <TShirt3D color={config.color} autoRotate={false} scale={1} />
      </group>
    </group>
  );
}

function Particles({ count = 60 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * -6 - 1,
      z: (Math.random() - 0.5) * 6,
      speed: 0.3 + Math.random() * 1.2,
      offset: Math.random() * Math.PI * 2,
      scale: 0.015 + Math.random() * 0.035,
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const y = ((p.y + t * p.speed) % 7) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.4 + p.offset) * 0.4,
        y,
        p.z + Math.cos(t * 0.3 + p.offset) * 0.3,
      );
      dummy.scale.setScalar(p.scale * (1 - Math.max(0, y / 6)));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#e8c27a"
        emissive="#e8c27a"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export function CheckoutPrize({ items }: CheckoutPrizeProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const displayItems = isMobile ? items.slice(0, 1) : items.slice(0, 5);
  const configs = useMemo(() => layoutItems(displayItems), [displayItems]);

  return (
    <>
      <ambientLight intensity={0.05} />

      <SpotLight
        position={[0, 10, 6]}
        color="#e8c27a"
        intensity={isMobile ? 180 : 150}
        angle={0.5}
        penumbra={1}
        distance={25}
        castShadow
      />
      <SpotLight
        position={[-6, 5, 4]}
        color="#e8c27a"
        intensity={isMobile ? 100 : 70}
        angle={0.35}
        penumbra={0.9}
        distance={18}
        castShadow
      />
      <SpotLight
        position={[6, 5, 4]}
        color="#e8c27a"
        intensity={isMobile ? 100 : 70}
        angle={0.35}
        penumbra={0.9}
        distance={18}
        castShadow
      />

      <pointLight position={[0, -1, -4]} intensity={2.5} color="#4a90d9" />
      <pointLight position={[0, -2, 4]} intensity={1.5} color="#e8c27a" />

      <fog attach="fog" args={["#000000", 6, 18]} />

      {configs.map((config, i) => (
        <SingleShirt key={i} config={config} />
      ))}

      <Particles count={isMobile ? 40 : 70} />

      <mesh position={[0, -2.5, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#080808" metalness={0.4} roughness={0.7} />
      </mesh>
    </>
  );
}
