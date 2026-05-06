import { useEffect, useRef } from "react";

export default function Home() {
  const roomRef = useRef(null);

  useEffect(() => {
    const move = (x, y) => {
      const mouseX = (x - window.innerWidth / 2) / 50;
      const mouseY = (y - window.innerHeight / 2) / 50;

      if (roomRef.current) {
        roomRef.current.style.transform =
          `translate(${mouseX}px, ${mouseY}px) scale(1.05)`;
      }
    };

    const mouseMove = (e) => move(e.clientX, e.clientY);

    const touchMove = (e) => {
      const t = e.touches[0];
      move(t.clientX, t.clientY);
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

      {/* ROOM */}
      <div ref={roomRef} style={styles.room}>

        {/* BACK WALL */}
        <img src="/layers/backwall.png" style={styles.backwall} />

        {/* MID LAYER */}
        <img src="/layers/mid.png" style={styles.mid} />

        {/* FOREGROUND */}
        <img src="/layers/front.png" style={styles.front} />

      </div>

      {/* TITLE */}
      <div style={styles.logo}>
        MINDS EYE BUTTERFLY 🦋
      </div>

    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#111",
    position: "relative",
  },

  room: {
    width: "110%",
    height: "110%",
    position: "absolute",
    top: "-5%",
    left: "-5%",
    transition: "transform 0.15s linear",
  },

  backwall: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
  },

  mid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 2,
  },

  front: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 3,
  },

  logo: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
    zIndex: 10,
    letterSpacing: "2px",
  }
};
