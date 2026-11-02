import { useMusic } from "../MusicContext";
import "./MusicToggle.css";

function MusicToggle() {
  const { playing, toggle } = useMusic();

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? "music-toggle--playing" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      title={playing ? "Pausar música" : "Reproducir música"}
    >
      ♪
    </button>
  );
}

export default MusicToggle;
