export function WhatsAppIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.28.64-.41 1.02-.41.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.88-1.08.19-.28.38-.23.64-.14.26.09 1.66.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z"
      />
    </svg>
  );
}

/* Müşterinin beğendiği halıyı (fotoğraf bağlantısıyla birlikte) işletmenin WhatsApp'ına gönderen bağlantı. */
export function photoWaLink(contact, t, photo, label) {
  if (!contact?.whatsapp || !photo) return null;
  const photoUrl = new URL(photo.url, window.location.origin).href;
  const text = [t("wa.photoMsg"), label, photoUrl].filter(Boolean).join("\n");
  return "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent(text);
}
