import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>

        {/* LIGHT */}
        <ambientLight intensity={1} />

        {/* FLOOR */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2e2e2e" />
        </mesh>

        {/* BACK WALL */}
        <mesh position={[0, 5, -10]}>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#4b3b34" />
        </mesh>

        {/* TEST PAINTING */}
        <mesh position={[0, 4, -9.8]}>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* CAMERA CONTROL */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
        />

      </Canvas>
    </div>
  );
}
