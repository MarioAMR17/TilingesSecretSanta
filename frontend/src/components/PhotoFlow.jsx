import "./PhotoFlow.css";

export const FOTOS_2024 = [1, 2, 3, 4, 5, 6, 7, 8].map(
  (n) => `/pics/flow/2024-${n}.jpeg`
);
export const FOTOS_2025 = [1, 2, 3, 4, 5, 6, 7, 8].map(
  (n) => `/pics/flow/2025-${n}.jpeg`
);

function PhotoStrip({ fotos, reverse = false, duracion = 45 }) {
  // Duplicamos la lista para que el loop sea continuo (sin salto al reiniciar).
  const lista = [...fotos, ...fotos];

  return (
    <div className="photo-strip" aria-hidden="true">
      <div
        className={`photo-strip__row ${reverse ? "photo-strip__row--reverse" : ""}`}
        style={{ "--duracion": `${duracion}s` }}
      >
        {lista.map((src, index) => (
          <div className="photo-strip__frame" key={`${src}-${index}`}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoStrip;
