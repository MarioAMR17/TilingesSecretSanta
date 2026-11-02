from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/resultado", tags=["resultado"])


@router.get("/{dador_id}", response_model=schemas.ResultadoOut)
def revelar_resultado(dador_id: str, db: Session = Depends(get_db)):
    asignacion = db.get(models.Asignacion, dador_id)
    if asignacion is None:
        raise HTTPException(
            status_code=404,
            detail="No hay resultado para mostrar (ya se reveló o el sorteo no se ha generado).",
        )

    receptor = db.get(models.Participante, asignacion.receptor_id)
    salida = schemas.ResultadoOut(
        dador_id=asignacion.dador_id,
        receptor_id=asignacion.receptor_id,
        receptor_nombre=receptor.nombre if receptor else asignacion.receptor_id,
    )

    db.delete(asignacion)
    db.commit()

    return salida
