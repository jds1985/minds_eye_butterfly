import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

// ❗ prevents SSR crash on mobile/Next
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

import { OrbitControls } from "@react-three/drei";

export default function Home() {
  const [active, setActive] = useState(null);

  const artworks = {
    painting: {
      title: "Untitled",
      image: "/art/painting1.jpg",
      audio: "/audio/painting1.mp3",
    },
    easel: {
      title: "Work in Progress",
      image: "/art/easel.jpg",
      audio: "/audio/easel.mp3",
    },
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 1.5, 4], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={null}>
          <Scene setActive={setActive} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* MODAL */}
      {active && (
        <div style={styles.modal} onClick={() => setActive(null)}>
          <div style={styles.card} onClick={(e) => e.stopPropagation()}>
            <h2>{artworks[active].title}</h2>

            <img src={artworks[active].image} style={styles.image} />

            <audio controls autoPlay style={{ width: "100%" }}>
              <source src={artworks[active].audio} />
            </audio>

            <button style={styles.btn}>
              this one is still here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🏡 3D SCENE */
function Scene({ setActive }) {
  return (
    <>
      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* BACK WALL */}
      <mesh position={[0, 2.5, -3]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#3a2f2a" />
      </mesh>

      {/* PAINTING */}
      <ClickableArt
        position={[-1.5, 2, -2.9]}
        size={[1.2, 0.8]}
        image="/art/painting1.jpg"
        onClick={() => setActive("painting")}
      />

      {/* EASEL (as plane for now) */}
      <ClickableArt
        position={[1.5, 1.5, -2.9]}
        size={[1, 1.2]}
        image="/art/easel.jpg"
        onClick={() => setActive("easel")}
      />
    </>
  );
}

/* 🖼️ CLICKABLE IMAGE PLANE */
function ClickableArt({ position, size, image, onClick }) {
  const texture = useTextureSafe(image);

  return (
    <mesh position={position} onClick={onClick}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

/* 🧰 safe texture loader */
function useTextureSafe(url) {
  const { useLoader } = require("@react-three/fiber");
  const THREE = require("three");
  return useLoader(THREE.TextureLoader, url);
}

const styles = {
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
    color: "#fff",
  },
  image: {
    width: "100%",
    marginBottom: "10px",
  },
  btn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
