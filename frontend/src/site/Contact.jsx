import { useState } from "react";
import { useLang } from "../i18n.js";

function igHandle(url) {
  if (!url) return "";
  const last = url.replace(/\/+$/, "").split("/").pop() || "";
  return "@" + last.replace(/^@/, "");
}

export default function Contact({ contact }) {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [note, setNote] = useState(null);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    if (!name || !message) {
      setNote({ kind: "is-error", text: t("form.need") });
      return;
    }
    const lines = [
      t("form.waIntro"),
      t("form.name") + ": " + name,
      phone ? t("form.phone") + ": " + phone : "",
      t("form.message") + ": " + message
    ].filter(Boolean);
    window.open(
      "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")),
      "_blank",
      "noopener"
    );
    setNote({ kind: "is-ok", text: t("form.sent") });
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-grid reveal">
        <div className="contact-copy">
          <p className="kicker">{t("contact.kicker")}</p>
          <h2>{t("contact.title")}</h2>
          <p className="lead">{t("contact.lead")}</p>
          <ul className="info-list">
            {contact.phone && (
              <li>
                <span>{t("contact.phone")}</span>
                <a dir="ltr" href={"tel:" + contact.phoneTel}>
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.email && (
              <li>
                <span>{t("contact.email")}</span>
                <a dir="ltr" href={"mailto:" + contact.email}>
                  {contact.email}
                </a>
              </li>
            )}
            {contact.instagram && (
              <li>
                <span>{t("contact.ig")}</span>
                <a dir="ltr" href={contact.instagram} target="_blank" rel="noopener noreferrer">
                  {igHandle(contact.instagram)}
                </a>
              </li>
            )}
          </ul>
        </div>
        <form className="form-card" onSubmit={submit} noValidate>
          <label className="field">
            <span>{t("form.name")}</span>
            <input
              type="text"
              autoComplete="name"
              aria-required="true"
              placeholder={t("form.namePh")}
              value={form.name}
              onChange={update("name")}
            />
          </label>
          <label className="field">
            <span>{t("form.phone")}</span>
            <input
              type="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={t("form.phonePh")}
              value={form.phone}
              onChange={update("phone")}
            />
          </label>
          <label className="field">
            <span>{t("form.message")}</span>
            <textarea
              rows="4"
              aria-required="true"
              placeholder={t("form.messagePh")}
              value={form.message}
              onChange={update("message")}
            />
          </label>
          <button className="btn" type="submit">
            {t("form.submit")}
          </button>
          <p className={"form-note " + (note ? note.kind : "")} role="status">
            {note ? note.text : ""}
          </p>
        </form>
      </div>
    </section>
  );
}

export function Footer({ contact }) {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-mark">{t("brand.name")}</p>
          <p className="footer-sub">{t("footer.tag")}</p>
        </div>
        <nav className="footer-nav" aria-label="footer">
          <a href="#categories">{t("nav.categories")}</a>
          <a href="#gallery">{t("nav.gallery")}</a>
          <a href="#branches">{t("nav.branches")}</a>
          <a href="#contact">{t("nav.contact")}</a>
        </nav>
        <div className="footer-contact">
          {contact.phone && (
            <a dir="ltr" href={"tel:" + contact.phoneTel}>
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a dir="ltr" href={"mailto:" + contact.email}>
              {contact.email}
            </a>
          )}
          <span className="footer-address">{t("footer.address")}</span>
        </div>
      </div>
      <div className="legal">
        <span>
          © {year} {t("brand.name")}
        </span>
        <span>{t("footer.rights")}</span>
      </div>
    </footer>
  );
}

export function WhatsAppFloat({ contact }) {
  const { t } = useLang();
  if (!contact.whatsapp) return null;
  const href = "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent(t("form.waHello"));
  return (
    <a className="whatsapp" aria-label={t("wa.label")} href={href} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.28.64-.41 1.02-.41.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.88-1.08.19-.28.38-.23.64-.14.26.09 1.66.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z"
        />
      </svg>
    </a>
  );
}
