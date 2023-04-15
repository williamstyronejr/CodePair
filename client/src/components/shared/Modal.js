import PropTypes from 'prop-types';
import './styles/modal.css';

const Modal = ({ onClose, onSuccess }) => {
  return (
    <div className="modal">
      <div className="modal__content">
        <div></div>

        <div className="modal__options">
          <button className="" type="button" onClick={() => onSuccess()}>
            Create
          </button>
          <button className="" type="button" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
