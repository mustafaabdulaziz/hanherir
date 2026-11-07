import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import { useAdmin } from "./AdminApp.jsx";
import LangFields from "./LangFields.jsx";

const EMPTY = {
  name_tr: "", name_ar: "", name_en: "",
  address_tr: "", address_ar: "", address_en: "",
  hours_tr: "", hours_ar: "", hours_en: "",
  phone: "", map_query: "", map_url: ""
};

const fromBranch = (b) => ({
  name_tr: b.name?.tr || "", name_ar: b.name?.ar || "", name_en: b.name?.en || "",
  address_tr: b.address?.tr || "", address_ar: b.address?.ar || "", address_en: b.address?.en || "",
  hours_tr: b.hours?.tr || "", hours_ar: b.hours?.ar || "", hours_en: b.hours?.en || "",
  phone: b.phone || "",
  map_query: (b.map && !b.map.startsWith("http") ? b.map : "") || "",
  map_url: b.map_url || (b.map && b.map.startsWith("http") ? b.map : "") || ""
});

export default function BranchesPage() {
  const { site, run } = useAdmin();
  const { branches } = site;
  const [adding, setAdding] = useState(false);

  const submit = (branch, form, file, removePhoto) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (file) fd.append("photo", file);
    if (removePhoto) fd.append("remove_photo", "1");
    const url = branch ? `/api/admin/branches/${branch.id}` : "/api/admin/branches";
    return run(() => api(url, { method: "POST", form: fd }), branch ? "Şube kaydedildi." : "Şube eklendi.");
  };

  const remove = (b) => {
    if (!window.confirm(`"${b.name.tr || b.name.ar || b.name.en}" şubesi silinsin mi?`)) return;
    run(() => api(`/api/admin/branches/${b.id}`, { method: "DELETE" }), "Şube silindi.");
  };

  const move = (i, d) => {
    const ids = branches.map((b) => b.id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    run(() => api("/api/admin/reorder", { method: "POST", body: { type: "branches", ids } }));
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Şubeler / الفروع</h1>
          <p className="adm-muted">
            {branches.length} şube · Her şube için Google Maps linki, adres ve telefon ekleyebilirsiniz. (يمكنك إضافة رابط خرائط جوجل ورقم الهاتف والعنوان لكل فرع).
          </p>
        </div>
        {!adding && (
          <button className="adm-btn primary" type="button" onClick={() => setAdding(true)}>
            + Yeni şube / إضافة فرع
          </button>
        )}
      </header>

      {adding && (
        <BranchForm
          title="Yeni şube / فرع جديد"
          onSubmit={async (form, file) => {
            const ok = await submit(null, form, file, false);
            if (ok) setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {branches.map((b, i) => (
        <BranchForm
          key={b.id}
          branch={b}
          index={i}
          first={i === 0}
          last={i === branches.length - 1}
          onSubmit={(form, file, removePhoto) => submit(b, form, file, removePhoto)}
          onDelete={() => remove(b)}
          onMove={(d) => move(i, d)}
        />
      ))}
    </>
  );
}

function BranchForm({ branch, index, title, first, last, onSubmit, onCancel, onDelete, onMove }) {
  const [form, setForm] = useState(branch ? fromBranch(branch) : EMPTY);
  const [file, setFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (branch) {
      setForm(fromBranch(branch));
      setFile(null);
      setRemovePhoto(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [branch]);

  const dirty = !branch || file || removePhoto || JSON.stringify(form) !== JSON.stringify(fromBranch(branch));
  const preview = file ? URL.createObjectURL(file) : removePhoto ? null : branch?.photo;

  const handle = async (e) => {
    e.preventDefault();
    setBusy(true);
    await onSubmit(form, file, removePhoto);
    setBusy(false);
  };

  return (
    <form className="adm-card adm-branch" onSubmit={handle}>
      <div className="adm-branch-head">
        <h2>{branch ? `${String(index + 1).padStart(2, "0")} · ${branch.name.ar || branch.name.tr || branch.name.en || "Şube"}` : title}</h2>
        {branch && (
          <div className="adm-inline">
            <button type="button" title="Yukarı" onClick={() => onMove(-1)} disabled={first}>
              ↑
            </button>
            <button type="button" title="Aşağı" onClick={() => onMove(1)} disabled={last}>
              ↓
            </button>
          </div>
        )}
      </div>

      <div className="adm-branch-grid">
        <div className="adm-branch-photo">
          {preview ? <img src={preview} alt="" /> : <span>Fotoğraf yok / لا توجد صورة</span>}
          <label className="adm-btn small">
            Fotoğraf seç / اختيار صورة
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setRemovePhoto(false);
              }}
            />
          </label>
          {(branch?.photo || file) && (
            <label className="adm-check">
              <input
                type="checkbox"
                checked={removePhoto}
                onChange={(e) => {
                  setRemovePhoto(e.target.checked);
                  if (e.target.checked) {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }
                }}
              />
              Fotoğrafı kaldır / حذف الصورة
            </label>
          )}
        </div>

        <div className="adm-branch-fields">
          <LangFields form={form} setForm={setForm} prefix="name" label="Şube adı / اسم الفرع" />
          <LangFields form={form} setForm={setForm} prefix="address" label="Adres / العنوان التفصيلي" textarea />
          <LangFields form={form} setForm={setForm} prefix="hours" label="Ziyaret / saat / ساعات العمل" />
          <div className="adm-two">
            <label>
              <span>Telefon / رقم الهاتف</span>
              <input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+90 212 000 00 00" />
            </label>
            <label>
              <span>Harita arama metni (İsteğe bağlı) / عنوان البحث في الخريطة</span>
              <input
                dir="ltr"
                value={form.map_query}
                onChange={(e) => setForm({ ...form, map_query: e.target.value })}
                placeholder="Örn: Fatih, İstanbul"
              />
            </label>
          </div>
          <div style={{ marginTop: "0.8rem" }}>
            <label>
              <span>Google Maps Linki / رابط الموقع على خرائط جوجل (Google Maps URL)</span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  dir="ltr"
                  type="url"
                  value={form.map_url}
                  onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                  placeholder="https://maps.app.goo.gl/... veya https://www.google.com/maps/place/..."
                  style={{ flex: 1 }}
                />
                {form.map_url && (
                  <a
                    href={form.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn small"
                    style={{ textDecoration: "none", whiteSpace: "nowrap" }}
                  >
                    ↗ Bağlantıyı test et / تجربة الرابط
                  </a>
                )}
              </div>
              <small style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "4px", display: "block" }}>
                Ziyaretçiler "Yol Tarifi / الاتجاهات" butonuna bastığında bu link açılır.
                (الرابط الذي يتم فتحه عند نقر الزائر على زر "الاتجاهات").
              </small>
            </label>
          </div>
        </div>
      </div>

      <div className="adm-row-end">
        {branch ? (
          <button className="adm-btn danger" type="button" onClick={onDelete}>
            Sil
          </button>
        ) : (
          <button className="adm-btn" type="button" onClick={onCancel}>
            Vazgeç
          </button>
        )}
        <button className="adm-btn primary" type="submit" disabled={busy || !dirty}>
          {busy ? "Kaydediliyor…" : branch ? "Kaydet" : "Ekle"}
        </button>
      </div>
    </form>
  );
}
