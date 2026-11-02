from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Participante(Base):
    __tablename__ = "participantes"

    id = Column(String, primary_key=True)  # slug, ej. "cabrolina"
    nombre = Column(String, nullable=False)


class Restriccion(Base):
    """dador_id no puede quedar asignado para regalarle a receptor_id.
    Es direccional: que A no pueda darle a B no implica que B no pueda darle a A."""

    __tablename__ = "restricciones"

    id = Column(String, primary_key=True)
    dador_id = Column(String, ForeignKey("participantes.id"), nullable=False)
    receptor_id = Column(String, ForeignKey("participantes.id"), nullable=False)


class Asignacion(Base):
    """Fila viva solo hasta que el dador revela su resultado; ahí se borra."""

    __tablename__ = "asignaciones"

    dador_id = Column(String, ForeignKey("participantes.id"), primary_key=True)
    receptor_id = Column(String, ForeignKey("participantes.id"), nullable=False)

    receptor = relationship("Participante", foreign_keys=[receptor_id])


class SorteoMeta(Base):
    """Fila única (id=1) que indica si el sorteo ya se generó alguna vez."""

    __tablename__ = "sorteo_meta"

    id = Column(Integer, primary_key=True, default=1)
    generado = Column(Boolean, nullable=False, default=False)
