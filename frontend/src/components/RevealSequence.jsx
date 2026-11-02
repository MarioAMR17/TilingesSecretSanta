import { useEffect, useRef, useState } from "react";
import { participants } from "../data/participants";
import { revelarResultado } from "../api";
import { createRevealAudio } from "../sound";
import "./RevealSequence.css";

const DURACION_CUENTA = 3;
const DURACION_BORRADO = 30;

function RevealSequence({ dador, onFinish, onError }) {
  const [count, setCount] = useState(DURACION_CUENTA);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [segundos, setSegundos] = useState(DURACION_BORRADO);
  const [exploding, setExploding] = useState(false);
  const audioRef = useRef(null);
  const crashPlayedRef = useRef(false);
  const startedRef = useRef(false);
  const boomPlayedRef = useRef(false);

  // Arranca el redoble y pide el resultado al backend en paralelo.
  // Guard contra el doble-efecto de React StrictMode en desarrollo: el
  // backend borra el resultado al leerlo, así que no podemos pedirlo dos veces.
  useEffect(() => {
    if (startedRef.current) return undefined;
    startedRef.current = true;

    const audio = createRevealAudio();
    audioRef.current = audio;
    audio.playDrumroll(DURACION_CUENTA);

    revelarResultado(dador.id)
      .then(setResultado)
      .catch((err) => setError(err.message));

    // Sin cleanup que cierre el audio: con StrictMode, React monta,
    // desmonta y vuelve a montar este efecto una vez en desarrollo, y
    // cerrar el contexto ahí silenciaría el redoble real. El contexto se
    // libera solo al navegar fuera de esta pantalla.
  }, [dador.id]);

  // Cuenta 3, 2, 1...
  useEffect(() => {
    if (count <= 0) return undefined;
    const timeout = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [count]);

  const listoParaRevelar = count === 0 && resultado && !error;

  useEffect(() => {
    if (listoParaRevelar && !crashPlayedRef.current) {
      crashPlayedRef.current = true;
      audioRef.current?.playCrash();
    }
  }, [listoParaRevelar]);

  // Cuenta regresiva de borrado de la página, solo una vez revelado.
  useEffect(() => {
    if (!listoParaRevelar) return undefined;
    if (segundos <= 0) {
      if (!boomPlayedRef.current) {
        boomPlayedRef.current = true;
        audioRef.current?.playBoom();
        setExploding(true);
        setTimeout(onFinish, 1200);
      }
      return undefined;
    }
    const timeout = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [listoParaRevelar, segundos, onFinish]);

  if (error) {
    return (
      <div className="reveal reveal--error">
        <p>{error}</p>
        <button type="button" onClick={onError}>
          Volver
        </button>
      </div>
    );
  }

  if (!listoParaRevelar) {
    return (
      <div className="reveal reveal--countdown">
        <video
          className="reveal__gato"
          src="/pics/extras/gato-redoble.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <p className="reveal__countdown-number" key={count}>
          {count > 0 ? count : "..."}
        </p>
      </div>
    );
  }

  const receptorIndex = participants.findIndex(
    (p) => p.id === resultado.receptor_id
  );
  const receptorData = receptorIndex >= 0 ? participants[receptorIndex] : null;
  const colorClass = receptorIndex % 2 === 0 ? "reveal__card--green" : "reveal__card--red";

  return (
    <div className={`reveal reveal--result ${exploding ? "reveal--shake" : ""}`}>
      <p className="reveal__timer">
        Esta página se borrará en {segundos} segundo{segundos === 1 ? "" : "s"}
      </p>

      <div className="reveal__content">
        <div className={`reveal__card ${colorClass}`}>
          <img
            className="reveal__photo"
            src={receptorData?.resultPhoto}
            alt={resultado.receptor_nombre}
          />
          <p className="reveal__name">{resultado.receptor_nombre}</p>
        </div>

        <div className="reveal__phrase-box">
          <p className="reveal__phrase">"{receptorData?.phrase}"</p>
        </div>
      </div>

      {exploding && (
        <div className="boom">
          <img className="boom__gif" src="/pics/extras/boom.gif" alt="" />
        </div>
      )}
    </div>
  );
}

export default RevealSequence;
