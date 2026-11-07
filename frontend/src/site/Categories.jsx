import { useLang } from "../i18n.js";

export default function Categories({ categories, filter, onSelect }) {
  const { t, p } = useLang();
  return (
    <section className="section" id="categories">
      <div className="section-head reveal">
        <p className="kicker">{t("cat.kicker")}</p>
        <h2>{t("cat.title")}</h2>
        <p className="lead">{t("cat.lead")}</p>
      </div>
      <div className="cat-grid">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={"cat-card" + (filter === c.id ? " is-active" : "")}
            onClick={() => onSelect(c.id, true)}
          >
            <span className="cat-count">{t("gallery.count").replace("{n}", c.count)}</span>
            {c.cover && <img src={c.cover} alt="" />}
            <span className="cat-label">
              <strong>{p(c.name)}</strong>
              <em>
                <span>{t("cat.open")}</span>
                <i className="arrow" aria-hidden="true" />
              </em>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
