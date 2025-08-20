import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useThreeJSAnimation = (canvasRef: React.RefObject<HTMLCanvasElement>, isActive: boolean) => {
  // Inicializar useRef con null o un valor por defecto
  const animationRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    // Inicializar Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true 
    });
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Crear partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
      colorArray[i] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesMeshRef.current = particlesMesh;
    
    camera.position.z = 5;

    const animate = () => {
      if (!isActive) return;
      
      animationRef.current = requestAnimationFrame(animate);
      
      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.x += 0.001;
        particlesMeshRef.current.rotation.y += 0.002;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    const handleResize = () => {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      // Limpiar recursos de Three.js
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (particlesMeshRef.current && sceneRef.current) {
        sceneRef.current.remove(particlesMeshRef.current);
      }
      
      // Limpiar geometry y material
      if (particlesMeshRef.current) {
        particlesMeshRef.current.geometry.dispose();
        if (Array.isArray(particlesMeshRef.current.material)) {
          particlesMeshRef.current.material.forEach(material => material.dispose());
        } else {
          particlesMeshRef.current.material.dispose();
        }
      }
    };
  }, [isActive, canvasRef]);
};