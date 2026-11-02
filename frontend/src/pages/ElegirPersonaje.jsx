import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { participants } from "../data/participants";
import ConfirmModal from "../components/ConfirmModal";
import RevealSequence from "../components/RevealSequence";
import PhotoStrip, { FOTOS_2024, FOTOS_2025 } from "../components/PhotoFlow";
import "./ElegirPersonaje.css";

function ElegirPersonaje() {
  const [pending, setPending] = useState(null);
  const [revealing, setRevealing] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setRevealing(pending);
    setPending(null);
  };

  return (
    <div className="elegir">
      <PhotoStrip fotos={FOTOS_2024} duracion={48} />

      <div className="elegir__header">
        <div className="elegir__title-row">
          <img
            className="elegir__chayanne"
            src="/pics/extras/Chayanne.jpg"
            alt=""
          />
          <h1 className="elegir__title">Elige tu personaje</h1>
          <img
            className="elegir__chayanne"
            src="/pics/extras/Chayanne.jpg"
            alt=""
          />
        </div>
        <p className="elegir__subtitle">
          En otras palabras, ¿quién piñas eres?
        </p>
      </div>

      <div className="elegir__grid">
        {participants.map((person, index) => (
          <button
            key={person.id}
            type="button"
            className={`card ${index % 2 === 0 ? "card--green" : "card--red"}`}
            onClick={() => setPending(person)}
          >
            <div className="card__photo-wrap">
              <img src={person.photo} alt={person.name} className="card__photo" />
            </div>
            <p className="card__name">{person.name}</p>
            <div className="card__phrase-wrap">
              <p className="card__phrase">"{person.phrase}"</p>
            </div>
          </button>
        ))}
      </div>

      <PhotoStrip fotos={FOTOS_2025} reverse duracion={52} />

      {pending && (
        <ConfirmModal
          name={pending.name}
          photo={pending.photo}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}

      {revealing && (
        <RevealSequence
          dador={revealing}
          onFinish={() => navigate("/despedida")}
          onError={() => setRevealing(null)}
        />
      )}
    </div>
  );
}

export default ElegirPersonaje;
