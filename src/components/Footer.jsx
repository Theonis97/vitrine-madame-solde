export default function Footer({ storeName, phone, address, message }) {
  const hasContact = phone || address;

  return (
    <footer className="footer">
      <div className="footer__marquee-wrap">
        <div className="footer__marquee">
          <span>{message}</span>
          <span>{message}</span>
        </div>
      </div>

      {hasContact && (
        <div className="footer__bar">
          <span className="footer__brand">{storeName}</span>
          <div className="footer__contact">
            {address && <span className="footer__contact-item">📍 {address}</span>}
            {phone && <span className="footer__contact-item">📞 {phone}</span>}
          </div>
        </div>
      )}
    </footer>
  );
}
