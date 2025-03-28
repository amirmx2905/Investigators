function MenuOverlay({ isOpen, onClose }) {
    return (
      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>
    );
  }
  
  export default MenuOverlay;