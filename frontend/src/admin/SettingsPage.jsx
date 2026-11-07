import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import { useAdmin } from "./AdminApp.jsx";
import LangFields from "./LangFields.jsx";

const HERO_SLOTS = [
  ["main", "Büyük fotoğraf"],
  ["a", "Küçük fotoğraf (üst)"],
  ["b", "Küçük fotoğraf (alt)"]
];

export default function SettingsPage() {
  const { site, run } = useAdmin();
  const { contact, hero } = site;

  const [form, setForm] = useState({ phone: "", whatsapp: "", email: "", instagram: "" });
  const [ticker, setTicker] = useState({ ticker_tr: "", ticker_ar: "", ticker_en: "" });
  const [busySlot, setBusySlot] = useState(null);
  const inputs = useRef({});

  useEffect(() => {
    setForm({ phone: contact.phone, whatsapp: contact.whatsapp, email: contact.email, instagram: contact.instagram });
  }, [contact]);

  useEffect(() => {
    const t = site.ticker || {};
    setTicker({
      ticker_tr: (t.tr || []).join("\n"),
      ticker_ar: (t.ar || []).join("\n"),
      ticker_en: (t.en || []).join("\n")
    });
  }, [site.ticker]);

  const saveTicker = (e) => {
    e.preventDefault();
    run(() => api("/api/admin/settings", { method: "PUT", body: ticker }), "Şerit yazıları kaydedildi.");
  };

  const saveContact = (e) => {
    e.preventDefault();
    run(() => api("/api/admin/settings", { method: "PUT", body: form }), "İletişim bilgileri kaydedildi.");
  };

  const pickHero = async (slot, file) => {
    if (!file) return;
    setBusySlot(slot);
    const fd = new FormData();
    fd.append("file", file);
    await run(() => api(`/api/admin/hero/${slot}`, { method: "POST", form: fd }), "Fotoğraf kaydedildi.");
    setBusySlot(null);
    if (inputs.current[slot]) inputs.current[slot].value = "";
  };

  const clearHero = async (slot) => {
    setBusySlot(slot);
    await run(() => api(`/api/admin/hero/${slot}`, { method: "DELETE" }), "Fotoğraf kaldırıldı.");
    setBusySlot(null);
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Ayarlar</h1>
          <p className="adm-muted">İletişim bilgileri ve ana sayfa fotoğrafları.</p>
        </div>
      </header>

      <form className="adm-card" onSubmit={saveContact}>
        <h2>İletişim</h2>
        <div className="adm-two">
          <label>
            <span>Telefon (sitede görünen)</span>
            <input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+90 212 000 00 00" />
          </label>
          <label>
            <span>WhatsApp numarası (sadece rakam)</span>
            <input dir="ltr" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="905xxxxxxxxx" />
          </label>
          <label>
            <span>E-posta</span>
            <input dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            <span>Instagram bağlantısı</span>
            <input dir="ltr" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
          </label>
        </div>
        <div className="adm-row-end">
          <button className="adm-btn primary" type="submit">
            Kaydet
          </button>
        </div>
      </form>

      <form className="adm-card" onSubmit={saveTicker}>
        <h2>Kayan şerit yazıları</h2>
        <p className="adm-muted">
          Ana sayfada fotoğrafların altında akan koyu şerit. Her satır bir yazıdır. Bir dil boş bırakılırsa o dilde kategori adları ve şehir adı gösterilir.
        </p>
        <LangFields form={ticker} setForm={setTicker} prefix="ticker" label="Yazılar" textarea />
        <div className="adm-row-end">
          <button className="adm-btn primary" type="submit">
            Kaydet
          </button>
        </div>
      </form>

      <section className="adm-card">
        <h2>Ana sayfa fotoğrafları</h2>
        <p className="adm-muted">
          Sayfanın en üstündeki üçlü kolaj. Her alan için bilgisayarınızdan doğrudan fotoğraf seçin; seçer seçmez kaydedilir. Bu fotoğraflar galeride görünmez.
        </p>
        <div className="adm-hero-grid">
          {HERO_SLOTS.map(([slot, label]) => (
            <div className="adm-hero-slot" key={slot}>
              <div className="adm-hero-preview">{hero[slot] ? <img src={hero[slot]} alt="" /> : <span>Seçilmedi</span>}</div>
              <strong>{label}</strong>
              <div className="adm-row-end" style={{ justifyContent: "flex-start", marginTop: "0.5rem" }}>
                <input
                  ref={(el) => (inputs.current[slot] = el)}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => pickHero(slot, e.target.files && e.target.files[0])}
                />
                <button type="button" className="adm-btn primary small" disabled={busySlot === slot} onClick={() => inputs.current[slot].click()}>
                  {busySlot === slot ? "Yükleniyor…" : hero[slot] ? "Değiştir" : "Fotoğraf seç"}
                </button>
                {hero[slot] && (
                  <button type="button" className="adm-btn danger small" disabled={busySlot === slot} onClick={() => clearHero(slot)}>
                    Kaldır
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
