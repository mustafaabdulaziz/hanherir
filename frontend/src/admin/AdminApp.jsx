import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { api } from "../api.js";
import "../styles/admin.css";
import Login from "./Login.jsx";
import PhotosPage from "./PhotosPage.jsx";
import CategoriesPage from "./CategoriesPage.jsx";
import BranchesPage from "./BranchesPage.jsx";
import SettingsPage from "./SettingsPage.jsx";

const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

export default function AdminApp() {
  const [auth, setAuth] = useState(null);
  const [site, setSite] = useState(null);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = "tr";
    root.dir = "ltr";
    root.classList.add("ready");
    document.title = "Yönetim Paneli | Khan Al Harir";
    api("/api/auth/me")
      .then((r) => setAuth(r.authenticated))
      .catch(() => setAuth(false));
  }, []);

  const notify = useCallback((text, kind = "ok") => {
    setToast({ text, kind });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const reload = useCallback(
    () =>
      api("/api/site")
        .then((d) => {
          setSite(d);
          return d;
        })
        .catch((e) => notify(e.message, "err")),
    [notify]
  );

  useEffect(() => {
    if (auth) reload();
  }, [auth, reload]);

  /* Runs a mutation, refreshes site data, shows a toast. Returns null on failure. */
  const run = useCallback(
    async (fn, okMsg) => {
      try {
        const result = await fn();
        await reload();
        if (okMsg) notify(okMsg);
        return result ?? true;
      } catch (e) {
        if (e.status === 401) setAuth(false);
        notify(e.message || "Bir hata oluştu", "err");
        return null;
      }
    },
    [reload, notify]
  );

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setAuth(false);
    setSite(null);
  };

  if (auth === null) return null;
  if (!auth) {
    return (
      <Login onLogin={() => setAuth(true)} />
    );
  }

  return (
    <AdminCtx.Provider value={{ site, reload, run, notify }}>
      <div className="admin">
        <aside className="adm-side">
          <div className="adm-brand">
            <img src="/assets/mark.png" alt="" />
            <div>
              <strong>Khan Al Harir</strong>
              <small>Yönetim paneli</small>
            </div>
          </div>
          <nav className="adm-nav">
            <NavLink to="photos">Fotoğraflar</NavLink>
            <NavLink to="categories">Kategoriler</NavLink>
            <NavLink to="branches">Şubeler</NavLink>
            <NavLink to="settings">Ayarlar</NavLink>
          </nav>
          <div className="adm-side-foot">
            <a href="/" target="_blank" rel="noopener noreferrer">
              Siteyi aç ↗
            </a>
            <button type="button" onClick={logout}>
              Çıkış yap
            </button>
          </div>
        </aside>
        <main className="adm-main">
          {site ? (
            <Routes>
              <Route index element={<Navigate to="photos" replace />} />
              <Route path="photos" element={<PhotosPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="photos" replace />} />
            </Routes>
          ) : (
            <p className="adm-muted">Yükleniyor…</p>
          )}
        </main>
        {toast && <div className={"adm-toast " + toast.kind}>{toast.text}</div>}
      </div>
    </AdminCtx.Provider>
  );
}
