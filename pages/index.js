import { useEffect, useRef, useState } from "react";

export default function Home() {
  const roomRef = useRef(null);
  const [active, setActive] = useState(null);

  const pieces = {
    mantel: {
      title: "Mantel Piece",
      image: "/art/painting1.jpg",
      audio: "/audio/painting1.mp3",
      status: "this one is still here",
    },
    easel: {
      title: "Current Work",
      image: "/Studio.jpg",
      audio: "/audio/painting1.mp3",
      status: "Liz is working on this now",
    },
  };

  useEffect(() => {
    const move = (x, y) => {
      const moveX = (x - window.innerWidth / 2) / 60;
      const moveY = (y - window.innerHeight / 2) / 80;

      if (roomRef.current) {
        roomRef.current.style.transform =
          `translate(${-moveX}px, ${-moveY}px) scale(1.06)`;
      }
    };

    const onMouseMove = (e) => move(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (touch) move(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <main className="page">
      <div ref={roomRef} className="room">
        <img src="/Studio.jpg" className="studio" alt="Minds Eye Butterfly studio" />

        <button
          className="hotspot mantel"
          onClick={() => setActive("mantel")}
          aria-label="Open mantel artwork"
        />

        <button
          className="hotspot easel"
          onClick={() => setActive("easel")}
          aria-label="Open easel artwork"
        />
      </div>

      <div className="brand">MINDS EYE BUTTERFLY 🦋</div>
      <div className="hint">tap the room</div>

      {active && (
        <div className="modal" onClick={() => setActive(null)}>
          <section className="card" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setActive(null)}>×</button>

            <h1>{pieces[active].title}</h1>

            <img src={pieces[active].image} className="piece" alt={pieces[active].title} />

            <audio controls className="audio">
              <source src={pieces[active].audio} type="audio/mpeg" />
            </audio>

            <button className="claim">
              {pieces[active].status}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
