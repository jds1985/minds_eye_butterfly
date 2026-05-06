import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

const FiberCanvas = dynamic(
  async () => {
    const mod = await import("@react-three/fiber");
    return mod.Canvas;
  },
  { ssr: false }
);

const OrbitControls = dynamic(
  async () => {
    const mod = await import("@react-three/drei");
    return mod.OrbitControls;
  },
  { ssr: false }
);

export default function Home() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FiberCanvas camera={{ position: [0, 1.5, 4], fov: 60 }}>

        <ambientLight intensity={1} />

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#444" />
        </mesh>

        <mesh position={[0, 2.5, -3]}>
          <planeGeometry args={[10, 5]} />
          <meshStandardMaterial color="#775544" />
        </mesh>

        {/* Painting */}
        <mesh
          position={[-1.5, 2, -2.9]}
          onClick={() => setActive("painting")}
        >
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>

        <OrbitControls />

      </FiberCanvas>

      {/* MODAL */}
      {active && (
        <div style={styles.modal} onClick={() => setActive(null)}>
          <div style={styles.card}>
            <h2>Untitled</h2>

            <img
              src="/art/painting1.jpg"
              style={{ width: "100%" }}
            />

            <audio controls style={{ width: "100%" }}>
              <source src="/audio/painting1.mp3" />
            </audio>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#111",
    padding: "20px",
    width: "90%",
    maxWidth: "500px",
    color: "#fff"
  }
};
