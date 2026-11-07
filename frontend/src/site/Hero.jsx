import { Fragment } from "react";
import { useLang } from "../i18n.js";

export default function Hero({ data }) {
  const { t } = useLang();
  const { hero, photos, categories, branches } = data;
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-copy reveal">
          <p className="kicker">{t("hero.kicker")}</p>
          <h1>{t("hero.title")}</h1>
          <p className="lead">{t("hero.lead")}</p>
          <div className="btn-row">
            <a className="btn" href="#categories">
              <span>{t("hero.cta1")}</span>
              <i className="arrow" aria-hidden="true" />
            </a>
            <a className="btn ghost" href="#branches">
              {t("hero.cta2")}
            </a>
          </div>
          <dl className="stats">
            <div>
              <dt>{photos.length}</dt>
              <dd>{t("hero.stat1")}</dd>
            </div>
            <div>
              <dt>{categories.length}</dt>
              <dd>{t("hero.stat2")}</dd>
            </div>
            <div>
              <dt>{branches.length}</dt>
              <dd>{t("hero.stat3")}</dd>
            </div>
          </dl>
        </div>
        <div className="hero-collage reveal">
          {hero.main && (
            <figure className="tile tile-main">
              <img src={hero.main} alt={t("hero.photoAlt")} />
            </figure>
          )}
          {hero.a && (
            <figure className="tile tile-a">
              <img src={hero.a} alt="" />
            </figure>
          )}
          {hero.b && (
            <figure className="tile tile-b">
              <img src={hero.b} alt="" />
            </figure>
          )}
          <span className="hero-badge">
            <img src="/assets/mark.png" alt="" width="760" height="381" />
          </span>
        </div>
      </section>
      <Ticker categories={categories} custom={data.ticker} />
    </>
  );
}

function Ticker({ categories, custom }) {
  const { t, p, lang } = useLang();
  const own = custom?.[lang] || [];
  const items = own.length ? own : [...categories.map((c) => p(c.name)), t("hero.kicker")];
  // Şerit kaymasının boşluk bırakmaması için yazıları ekranı dolduracak kadar tekrarla.
  const unit = items.reduce((sum, s) => sum + s.length * 11 + 53, 0) || 1;
  const copies = Math.max(1, Math.ceil(2800 / unit));
  const half = Array.from({ length: copies }, () => items).flat();
  const loop = [...half, ...half];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {loop.map((text, i) => (
          <Fragment key={i}>
            <span>{text}</span>
            <i />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
