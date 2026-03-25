"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color, Group, MeshStandardMaterial } from "three";

interface TShirt3DProps {
  color?: string;
  autoRotate?: boolean;
  scale?: number;
}

useGLTF.preload("/models/shirt_baked.glb");

export function TShirt3D({
  color = "#e8c27a",
  autoRotate = true,
  scale = 2,
}: TShirt3DProps) {
  const groupRef = useRef<Group>(null);
  const col = useMemo(() => new Color(color), [color]);
  const { nodes, materials } = useGLTF("/models/shirt_baked.glb") as any;
  const material = useMemo(() => {
    const mat = (materials.lambert1 as MeshStandardMaterial).clone();
    mat.roughness = 0.8;
    return mat;
  }, [materials.lambert1]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
    if (material) {
      material.color.lerp(col, 0.1);
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={material}
        dispose={null}
      />
    </group>
  );
}
