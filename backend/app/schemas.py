from pydantic import BaseModel


class ParticipanteOut(BaseModel):
    id: str
    nombre: str

    model_config = {"from_attributes": True}


class EstadoSorteoOut(BaseModel):
    generado: bool
    pendientes_de_revelar: int
    total_participantes: int


class ResultadoOut(BaseModel):
    dador_id: str
    receptor_id: str
    receptor_nombre: str


class GenerarSorteoOut(BaseModel):
    ok: bool
    asignaciones_creadas: int
