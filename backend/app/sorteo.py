import random


def generar_asignaciones(
    participante_ids: list[str],
    pares_prohibidos: set[tuple[str, str]],
    intentos: int = 2000,
) -> dict[str, str]:
    """Devuelve {dador_id: receptor_id}. Nadie se regala a sí mismo ni cae
    en un par prohibido. Intenta al azar primero (rápido en el caso normal)
    y si no encuentra nada válido, recurre a backtracking garantizado."""

    ids = list(participante_ids)

    for _ in range(intentos):
        receptores = ids[:]
        random.shuffle(receptores)
        if _es_valido(ids, receptores, pares_prohibidos):
            return dict(zip(ids, receptores))

    resultado = _backtracking(ids, pares_prohibidos)
    if resultado is None:
        raise ValueError(
            "No es posible generar un sorteo válido con esas restricciones."
        )
    return resultado


def _es_valido(
    dadores: list[str], receptores: list[str], pares_prohibidos: set[tuple[str, str]]
) -> bool:
    for dador, receptor in zip(dadores, receptores):
        if dador == receptor:
            return False
        if (dador, receptor) in pares_prohibidos:
            return False
    return True


def _backtracking(
    ids: list[str], pares_prohibidos: set[tuple[str, str]]
) -> dict[str, str] | None:
    asignacion: dict[str, str] = {}
    usados: set[str] = set()

    def backtrack(i: int) -> bool:
        if i == len(ids):
            return True

        dador = ids[i]
        candidatos = [r for r in ids if r not in usados]
        random.shuffle(candidatos)

        for receptor in candidatos:
            if receptor == dador:
                continue
            if (dador, receptor) in pares_prohibidos:
                continue

            asignacion[dador] = receptor
            usados.add(receptor)

            if backtrack(i + 1):
                return True

            usados.remove(receptor)
            del asignacion[dador]

        return False

    return asignacion if backtrack(0) else None
