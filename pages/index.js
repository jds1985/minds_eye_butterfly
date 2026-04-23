import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);

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

  // 🌀 CAMERA MOVEMENT
  useEffect(() => {
    const handleMove = (x, y) => {
      const moveX = (x - window.innerWidth / 2) / 40;
      const moveY = (y - window.innerHeight / 2) / 40;

      if (containerRef.current) {
        containerRef.current.style.transform =
          `scale(1.05) translate(${-moveX}px, ${-moveY}px)`;
      }
    };

    const mouseMove = (e) => handleMove(e.clientX, e.clientY);
    const touchMove = (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchmove", touchMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("touchmove", touchMove);
    };
  }, []);

  return (
    <div style={styles.container}>

      {/* 🏡 MOVING ROOM */}
      <div ref={containerRef} style={styles.room}>
        <img src="/studio.jpg" style={styles.bg} />

        {/* PAINTING */}
        <div
          style={{ ...styles.hotspot, top: "30%", left: "25%" }}
          onClick={() => setActive("painting")}
        />

        {/* EASEL */}
        <div
          style={{ ...styles.hotspot, top: "55%", left: "60%" }}
          onClick={() => setActive("easel")}
        />
      </div>

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

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },
  room: {
    width: "110%",
    height: "110%",
    position: "absolute",
    top: "-5%",
    left: "-5%",
    transition: "transform 0.2s ease-out",
  },
  bg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  hotspot: {
    position: "absolute",
    width: "100px",
    height: "100px",
    cursor: "pointer",
  },
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
