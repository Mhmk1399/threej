"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface DiceSceneProps {
  height?: string; // Allow user to adjust height as a prop
}

const DiceScene = ({ height = "50vh" }: DiceSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMountRef = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 20); // Optional fog for depth

    const width = currentMountRef.clientWidth;
    const height = currentMountRef.clientHeight;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    currentMountRef.appendChild(renderer.domElement);

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth rotation
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom for a fixed focus

    // Dice geometry
    const diceSize = 4;
    const diceGeometry = new THREE.BoxGeometry(diceSize, diceSize, diceSize);

    // Load textures for each face
    const textureLoader = new THREE.TextureLoader();
    const faceImages = [
      "/assets/images/banneranalytics.png", // Front face
      "/assets/images/bannercontent.png", // Back face
      "/assets/images/bannerSEO.png", // Left face
      "/assets/images/bannersuport.png", // Right face
      "/assets/images/bannerwebdesign.png", // Top face
      "/assets/images/T.png", // Bottom face
    ];

    // Use MeshStandardMaterial for emissive effect (glow)
    const diceMaterials = faceImages.map((img) => {
      return new THREE.MeshStandardMaterial({
        map: textureLoader.load(img),
        emissive: new THREE.Color(0x333333), // Base emissive color
        emissiveIntensity: 0.5, // Emissive intensity (for glowing effect)
      });
    });

    // Dice mesh with materials for each face
    const dice = new THREE.Mesh(diceGeometry, diceMaterials);
    scene.add(dice);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 2.5); // Increased from 1.5 to 2.5
    scene.add(ambientLight);

    // Main PointLight for the glowing effect
    const pointLight = new THREE.PointLight(0xffffff, 2, 100); // Increased from 1.5 to 2
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Spotlight to enhance the glowing look
    const spotlight = new THREE.SpotLight(0xffa500, 3, 20, Math.PI / 4); // Increased from 2 to 3
    spotlight.position.set(10, 10, 10);
    scene.add(spotlight);

    // Glowing animation for the dice
    const glowLight = new THREE.PointLight(0xffff99, 1, 50); // Yellowish glow
    glowLight.position.set(0, 0, 8); // Positioned near the dice
    scene.add(glowLight);

    const secondPointLight = new THREE.PointLight(0xffffff, 1, 100);
    secondPointLight.position.set(-5, -5, -5);
    scene.add(secondPointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Animation variables
    let rolling = true;
    const rotationSpeed = 0.01;

    let glowIntensity = 0;
    let glowIncreasing = true;

    // Animation loop (rotation and glowing light)
    const animate = () => {
      requestAnimationFrame(animate);

      // Only rotate if not hovered
      if (rolling) {
        dice.rotation.x += rotationSpeed;
        dice.rotation.y += rotationSpeed;
        dice.rotation.z += rotationSpeed;
      }

      // Update the glowing light intensity (pulse effect)
      if (glowIncreasing) {
        glowIntensity += 0.02;
        if (glowIntensity > 1.5) glowIncreasing = false;
      } else {
        glowIntensity -= 0.02;
        if (glowIntensity < 0) glowIncreasing = true;
      }

      glowLight.intensity = glowIntensity; // Apply pulsing to light
      diceMaterials.forEach((material) => {
        material.emissiveIntensity = glowIntensity * 0.5; // Pulsing glow
      });

      // Update orbit controls
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // Mouse hover effect to stop rotation
    const onHover = () => {
      rolling = false;
    };

    const onHoverOut = () => {
      rolling = true;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse move for hover detection
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(dice);

      if (intersects.length > 0) {
        onHover();
        setHovered(true);
      } else {
        onHoverOut();
        setHovered(false);
      }
    };

    // Handle mouse click to show popup message for each face
    const handleMouseClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(dice);

      if (intersects.length > 0) {
        alert(
          "این بخش از سایت ما در دست تعمیر هستش. لطفا برای دریافت اطلاعات بیشتر از خدمات مجموعه تومک با شماره : 09015528576 تماس حاصل فرمایید.\n\nممنون از صبر و شکیباییتون.\nتیم فنی مجموعه تومک"
        );
      }
    };

    // Event listeners for mouse interaction
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);

    // Handle window resize
    const handleResize = () => {
      const width = currentMountRef.clientWidth;
      const height = currentMountRef.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      currentMountRef.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height, // Use the height passed from props
        cursor: hovered ? "pointer" : "default",
      }}
    />
  );
};

export default DiceScene;
