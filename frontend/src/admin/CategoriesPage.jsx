import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAdmin } from "./AdminApp.jsx";
import LangFields from "./LangFields.jsx";

const EMPTY = { name_tr: "", name_ar: "", name_en: "" };
const fromCat = (c) => ({ name_tr: c.name.tr, name_ar: c.name.ar, name_en: c.name.en });

export default function CategoriesPage() {
  const { site, run } = useAdmin();
  const { categories } = site;
  const [draft, setDraft] = useState(EMPTY);

  const add = async (e) => {
    e.preventDefault();
    const ok = await run(() => api("/api/admin/categories", { method: "POST", body: draft }), "Kategori eklendi.");
    if (ok) setDraft(EMPTY);
  };

  const save = (c, form) =>
    run(() => api(`/api/admin/categories/${c.id}`, { method: "PUT", body: form }), "Kategori kaydedildi.");

  const remove = (c) => {
    if (!window.confirm(`"${c.name.tr || c.slug}" kategorisi silinsin mi?`)) return;
    run(() => api(`/api/admin/categories/${c.id}`, { method: "DELETE" }), "Kategori silindi.");
  };

  const move = (i, d) => {
    const ids = categories.map((c) => c.id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    run(() => api("/api/admin/reorder", { method: "POST", body: { type: "categories", ids } }));
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Kategoriler</h1>
          <p className="adm-muted">Sitedeki kartlar ve filtreler bu sıraya göre gösterilir.</p>
        </div>
      </header>

      <form className="adm-card" onSubmit={add}>
        <h2>Yeni kategori</h2>
        <LangFields form={draft} setForm={setDraft} prefix="name" label="Ad" />
        <div className="adm-row-end">
          <button className="adm-btn primary" type="submit" disabled={!(draft.name_tr || draft.name_ar || draft.name_en)}>
            Ekle
          </button>
        </div>
      </form>

      {categories.map((c, i) => (
        <CategoryRow
          key={c.id}
          cat={c}
          first={i === 0}
          last={i === categories.length - 1}
          onSave={(form) => save(c, form)}
          onDelete={() => remove(c)}
          onMove={(d) => move(i, d)}
        />
      ))}
    </>
  );
}

function CategoryRow({ cat, first, last, onSave, onDelete, onMove }) {
  const [form, setForm] = useState(fromCat(cat));
  useEffect(() => setForm(fromCat(cat)), [cat]);
  const dirty = JSON.stringify(form) !== JSON.stringify(fromCat(cat));

  return (
    <form
      className="adm-card adm-cat"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="adm-cat-cover">{cat.cover ? <img src={cat.cover} alt="" /> : <span>Kapak yok</span>}</div>
      <div className="adm-cat-body">
        <LangFields form={form} setForm={setForm} prefix="name" label="Ad" />
        <p className="adm-muted">
          {cat.count} fotoğraf · adres kodu <code>{cat.slug}</code>
          {cat.count > 0 ? " · kapak fotoğrafını Fotoğraflar sayfasından seçin" : ""}
        </p>
      </div>
      <div className="adm-cat-actions">
        <button type="button" title="Yukarı" onClick={() => onMove(-1)} disabled={first}>
          ↑
        </button>
        <button type="button" title="Aşağı" onClick={() => onMove(1)} disabled={last}>
          ↓
        </button>
        <button className="adm-btn primary" type="submit" disabled={!dirty}>
          Kaydet
        </button>
        <button
          className="adm-btn danger"
          type="button"
          onClick={onDelete}
          disabled={cat.count > 0}
          title={cat.count > 0 ? "Önce bu kategorideki fotoğrafları taşıyın veya silin" : ""}
        >
          Sil
        </button>
      </div>
    </form>
  );
}
