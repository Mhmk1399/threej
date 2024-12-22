"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMountRef = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10); // Move camera back to see the stars

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1); // Set background to black
    currentMountRef.appendChild(renderer.domElement);

    // OrbitControls setup for full control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.01;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;
    // Star field setup
    const createStarField = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const starVertices = [];
      const starColors = [];
      const starCount = 10000;

      for (let i = 0; i < starCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(200);
        const y = THREE.MathUtils.randFloatSpread(200);
        const z = THREE.MathUtils.randFloatSpread(200);
        starVertices.push(x, y, z);

        // Add color variation for comet-like effect
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        starColors.push(r, g, b);
      }

      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starVertices, 3)
      );
      starGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(starColors, 3)
      );

      return new THREE.Points(starGeometry, starMaterial);
    };

    // Add star field to the scene
    const stars = createStarField();
    scene.add(stars);

    // Resize handling
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      // Slow, gentle movement for a calm walking effect
      camera.position.z -= 0.05;

      // Reset camera position when it gets too far
      if (camera.position.z < -200) {
        camera.position.z = 10;
      }

      // Gentle rotation of the entire star field
      stars.rotation.y += 0.0001;

      controls.update();
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    animate();

    // Clean up on unmount
    return () => {
      if (currentMountRef) {
        currentMountRef.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default ThreeScene;
