import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { LangContext, STRINGS, pick, readLang } from "../i18n.js";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import Categories from "./Categories.jsx";
import Gallery from "./Gallery.jsx";
import Branches from "./Branches.jsx";
import Contact, { Footer, WhatsAppFloat } from "./Contact.jsx";
import Lightbox from "./Lightbox.jsx";
import { useReveal } from "./useReveal.js";

export default function SiteApp() {
  const [lang, setLangState] = useState(readLang);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [lb, setLb] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  const t = useCallback((key) => STRINGS[lang]?.[key] ?? STRINGS.ar[key] ?? key, [lang]);
  const p = useCallback((obj) => pick(obj, lang), [lang]);
  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem("kh_lang", next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    api("/api/site")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => document.documentElement.classList.add("ready"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t("meta.title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.desc"));
  }, [lang, t]);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle("nav-open", navOpen);
    body.classList.toggle("lb-open", lb !== null);
    body.classList.toggle("no-scroll", navOpen || lb !== null);
  }, [navOpen, lb]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setNavOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape" && lb === null) setNavOpen(false);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, [lb]);

  useReveal(data);

  const catById = useMemo(() => {
    const map = new Map();
    (data?.categories || []).forEach((c) => map.set(c.id, c));
    return map;
  }, [data]);

  const catName = useCallback((id) => p(catById.get(id)?.name), [catById, p]);
  // Bir fotoğraf birden fazla kategoride olabilir; etiket olarak hepsini göster.
  const photoLabel = useCallback(
    (ph) => (ph.category_ids || []).map((id) => catName(id)).filter(Boolean).join(" · "),
    [catName]
  );

  const list = useMemo(
    () => (data ? data.photos.filter((ph) => filter === "all" || (ph.category_ids || []).includes(filter)) : []),
    [data, filter]
  );

  const selectCategory = useCallback((id, scroll) => {
    setFilter(id);
    if (scroll) {
      const target = document.getElementById("gallery");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const ctx = useMemo(() => ({ lang, setLang, t, p }), [lang, setLang, t, p]);

  if (error) {
    return (
      <LangContext.Provider value={ctx}>
        <div className="site-error">
          <p>{t("error.load")}</p>
        </div>
      </LangContext.Provider>
    );
  }
  if (!data) return null;

  return (
    <LangContext.Provider value={ctx}>
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <main id="main">
        <Hero data={data} />
        <Categories categories={data.categories} filter={filter} onSelect={selectCategory} />
        <Gallery
          categories={data.categories}
          list={list}
          filter={filter}
          onSelect={selectCategory}
          showAll={showAll}
          setShowAll={setShowAll}
          onOpen={setLb}
          catName={catName}
          photoLabel={photoLabel}
          contact={data.contact}
        />
        <Branches branches={data.branches} />
        <Contact contact={data.contact} />
      </main>
      <Footer contact={data.contact} />
      <WhatsAppFloat contact={data.contact} />
      <Lightbox
        list={list}
        index={lb}
        onClose={() => setLb(null)}
        onShift={(d) => setLb((i) => (i === null ? null : i + d))}
        photoLabel={photoLabel}
        contact={data.contact}
      />
    </LangContext.Provider>
  );
}
