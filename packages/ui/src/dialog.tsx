
export interface DialogProps {
  closeModal: () => void;
}

export function ModalBase(props: DialogProps) {
  const { closeModal } = props;

  return (
    <div
      id="modal-container"
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div
        id="modal-bg"
        className="p-6 rounded shadow-lg max-w-md w-full bg-black bg-opacity-50"
        onClick={closeModal}
      />
      <slot></slot>
    </div>
  );
}
