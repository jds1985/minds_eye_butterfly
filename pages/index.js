import { useState } from "react";

export default function Home() {
  const [active, setActive] = useState(null);
  const [phoneIndex, setPhoneIndex] = useState(0);

  const phoneImages = [
    "/art/painting1.jpg",
    "/art/easel.jpg",
    "/art/sketch1.jpg"
  ];

  const artworks = {
    painting: {
      title: "Untitled I",
      image: "/art/painting1.jpg",
      audio: "/audio/painting1.mp3",
    },
    easel: {
      title: "Work in Progress",
      image: "/art/easel.jpg",
      audio: "/audio/easel.mp3",
    },
    sketchbook: {
      title: "Sketchbook",
      images: [
        "/art/sketch1.jpg",
        "/art/painting1.jpg"
      ]
    },
    phone: {
      title: "Phone"
    }
  };

  return (
    <div style={styles.container}>

      {/* ROOM */}
      <img src="/studio.jpg" style={styles.bg} />

      {/* PAINTING */}
      <div style={{ ...styles.hotspot, top: "30%", left: "20%" }}
        onClick={() => setActive("painting")}
      />

      {/* EASEL */}
      <div style={{ ...styles.hotspot, top: "50%", left: "60%" }}
        onClick={() => setActive("easel")}
      />

      {/* SKETCHBOOK */}
      <div style={{ ...styles.hotspot, top: "70%", left: "40%" }}
        onClick={() => setActive("sketchbook")}
      />

      {/* PHONE */}
      <div style={{ ...styles.hotspot, top: "65%", left: "75%" }}
        onClick={() => setActive("phone")}
      />

      {/* MODAL */}
      {active && (
        <div style={styles.modal} onClick={() => setActive(null)}>
          <div style={styles.card} onClick={(e) => e.stopPropagation()}>

            <h2>{artworks[active].title}</h2>

            {/* NORMAL ART */}
            {active === "painting" || active === "easel" ? (
              <>
                <img src={artworks[active].image} style={styles.image} />

                <audio controls autoPlay style={{ width: "100%" }}>
                  <source src={artworks[active].audio} />
                </audio>

                <button style={styles.btn}>
                  this one is still here
                </button>
              </>
            ) : null}

            {/* SKETCHBOOK */}
            {active === "sketchbook" && (
              <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
                {artworks.sketchbook.images.map((img, i) => (
                  <img key={i} src={img} style={styles.thumb} />
                ))}
              </div>
            )}

            {/* PHONE */}
            {active === "phone" && (
              <div style={{ textAlign: "center" }}>
                <img src={phoneImages[phoneIndex]} style={styles.image} />

                <button
                  style={styles.btn}
                  onClick={() =>
                    setPhoneIndex((phoneIndex + 1) % phoneImages.length)
                  }
                >
                  tap screen
                </button>
              </div>
            )}

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
    position: "relative",
    overflow: "hidden"
  },
  bg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  hotspot: {
    position: "absolute",
    width: "90px",
    height: "90px",
    cursor: "pointer"
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
    color: "#fff"
  },
  image: {
    width: "100%",
    marginBottom: "10px"
  },
  thumb: {
    width: "120px"
  },
  btn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};
