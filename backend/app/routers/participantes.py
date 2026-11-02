from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/participantes", tags=["participantes"])


@router.get("", response_model=list[schemas.ParticipanteOut])
def listar_participantes(db: Session = Depends(get_db)):
    return db.query(models.Participante).order_by(models.Participante.nombre).all()
