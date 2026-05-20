export default function SuccessModal({ open, onClose }) {
  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-icon">🎉</div>
        <h3>Randevu Talebiniz Alındı!</h3>
        <p>Kliniğimiz sizi arayarak randevunuzu onaylayacaktır.</p>
        <button className="btn-primary full" onClick={onClose}>Tamam</button>
      </div>
    </div>
  );
}
