import "./ConfirmModal.css";

function ConfirmModal({ name, photo, onConfirm, onCancel }) {
  return (
    <div className="confirm-modal" onClick={onCancel}>
      <div className="confirm-modal__card" onClick={(e) => e.stopPropagation()}>
        <img className="confirm-modal__photo" src={photo} alt={name} />
        <p className="confirm-modal__name">{name}</p>
        <p className="confirm-modal__text">¿Segur@ que eres tu we?</p>
        <div className="confirm-modal__actions">
          <button
            className="confirm-modal__btn confirm-modal__btn--ghost"
            type="button"
            onClick={onCancel}
          >
            Ewe paro, no soy yo
          </button>
          <button
            className="confirm-modal__btn confirm-modal__btn--solid"
            type="button"
            onClick={onConfirm}
          >
            Soy ese
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
