import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Orb3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {

    /* ================= GLOBAL PARTICLES ================= */
    const interval = setInterval(() => {
      if (window.tsParticles) {
        window.tsParticles.load("tsparticles", {
          fullScreen: { enable: false },

          particles: {
            number: { value: 120 },

            color: {
              value: ["#ffffff", "#ff0080", "#00c6ff", "#6a11cb"],
            },

            size: { value: { min: 1, max: 3 } },

            opacity: {
              value: 0.6,
              animation: {
                enable: true,
                speed: 1,
              },
            },

            move: {
              enable: true,
              speed: 0.4,
            },

            links: { enable: false },
          },

          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              repulse: {
                distance: 1,
              },
            },
          },

          detectRetina: true,
        });

        clearInterval(interval);
      }
    }, 300);

    /* ================= THREE JS ================= */

    const width = 600;
    const height = 500;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    mountRef.current.appendChild(renderer.domElement);

    /* ================= PLANET ================= */

    const geometry = new THREE.SphereGeometry(1.6, 64, 64);

    const material = new THREE.MeshStandardMaterial({
      color: 0xff00808,
      roughness: 0.0,
      metalness: 0.2,
      emissive: 0x6a11cb,
      emissiveIntensity: 0.4,
    });

    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    /* ================= RING ================= */

    const ringGeo = new THREE.RingGeometry(2,2.5, 1000);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00c6ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    /* ================= LIGHTING ================= */

    const light1 = new THREE.PointLight(0xffffff, 1.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff0080, 1.2);
    light2.position.set(-5, 0, 5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0x00c6ff, 1.2);
    light3.position.set(0, -5, 5);
    scene.add(light3);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    /* ================= ANIMATION ================= */

    const animate = () => {
      requestAnimationFrame(animate);

      planet.rotation.y += 0.003;
      ring.rotation.z += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {/* 🌌 GLOBAL PARTICLES (FULL SCREEN) */}
      <div
        id="tsparticles"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* 🪐 SATURN */}
      <div
        ref={mountRef}
        style={{
          position: "relative",
          zIndex: 2,
          width: "620px",
          height: "420px",
          margin: "auto",
        }}
      />
    </>
  );
};

export default Orb3D;