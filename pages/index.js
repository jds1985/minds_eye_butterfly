import { useState } from "react";

export default function Home() {
  const [activeArt, setActiveArt] = useState(null);

  const artworks = [
    {
      id: "painting1",
      title: "Untitled I",
      image: "/art/painting1.jpg",
      audio: "/audio/painting1.mp3",
    },
    {
      id: "easel",
      title: "Work in Progress",
      image: "/art/easel.jpg",
      audio: "/audio/easel.mp3",
    },
  ];

  return (
    <div style={styles.container}>
      
      {/* 🏡 STUDIO BACKGROUND */}
      <img
        src="/studio.jpg"
        alt="Liz Studio"
        style={styles.background}
      />

      {/* 🎯 HOTSPOTS */}

      {/* Wall Painting */}
      <div
        style={{ ...styles.hotspot, top: "30%", left: "20%" }}
        onClick={() => setActiveArt(artworks[0])}
      />

      {/* Easel */}
      <div
        style={{ ...styles.hotspot, top: "50%", left: "60%" }}
        onClick={() => setActiveArt(artworks[1])}
      />

      {/* 📦 MODAL */}
      {activeArt && (
        <div style={styles.modal} onClick={() => setActiveArt(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            <h2>{activeArt.title}</h2>

            <img
              src={activeArt.image}
              style={{ width: "100%", borderRadius: "8px" }}
            />

            <audio controls autoPlay style={{ marginTop: "10px", width: "100%" }}>
              <source src={activeArt.audio} type="audio/mpeg" />
            </audio>

            <button style={styles.button}>
              this one is still here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  background: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  hotspot: {
    position: "absolute",
    width: "80px",
    height: "80px",
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.0)",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    background: "#111",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
    color: "#fff",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
