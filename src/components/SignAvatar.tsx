
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SignAvatarProps {
  poseData?: number[][];
  isPlaying: boolean;
  word: string;
}

// Avatar model that will perform the signs
function Avatar({ poseData, isPlaying, word }: SignAvatarProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  
  // Animation state
  const animationState = useRef({
    currentFrame: 0,
    totalFrames: poseData?.length || 0,
    lastTime: 0
  });

  // Use the animation frame to update the avatar pose
  useFrame(() => {
    if (!isPlaying || !poseData || poseData.length === 0) return;
    
    const time = clock.current.getElapsedTime();
    if (time - animationState.current.lastTime > 0.1) { // 10 fps animation
      animationState.current.lastTime = time;
      
      // Update to next frame
      animationState.current.currentFrame = 
        (animationState.current.currentFrame + 1) % animationState.current.totalFrames;
      
      // Apply pose data to mesh
      if (mesh.current) {
        // In a real implementation, this would update the skeleton/bones
        // based on the pose data for the current frame
        mesh.current.rotation.y = Math.sin(time) * 0.3;
      }
    }
  });

  // Reset animation when word changes
  useEffect(() => {
    animationState.current.currentFrame = 0;
    animationState.current.totalFrames = poseData?.length || 0;
  }, [word, poseData]);

  return (
    <mesh ref={mesh} position={[0, -1, 0]} scale={1.7}>
      {/* Basic avatar placeholder - in a real app, this would be a detailed model */}
      <group>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.3, 1, 4, 8]} />
          <meshStandardMaterial color="#8894A7" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#F1C27D" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
          <meshStandardMaterial color="#8894A7" />
        </mesh>
        <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
          <meshStandardMaterial color="#8894A7" />
        </mesh>
        
        {/* Hands */}
        <mesh position={[0.7, 0, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#F1C27D" />
        </mesh>
        <mesh position={[-0.7, 0, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#F1C27D" />
        </mesh>
      </group>
    </mesh>
  );
}

const SignAvatar: React.FC<SignAvatarProps> = ({ poseData, isPlaying, word }) => {
  return (
    <div className="w-full h-64 border rounded-lg overflow-hidden shadow-sm bg-gradient-to-b from-blue-50 to-blue-100">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Avatar poseData={poseData} isPlaying={isPlaying} word={word} />
        <OrbitControls enablePan={false} />
      </Canvas>
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600 bg-white/70 py-1">
        3D Avatar visualization for "{word}"
      </div>
    </div>
  );
};

export default SignAvatar;
