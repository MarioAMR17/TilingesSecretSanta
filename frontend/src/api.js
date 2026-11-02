const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function obtenerParticipantes() {
  const res = await fetch(`${API_URL}/participantes`);
  if (!res.ok) throw new Error("No se pudo cargar la lista de participantes.");
  return res.json();
}

export async function revelarResultado(dadorId) {
  const res = await fetch(`${API_URL}/resultado/${dadorId}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        "No hay resultado para mostrar: ya se reveló antes o el sorteo todavía no se genera."
      );
    }
    throw new Error("Hubo un problema al consultar tu resultado.");
  }
  return res.json();
}
