import { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.4;
  }, []);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay bloqueado por el navegador; se queda pausada hasta
        // que el usuario le dé play manualmente con el botón flotante.
      });
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      play();
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <MusicContext.Provider value={{ play, toggle, playing }}>
      <audio ref={audioRef} src="/pics/extras/musica-fondo.mp3" loop />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
