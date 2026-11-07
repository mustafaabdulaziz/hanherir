import { useLang } from "../i18n.js";
import { WhatsAppIcon, photoWaLink } from "./whatsapp.jsx";

const PREVIEW = 12;

export default function Gallery({
  categories,
  list,
  filter,
  onSelect,
  showAll,
  setShowAll,
  onOpen,
  catName,
  photoLabel,
  contact
}) {
  const { t, p } = useLang();
  const limit = showAll || filter !== "all" ? list.length : PREVIEW;
  const shown = list.slice(0, limit);
  const title = filter === "all" ? t("gallery.title") : catName(filter);

  return (
    <section className="section gallery-section" id="gallery">
      <div className="gallery-head">
        <div>
          <p className="kicker">{t("gallery.kicker")}</p>
          <h2 id="galleryTitle">{title}</h2>
          <p className="gallery-count" aria-live="polite">
            {t("gallery.count").replace("{n}", list.length)}
          </p>
        </div>
        <div className="filters" role="group" aria-label={t("gallery.filters")}>
          <button
            type="button"
            className={filter === "all" ? "is-active" : ""}
            aria-pressed={filter === "all"}
            onClick={() => onSelect("all", false)}
          >
            {t("gallery.all")}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={filter === c.id ? "is-active" : ""}
              aria-pressed={filter === c.id}
              onClick={() => onSelect(c.id, false)}
            >
              {p(c.name)}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="gallery-empty">{t("gallery.empty")}</p>
      ) : (
        <div className="gallery-grid" id="galleryGrid" key={filter}>
          {shown.map((ph, i) => {
            const label = photoLabel(ph);
            return (
              <figure key={ph.id}>
                <button
                  type="button"
                  className="shot"
                  aria-label={t("gallery.open") + ": " + label}
                  onClick={() => onOpen(i)}
                >
                  <img src={ph.url} alt={label} loading={i < 4 ? "eager" : "lazy"} decoding="async" />
                </button>
                <figcaption>{label}</figcaption>
                {photoWaLink(contact, t, ph, label) && (
                  <a
                    className="shot-wa"
                    href={photoWaLink(contact, t, ph, label)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("wa.send")}
                    title={t("wa.send")}
                  >
                    <WhatsAppIcon size={18} />
                  </a>
                )}
              </figure>
            );
          })}
        </div>
      )}

      {limit < list.length && (
        <div className="more-row">
          <button type="button" className="btn ghost" onClick={() => setShowAll(true)}>
            <span>{t("gallery.more").replace("{n}", list.length - limit)}</span>
          </button>
        </div>
      )}
    </section>
  );
}
