from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..config import settings
from ..database import get_db
from ..sorteo import generar_asignaciones

router = APIRouter(prefix="/sorteo", tags=["sorteo"])


def requerir_admin(x_admin_token: str = Header(default="")):
    if x_admin_token != settings.admin_token:
        raise HTTPException(status_code=401, detail="Token de administrador inválido")


@router.get("/estado", response_model=schemas.EstadoSorteoOut)
def estado_sorteo(db: Session = Depends(get_db)):
    total = db.query(models.Participante).count()
    pendientes = db.query(models.Asignacion).count()
    meta = db.get(models.SorteoMeta, 1)
    return schemas.EstadoSorteoOut(
        generado=bool(meta and meta.generado),
        pendientes_de_revelar=pendientes,
        total_participantes=total,
    )


@router.post(
    "/generar",
    response_model=schemas.GenerarSorteoOut,
    dependencies=[Depends(requerir_admin)],
)
def generar_sorteo(force: bool = False, db: Session = Depends(get_db)):
    existentes = db.query(models.Asignacion).count()
    if existentes > 0 and not force:
        raise HTTPException(
            status_code=409,
            detail=(
                f"Ya hay {existentes} asignaciones pendientes de revelar. "
                "Usa ?force=true para borrar todo y volver a sortear."
            ),
        )

    participantes = db.query(models.Participante).all()
    if len(participantes) < 2:
        raise HTTPException(
            status_code=400, detail="Hacen falta al menos 2 participantes."
        )
    ids = [p.id for p in participantes]

    restricciones = db.query(models.Restriccion).all()
    pares_prohibidos = {(r.dador_id, r.receptor_id) for r in restricciones}

    try:
        asignaciones = generar_asignaciones(ids, pares_prohibidos)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    db.query(models.Asignacion).delete()
    for dador_id, receptor_id in asignaciones.items():
        db.add(models.Asignacion(dador_id=dador_id, receptor_id=receptor_id))

    meta = db.get(models.SorteoMeta, 1)
    if meta is None:
        meta = models.SorteoMeta(id=1, generado=True)
        db.add(meta)
    else:
        meta.generado = True

    db.commit()

    return schemas.GenerarSorteoOut(ok=True, asignaciones_creadas=len(asignaciones))
