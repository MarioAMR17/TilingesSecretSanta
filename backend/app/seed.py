from sqlalchemy.orm import Session

from . import models

PARTICIPANTES_INICIALES = [
    ("cabrolina", "Cabrolina"),
    ("caldohuevo", "CaldoHuevo"),
    ("hetor", "Hetor"),
    ("homes", "Homes"),
    ("mariobrown", "MarioBrown"),
    ("mollete", "Mollete"),
    ("pastillita", "Pastillita"),
    ("willyrex", "Willyrex"),
]

# (dador, receptor): dador no puede quedar asignado para regalarle a receptor.
# Direccional, no simétrico.
RESTRICCIONES_INICIALES = [
    ("hetor", "willyrex"),
    ("mollete", "hetor"),
    ("mariobrown", "caldohuevo"),
    ("willyrex", "homes"),
    ("homes", "mariobrown"),
    ("cabrolina", "pastillita"),
    ("pastillita", "mollete"),
    ("caldohuevo", "cabrolina"),
]


def seed_participantes(db: Session) -> None:
    """Crea los participantes iniciales si la tabla está vacía. No pisa
    datos si ya existen (por si luego se edita algo a mano en la DB)."""
    if db.query(models.Participante).count() > 0:
        return

    for id_, nombre in PARTICIPANTES_INICIALES:
        db.add(models.Participante(id=id_, nombre=nombre))

    db.commit()


def seed_restricciones(db: Session) -> None:
    """Carga las restricciones iniciales si la tabla está vacía."""
    if db.query(models.Restriccion).count() > 0:
        return

    for dador_id, receptor_id in RESTRICCIONES_INICIALES:
        db.add(
            models.Restriccion(
                id=f"{dador_id}-no-{receptor_id}",
                dador_id=dador_id,
                receptor_id=receptor_id,
            )
        )

    db.commit()
