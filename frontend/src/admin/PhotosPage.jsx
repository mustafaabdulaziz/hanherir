import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import { useAdmin } from "./AdminApp.jsx";

const catLabel = (c) => c.name.tr || c.name.en || c.name.ar;

/* Birden fazla kategori seçmek için onay kutulu etiketler. En az biri seçili kalır. */
function CatChips({ categories, value, onChange, disabled = false }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      if (value.length === 1) return;
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };
  return (
    <div className="adm-chips">
      {categories.map((c) => (
        <label key={c.id} className={"adm-chip" + (value.includes(c.id) ? " on" : "")}>
          <input type="checkbox" checked={value.includes(c.id)} disabled={disabled} onChange={() => toggle(c.id)} />
          {catLabel(c)}
        </label>
      ))}
    </div>
  );
}

export default function PhotosPage() {
  const { site, run, notify } = useAdmin();
  const { categories, photos } = site;
  const [filter, setFilter] = useState("all");
  const [upCats, setUpCats] = useState(categories[0] ? [categories[0].id] : []);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setUpCats((cur) => {
      const valid = cur.filter((id) => categories.some((c) => c.id === id));
      if (valid.length) return valid.length === cur.length ? cur : valid;
      return categories[0] ? [categories[0].id] : [];
    });
  }, [categories]);

  const shown = photos.filter((p) => filter === "all" || p.category_ids.includes(filter));

  const upload = async (e) => {
    e.preventDefault();
    if (!files.length) return notify("Önce fotoğraf seçin.", "err");
    if (!upCats.length) return notify("En az bir kategori seçin.", "err");
    setBusy(true);
    const fd = new FormData();
    upCats.forEach((id) => fd.append("category_ids", id));
    files.forEach((f) => fd.append("files", f));
    const ok = await run(() => api("/api/admin/photos", { method: "POST", form: fd }), `${files.length} fotoğraf yüklendi.`);
    setBusy(false);
    if (ok) {
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const changeCats = (photo, ids) =>
    run(() => api(`/api/admin/photos/${photo.id}`, { method: "PUT", body: { category_ids: ids } }), "Kategoriler güncellendi.");

  // Kapak: bir kategori sekmesindeyken o kategori; "Tümü"nde fotoğraf tek kategoridaysa o kategori.
  const coverCatId = (photo) => (filter !== "all" ? filter : photo.category_ids.length === 1 ? photo.category_ids[0] : null);

  const isCoverOf = (photo) => {
    const id = coverCatId(photo);
    if (id !== null) return categories.find((c) => c.id === id)?.cover_id === photo.id;
    return categories.some((c) => c.cover_id === photo.id && photo.category_ids.includes(c.id));
  };

  const setCover = (photo) => {
    const id = coverCatId(photo);
    if (id === null) return;
    run(() => api(`/api/admin/categories/${id}`, { method: "PUT", body: { cover_id: photo.id } }), "Kapak fotoğrafı ayarlandı.");
  };

  const remove = (photo) => {
    if (!window.confirm("Bu fotoğraf kalıcı olarak silinsin mi?")) return;
    run(() => api(`/api/admin/photos/${photo.id}`, { method: "DELETE" }), "Fotoğraf silindi.");
  };

  const move = (i, d) => {
    const ids = shown.map((p) => p.id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    run(() => api("/api/admin/reorder", { method: "POST", body: { type: "photos", ids } }));
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Fotoğraflar</h1>
          <p className="adm-muted">{photos.length} fotoğraf · yeni fotoğraflar listenin sonuna eklenir.</p>
        </div>
      </header>

      <form className="adm-card adm-upload" onSubmit={upload}>
        <label className="adm-drop">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          <strong>{files.length ? `${files.length} dosya seçildi` : "Fotoğraf seçin"}</strong>
          <span>JPG, PNG veya WEBP · birden fazla seçebilirsiniz · otomatik küçültülür</span>
        </label>
        <div className="adm-upload-side">
          <div>
            <span className="adm-field-label">Kategoriler (birden fazla seçebilirsiniz)</span>
            <CatChips categories={categories} value={upCats} onChange={setUpCats} />
          </div>
          <button className="adm-btn primary" type="submit" disabled={busy || !files.length || !categories.length}>
            {busy ? "Yükleniyor…" : "Yükle"}
          </button>
          {!categories.length && <p className="adm-error">Önce bir kategori oluşturun.</p>}
        </div>
      </form>

      <div className="adm-tabs">
        <button type="button" className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
          Tümü <b>{photos.length}</b>
        </button>
        {categories.map((c) => (
          <button key={c.id} type="button" className={filter === c.id ? "on" : ""} onClick={() => setFilter(c.id)}>
            {c.name.tr || c.name.en} <b>{c.count}</b>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="adm-muted">Bu kategoride fotoğraf yok.</p>
      ) : (
        <div className="adm-photo-grid">
          {shown.map((p, i) => {
            const isCover = isCoverOf(p);
            const canCover = coverCatId(p) !== null;
            return (
              <div className="adm-photo" key={p.id}>
                <div className="adm-photo-img">
                  <img src={p.url} alt="" loading="lazy" />
                  {isCover && <span className="adm-badge">Kapak</span>}
                </div>
                <CatChips categories={categories} value={p.category_ids} onChange={(ids) => changeCats(p, ids)} />
                <div className="adm-photo-actions">
                  <button type="button" title="Yukarı taşı" onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </button>
                  <button type="button" title="Aşağı taşı" onClick={() => move(i, 1)} disabled={i === shown.length - 1}>
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setCover(p)}
                    disabled={isCover || !canCover}
                    title={canCover ? "" : "Birden fazla kategoride: kapak yapmak için önce bir kategori sekmesi seçin"}
                  >
                    Kapak yap
                  </button>
                  <button type="button" className="danger" onClick={() => remove(p)}>
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
