import { useState } from "react";
import { api } from "../api.js";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: { password } });
      const me = await api("/api/auth/me");
      onLogin(me);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin adm-login-wrap">
      <form className="adm-login" onSubmit={submit}>
        <img src="/assets/mark.png" alt="" />
        <h1>Yönetim paneli</h1>
        <p className="adm-muted">Khan Al Harir sitesini buradan yönetin.</p>
        <label>
          <span>Şifre</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </label>
        {error && <p className="adm-error">{error}</p>}
        <button className="adm-btn primary" type="submit" disabled={busy || !password}>
          {busy ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
