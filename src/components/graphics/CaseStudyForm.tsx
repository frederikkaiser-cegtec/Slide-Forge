import { Field, ColorRow, ChartForm } from '../forms';
import type { CaseStudyData, CaseStudySection, CaseStudyFunnelStep } from '../../types/graphics';

export function CaseStudyForm({ data, onChange }: { data: CaseStudyData; onChange: (d: CaseStudyData) => void }) {
  const update = (key: keyof CaseStudyData, value: any) => onChange({ ...data, [key]: value });

  const updateMetric = (i: number, field: 'value' | 'label', val: string) => {
    const metrics = [...data.metrics];
    metrics[i] = { ...metrics[i], [field]: val };
    onChange({ ...data, metrics });
  };

  const addMetric = () => {
    onChange({ ...data, metrics: [...data.metrics, { value: '', label: '' }] });
  };

  const removeMetric = (i: number) => {
    onChange({ ...data, metrics: data.metrics.filter((_, idx) => idx !== i) });
  };

  const updateSection = (i: number, field: keyof CaseStudySection, val: any) => {
    const sections = [...data.sections];
    sections[i] = { ...sections[i], [field]: val };
    onChange({ ...data, sections });
  };

  const updateBullet = (si: number, bi: number, val: string) => {
    const sections = [...data.sections];
    const bullets = [...sections[si].bullets];
    bullets[bi] = val;
    sections[si] = { ...sections[si], bullets };
    onChange({ ...data, sections });
  };

  const addBullet = (si: number) => {
    const sections = [...data.sections];
    sections[si] = { ...sections[si], bullets: [...sections[si].bullets, ''] };
    onChange({ ...data, sections });
  };

  const removeBullet = (si: number, bi: number) => {
    const sections = [...data.sections];
    sections[si] = { ...sections[si], bullets: sections[si].bullets.filter((_, idx) => idx !== bi) };
    onChange({ ...data, sections });
  };

  const addSection = () => {
    onChange({ ...data, sections: [...data.sections, { title: 'Neuer Abschnitt', bullets: [''] }] });
  };

  const removeSection = (i: number) => {
    onChange({ ...data, sections: data.sections.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Unternehmen" value={data.companyName} onChange={(v) => update('companyName', v)} />
      <Field label="Branche" value={data.industry} onChange={(v) => update('industry', v)} />
      <Field label="Kundenlogo URL" value={data.clientLogoUrl || ''} onChange={(v) => update('clientLogoUrl', v)} />
      <Field label="Headline" value={data.headline} onChange={(v) => update('headline', v)} textarea />

      {/* Hero Metric */}
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Hero-Metrik</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert" value={data.heroValue} onChange={(v) => update('heroValue', v)} />
        <Field label="Label" value={data.heroLabel} onChange={(v) => update('heroLabel', v)} />
      </div>

      {/* KPI Metrics */}
      <div className="border-t border-border pt-3 mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">KPI-Metriken ({data.metrics.length})</span>
          <button onClick={addMetric} className="text-xs text-primary hover:text-primary/80 font-medium">+ Hinzufuegen</button>
        </div>
      </div>
      {data.metrics.map((m, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <Field label={`Wert ${i + 1}`} value={m.value} onChange={(v) => updateMetric(i, 'value', v)} />
          <Field label={`Label ${i + 1}`} value={m.label} onChange={(v) => updateMetric(i, 'label', v)} />
          {data.metrics.length > 1 && (
            <button onClick={() => removeMetric(i)} className="text-xs text-red-500 hover:text-red-400 pb-2">&times;</button>
          )}
        </div>
      ))}

      {/* Sections */}
      <div className="border-t border-border pt-3 mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Text-Sektionen ({data.sections.length})</span>
          <button onClick={addSection} className="text-xs text-primary hover:text-primary/80 font-medium">+ Sektion</button>
        </div>
      </div>
      {data.sections.map((sec, si) => (
        <div key={si} className="border border-border/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Field label="Titel" value={sec.title} onChange={(v) => updateSection(si, 'title', v)} />
            {data.sections.length > 1 && (
              <button onClick={() => removeSection(si)} className="text-xs text-red-500 hover:text-red-400 ml-2">&times;</button>
            )}
          </div>
          <Field label="Intro (optional)" value={sec.intro || ''} onChange={(v) => updateSection(si, 'intro', v)} textarea />
          {sec.bullets.map((b, bi) => (
            <div key={bi} className="flex items-center gap-1">
              <span className="text-xs text-text-muted shrink-0">&bull;</span>
              <input
                value={b}
                onChange={(e) => updateBullet(si, bi, e.target.value)}
                className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40"
                placeholder="Bullet Point..."
              />
              {sec.bullets.length > 1 && (
                <button onClick={() => removeBullet(si, bi)} className="text-xs text-red-500 hover:text-red-400 shrink-0">&times;</button>
              )}
            </div>
          ))}
          <button onClick={() => addBullet(si)} className="text-xs text-text-muted hover:text-text">+ Bullet</button>
        </div>
      ))}

      {/* Funnel Steps */}
      <div className="border-t border-border pt-3 mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Funnel-Steps ({(data.funnelSteps || []).length})</span>
          <button onClick={() => onChange({ ...data, funnelSteps: [...(data.funnelSteps || []), { label: '', value: '', pct: 50, color: '#3b82f6' }] })} className="text-xs text-primary hover:text-primary/80 font-medium">+ Step</button>
        </div>
      </div>
      {(data.funnelSteps || []).map((fs, i) => (
        <div key={i} className="grid grid-cols-[1fr_0.6fr_0.4fr_auto] gap-1 items-end">
          <input value={fs.label} onChange={(e) => { const steps = [...data.funnelSteps]; steps[i] = { ...steps[i], label: e.target.value }; onChange({ ...data, funnelSteps: steps }); }} className="bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none" placeholder="Label" />
          <input value={fs.value} onChange={(e) => { const steps = [...data.funnelSteps]; steps[i] = { ...steps[i], value: e.target.value }; onChange({ ...data, funnelSteps: steps }); }} className="bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none" placeholder="Wert" />
          <input type="number" value={fs.pct} onChange={(e) => { const steps = [...data.funnelSteps]; steps[i] = { ...steps[i], pct: parseFloat(e.target.value) || 0 }; onChange({ ...data, funnelSteps: steps }); }} className="bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none" placeholder="%" />
          <button onClick={() => onChange({ ...data, funnelSteps: data.funnelSteps.filter((_, idx) => idx !== i) })} className="text-xs text-red-500 hover:text-red-400 pb-1">&times;</button>
        </div>
      ))}

      {/* Quote */}
      <Field label="Zitat (optional)" value={data.quote} onChange={(v) => update('quote', v)} textarea />

      {/* Colors */}
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#71717A" onChange={(v) => onChange({ ...data, labelColor: v })} />

      {/* Texts */}
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Texte</span>
      </div>
      <Field label="Tagline" value={data.tagline || 'Case Study'} onChange={(v) => onChange({ ...data, tagline: v })} />
      <Field label="CTA Headline" value={data.ctaText || 'Erstgespraech vereinbaren'} onChange={(v) => onChange({ ...data, ctaText: v })} />
      <Field label="CTA Subtext" value={data.ctaSub || ''} onChange={(v) => onChange({ ...data, ctaSub: v })} />
      <Field label="Footer links" value={data.footerLeft || 'cegtec.net'} onChange={(v) => onChange({ ...data, footerLeft: v })} />
      <Field label="Footer rechts" value={data.footerRight || 'GTM Engineering Partner'} onChange={(v) => onChange({ ...data, footerRight: v })} />

      <ChartForm chart={data.chart} onChange={(chart) => onChange({ ...data, chart })} />
    </div>
  );
}
