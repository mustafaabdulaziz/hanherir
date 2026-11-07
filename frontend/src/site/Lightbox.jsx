import { useEffect, useRef } from "react";
import { useLang } from "../i18n.js";
import { WhatsAppIcon, photoWaLink } from "./whatsapp.jsx";

export default function Lightbox({ list, index, onClose, onShift, photoLabel, contact }) {
  const { t } = useLang();
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const touchX = useRef(null);
  const open = index !== null && list.length > 0;

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onShift(rtl ? 1 : -1);
      if (e.key === "ArrowRight") onShift(rtl ? -1 : 1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const n = ((index % list.length) + list.length) % list.length;
  const photo = list[n];
  const label = photoLabel(photo);
  const waHref = photoWaLink(contact, t, photo, label);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lbCap"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        const dir = document.documentElement.dir === "rtl" ? -1 : 1;
        if (dx < -40) onShift(dir);
        else if (dx > 40) onShift(-dir);
        touchX.current = null;
      }}
    >
      <button ref={closeRef} className="lb-close" type="button" aria-label={t("lb.close")} onClick={onClose}>
        ×
      </button>
      <button className="lb-nav lb-prev" type="button" aria-label={t("lb.prev")} onClick={() => onShift(-1)}>
        <i className="chev" />
      </button>
      <figure className="lb-figure">
        <img id="lbImg" src={photo.url} alt={label} />
        <figcaption className="lb-meta">
          <span id="lbCap">{label}</span>
          <span>
            {n + 1} / {list.length}
          </span>
        </figcaption>
        {waHref && (
          <a className="lb-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} />
            <span>{t("wa.send")}</span>
          </a>
        )}
      </figure>
      <button className="lb-nav lb-next" type="button" aria-label={t("lb.next")} onClick={() => onShift(1)}>
        <i className="chev" />
      </button>
    </div>
  );
}
