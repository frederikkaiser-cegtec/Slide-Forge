export function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "w-full bg-surface-hover border border-border rounded-lg px-3 py-1.5 text-sm text-text outline-none focus:border-primary transition-colors";
  return (
    <div>
      <label className="text-xs text-text-muted block mb-0.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-none h-16"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
