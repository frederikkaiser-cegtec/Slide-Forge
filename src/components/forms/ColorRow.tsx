export function ColorRow({ label, value, defaultValue, onChange }: { label: string; value: string | undefined; defaultValue: string; onChange: (v: string) => void }) {
  const val = value || defaultValue;
  return (
    <div>
      <label className="text-xs text-text-muted block mb-0.5">{label}</label>
      <div className="flex gap-1">
        <input type="color" value={val} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded border border-border cursor-pointer shrink-0" />
        <input type="text" value={val} onChange={(e) => onChange(e.target.value)} className="w-full bg-surface-hover border border-border rounded-lg px-2 py-1 text-xs text-text outline-none focus:border-primary transition-colors" />
      </div>
    </div>
  );
}
