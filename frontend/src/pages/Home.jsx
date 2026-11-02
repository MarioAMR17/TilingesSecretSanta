import { useNavigate } from "react-router-dom";
import { useMusic } from "../MusicContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { play } = useMusic();

  const handleIniciar = () => {
    play();
    navigate("/elige-personaje");
  };

  return (
    <div className="home">
      <div className="home__photo">
        <img src="/pics/flow/Principal.jpeg" alt="Tilinges en la posada" />
      </div>

      <div className="home__content">
        <div className="home__content-inner">
          <p className="home__eyebrow">✦ Tilinge Posada ✦</p>

          <h1 className="home__title">
            Tilinge Posada
            <span className="home__edition">4ta edición</span>
          </h1>

          <button className="home__cta" type="button" onClick={handleIniciar}>
            Iniciar
          </button>

          <p className="home__joke">
            No mms que ya es la cuarta posada de este grupo, según que iba a
            morir para la segunda xd
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
