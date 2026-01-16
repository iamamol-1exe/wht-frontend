const DialogOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <div
    className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-md transition-all duration-300 ${
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    onClick={onClose}
  />
);

export default DialogOverlay;
