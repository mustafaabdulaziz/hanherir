const LANG_META = [
  ["tr", "Türkçe", "ltr"],
  ["ar", "Arapça", "rtl"],
  ["en", "İngilizce", "ltr"]
];

/* Three inputs (TR / AR / EN) bound to form[prefix_lang]. */
export default function LangFields({ form, setForm, prefix, label, textarea = false }) {
  return (
    <div className="adm-langs">
      {LANG_META.map(([lang, name, dir]) => {
        const key = `${prefix}_${lang}`;
        const Tag = textarea ? "textarea" : "input";
        return (
          <label key={key}>
            <span>
              {label} <em>{name}</em>
            </span>
            <Tag
              dir={dir}
              lang={lang}
              rows={textarea ? 2 : undefined}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        );
      })}
    </div>
  );
}
