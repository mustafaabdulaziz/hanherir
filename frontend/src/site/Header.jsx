import { useEffect, useState } from "react";
import { useLang } from "../i18n.js";

const LINKS = [
  ["top", "nav.home"],
  ["categories", "nav.categories"],
  ["gallery", "nav.gallery"],
  ["branches", "nav.branches"],
  ["contact", "nav.contact"]
];

const LANG_BUTTONS = [
  ["ar", "العربية", "ع"],
  ["tr", "Türkçe", "TR"],
  ["en", "English", "EN"]
];

export default function Header({ navOpen, setNavOpen }) {
  const { lang, setLang, t } = useLang();
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className={"site-header" + (stuck ? " is-stuck" : "")}>
      <div className="bar">
        <a className="brand" href="#top">
          <img src="/assets/mark.png" alt="" width="760" height="381" />
          <span className="brand-name">
            <strong>{t("brand.name")}</strong>
            <small>{t("brand.sub")}</small>
          </span>
        </a>
        <nav className="nav" id="siteNav" aria-label={t("nav.label")}>
          {LINKS.map(([id, key]) => (
            <a
              key={id}
              href={"#" + id}
              aria-current={active === id ? "true" : undefined}
              onClick={() => setNavOpen(false)}
            >
              {t(key)}
            </a>
          ))}
        </nav>
        <div className="langs" role="group" aria-label={t("lang.label")}>
          {LANG_BUTTONS.map(([code, long, short]) => (
            <button
              key={code}
              type="button"
              className={"lang" + (lang === code ? " is-active" : "")}
              lang={code}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              <span className="lang-long">{long}</span>
              <span className="lang-short">{short}</span>
            </button>
          ))}
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={navOpen}
          aria-controls="siteNav"
          aria-label={t(navOpen ? "nav.close" : "nav.open")}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
