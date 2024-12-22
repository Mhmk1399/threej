"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useRouter } from 'next/navigation';

interface BaseSceneProps {
  modelPath: string;
  scale?: number;
  redirectUrl: string;
}

const BaseScene: React.FC<BaseSceneProps> = ({ modelPath, scale = 0.7, redirectUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMountRef = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMountRef.clientWidth / currentMountRef.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMountRef.clientWidth, currentMountRef.clientHeight);
    renderer.setClearColor(0x000000, 0);
    currentMountRef.appendChild(renderer.domElement);
              // Ambient light for overall soft illumination
              const ambientLight = new THREE.AmbientLight(0xffffff, 1);
              scene.add(ambientLight);

              // Light attached to the camera
              const cameraLight = new THREE.PointLight(0xffffff, 0.7);
              camera.add(cameraLight);

              // Lights at 45 degrees
              const leftLight = new THREE.PointLight(0xffffff, 0.5);
              const rightLight = new THREE.PointLight(0xffffff, 0.5);

              // Function to update light positions
              const updateLightPositions = () => {
                const distance = 5; // Adjust this value based on your scene scale
                const angle = Math.PI / 4; // 45 degrees

                // Position lights relative to camera
                leftLight.position.set(
                  -Math.cos(angle) * distance,
                  0,
                  -Math.sin(angle) * distance
                ).applyMatrix4(camera.matrixWorld);

                rightLight.position.set(
                  Math.cos(angle) * distance,
                  0,
                  -Math.sin(angle) * distance
                ).applyMatrix4(camera.matrixWorld);
              };

              scene.add(camera);
              scene.add(leftLight);
              scene.add(rightLight);

              // Update light positions in the animation loop
              const animate = () => {
                requestAnimationFrame(animate);
                updateLightPositions();
                // ... (rest of your animation code)
              };

              animate();

              // ... (rest of the component code)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let model: THREE.Object3D;

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(scale, scale, scale);
        scene.add(model);

        const animate = () => {
          requestAnimationFrame(animate);
          model.rotation.y += 0.005;
          controls.update();
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const handleResize = () => {
      if (!currentMountRef) return;
      renderer.setSize(currentMountRef.clientWidth, currentMountRef.clientHeight);
      camera.aspect = currentMountRef.clientWidth / currentMountRef.clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Add click event listener
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / currentMountRef.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / currentMountRef.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(model, true);

      if (intersects.length > 0) {
        router.push(redirectUrl);
      }
    };

    currentMountRef.addEventListener('click', onClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      currentMountRef.removeEventListener('click', onClick);
      currentMountRef?.removeChild(renderer.domElement);
    };
  }, [modelPath, scale, redirectUrl, router]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "400px", position: "relative" }}></div>
  );
};

export default BaseScene;
