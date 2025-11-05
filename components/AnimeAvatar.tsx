"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SignGloss } from "@/lib/types";
import { GlobalSettings } from "@/app/page";
import { getSignAnimation } from "@/lib/animationEngine";

interface AnimeAvatarProps {
  gloss: SignGloss | null;
  isActive: boolean;
  settings: GlobalSettings;
}

function AnimeCharacter({
  gloss,
  isActive,
}: {
  gloss: SignGloss | null;
  isActive: boolean;
}) {
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftEyebrowRef = useRef<THREE.Mesh>(null);
  const rightEyebrowRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  const [currentAnimations, setCurrentAnimations] = useState<any[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const idleAnimation = useRef(0);

  useEffect(() => {
    if (gloss) {
      const animations = getSignAnimation(gloss);
      setCurrentAnimations(animations);
      setAnimationProgress(0);
    }
  }, [gloss]);

  useFrame((state, delta) => {
    if (!isActive) {
      idleAnimation.current += delta * 0.5;

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(idleAnimation.current) * 0.1;
        headRef.current.position.y = 1.2 + Math.sin(idleAnimation.current * 2) * 0.02;
      }

      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(idleAnimation.current) * 0.05 + 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -Math.sin(idleAnimation.current) * 0.05 - 0.3;
      }

      return;
    }

    if (currentAnimations.length > 0 && headRef.current) {
      setAnimationProgress((prev) => {
        const newProgress = prev + delta * 2;
        return newProgress > 1 ? 0 : newProgress;
      });

      const currentAnim = currentAnimations[0];
      const t = animationProgress;

      if (currentAnim.head && headRef.current) {
        if (currentAnim.head.tilt) {
          headRef.current.rotation.z = THREE.MathUtils.lerp(
            headRef.current.rotation.z,
            currentAnim.head.tilt * 0.3,
            0.1
          );
        }
        if (currentAnim.head.nod) {
          headRef.current.rotation.x = Math.sin(t * Math.PI * 2) * 0.2;
        }
        if (currentAnim.head.shake) {
          headRef.current.rotation.y = Math.sin(t * Math.PI * 4) * 0.3;
        }
      }

      if (currentAnim.eyebrows && leftEyebrowRef.current && rightEyebrowRef.current) {
        const eyebrowRaise = currentAnim.eyebrows === "raised" ? 0.05 : -0.02;
        leftEyebrowRef.current.position.y = 1.55 + eyebrowRaise;
        rightEyebrowRef.current.position.y = 1.55 + eyebrowRaise;
      }

      if (currentAnim.mouth && mouthRef.current) {
        mouthRef.current.scale.y = currentAnim.mouth === "open" ? 1.5 : 1;
      }

      if (currentAnim.leftArm && leftArmRef.current) {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          currentAnim.leftArm.rotation.z || 0.3,
          0.1
        );
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          currentAnim.leftArm.rotation.x || 0,
          0.1
        );
        leftArmRef.current.position.y = THREE.MathUtils.lerp(
          leftArmRef.current.position.y,
          currentAnim.leftArm.position.y || 0.5,
          0.1
        );
      }

      if (currentAnim.rightArm && rightArmRef.current) {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          currentAnim.rightArm.rotation.z || -0.3,
          0.1
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          currentAnim.rightArm.rotation.x || 0,
          0.1
        );
        rightArmRef.current.position.y = THREE.MathUtils.lerp(
          rightArmRef.current.position.y,
          currentAnim.rightArm.position.y || 0.5,
          0.1
        );
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />

      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1.2, 32]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      <mesh ref={headRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffd7ba" />
      </mesh>

      <mesh position={[-0.15, 1.3, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 1.3, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      <mesh position={[-0.15, 1.32, 0.35]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 1.32, 0.35]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh ref={leftEyebrowRef} position={[-0.15, 1.55, 0.3]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.15, 0.03, 0.02]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh ref={rightEyebrowRef} position={[0.15, 1.55, 0.3]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.15, 0.03, 0.02]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>

      <mesh ref={mouthRef} position={[0, 1.05, 0.35]}>
        <boxGeometry args={[0.15, 0.04, 0.02]} />
        <meshStandardMaterial color="#8b4545" />
      </mesh>

      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>

      <group ref={leftArmRef} position={[-0.5, 0.5, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color="#ffd7ba" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffd7ba" />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.5, 0.5, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color="#ffd7ba" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffd7ba" />
        </mesh>
      </group>

      <mesh position={[-0.25, -0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 16]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh position={[0.25, -0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 16]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      <mesh position={[-0.25, -1.1, 0.1]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
      <mesh position={[0.25, -1.1, 0.1]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
    </group>
  );
}

export default function AnimeAvatar({
  gloss,
  isActive,
  settings,
}: AnimeAvatarProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 50 }}
      style={{ background: "linear-gradient(to bottom, #1e293b, #0f172a)" }}
    >
      <AnimeCharacter gloss={gloss} isActive={isActive} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}
