import { useState } from "react";
import { useLang } from "../i18n.js";

const getDirectionsUrl = (b) => {
  if (!b) return "https://maps.google.com";
  if (b.map_url && (b.map_url.startsWith("http://") || b.map_url.startsWith("https://"))) {
    return b.map_url;
  }
  if (b.map && (b.map.startsWith("http://") || b.map.startsWith("https://"))) {
    return b.map;
  }
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(b.map || "Istanbul, Turkey");
};

const getEmbedSrc = (b) => {
  if (!b) return "";
  if (b.map_url && (b.map_url.includes("output=embed") || b.map_url.includes("/embed"))) {
    return b.map_url;
  }
  const q = (b.map && !b.map.startsWith("http") ? b.map : null) || b.address?.tr || b.address?.en || b.address?.ar || "Istanbul, Turkey";
  return "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&z=14&output=embed";
};

export default function Branches({ branches }) {
  const { t, p } = useLang();
  const [active, setActive] = useState(0);
  const current = branches[active] || branches[0];

  return (
    <section className="section" id="branches">
      <div className="section-head reveal">
        <p className="kicker">{t("branch.kicker")}</p>
        <h2>{t("branch.title")}</h2>
        <p className="lead">{t("branch.lead")}</p>
      </div>
      <div className="branch-layout">
        <div className="branch-grid" id="branchList">
          {branches.map((b, i) => {
            const on = i === active;
            return (
              <article
                key={b.id}
                className={"branch-card" + (on ? " is-active" : "")}
                tabIndex={0}
                role="button"
                aria-pressed={on}
                onClick={(e) => {
                  if (e.target.closest("a")) return;
                  setActive(i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              >
                <div className="branch-media">
                  {b.photo && <img className="branch-photo" src={b.photo} alt="" loading="lazy" />}
                  <span className="branch-no">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="branch-body">
                  <h3>{p(b.name)}</h3>
                  <span className="branch-label">{t("branch.address")}</span>
                  <p className="branch-address">{p(b.address)}</p>
                  {p(b.hours) && <p className="branch-hours">{p(b.hours)}</p>}
                  {b.phone && (
                    <a dir="ltr" href={"tel:" + b.phoneTel}>
                      {b.phone}
                    </a>
                  )}
                  <a href={getDirectionsUrl(b)} target="_blank" rel="noopener noreferrer">
                    {t("branch.directions")} ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        {current && (
          <div className="map-frame reveal">
            <iframe
              id="branchMap"
              title={t("branch.mapTitle")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={getEmbedSrc(current)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
