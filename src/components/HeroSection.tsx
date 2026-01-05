import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { ChevronDown } from 'lucide-react';
import * as THREE from 'three';

const FloatingShapes = () => {
  const shapes = [
    { type: 'box', position: [2, 1, -5] as [number, number, number], rotation: [0.5, 0.5, 0] as [number, number, number] },
    { type: 'sphere', position: [-2, -1, -5] as [number, number, number], rotation: [0, 0.5, 0.5] as [number, number, number] },
    { type: 'torus', position: [0, 2, -5] as [number, number, number], rotation: [0.5, 0, 0.5] as [number, number, number] },
  ];

  return (
    <>
      {shapes.map((shape, index) => (
        <mesh key={index} position={shape.position} rotation={shape.rotation}>
          {shape.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {shape.type === 'sphere' && <sphereGeometry args={[0.7, 32, 32]} />}
          {shape.type === 'torus' && <torusGeometry args={[0.6, 0.3, 16, 100]} />}
          <meshStandardMaterial
            color={index === 0 ? '#7c3aed' : index === 1 ? '#3b82f6' : '#06b6d4'}
            emissive={index === 0 ? '#7c3aed' : index === 1 ? '#3b82f6' : '#06b6d4'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </>
  );
};

const AutoRotate = () => {
  useFrame(({ camera }) => {
    camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
    camera.position.z = Math.cos(Date.now() * 0.0005) * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const ParticleNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 100;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0005;
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.05} color="#7c3aed" transparent opacity={0.6} />
    </points>
  );
};

const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-blue to-vibrant-purple"
    >
      {/* Animated 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
          <FloatingShapes />
          <ParticleNetwork />
          <AutoRotate />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-navy/50 to-deep-navy z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-gradient"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AYUSH PATEL
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Full-Stack Developer | Problem Solver | Building Solutions That Matter
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={scrollToAbout}
              className="px-8 py-4 bg-gradient-to-r from-vibrant-purple to-tech-blue rounded-full font-semibold text-white shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore My Work
            </motion.button>
            <motion.a
              href="#contact"
              className="px-8 py-4 glass rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
      >
        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center text-white hover:text-vibrant-purple transition-colors"
        >
          <span className="text-sm mb-2">Scroll</span>
          <ChevronDown size={24} className="animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;

