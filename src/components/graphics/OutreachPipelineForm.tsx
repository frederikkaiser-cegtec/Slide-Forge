import { useState } from 'react';
import type { OutreachPipelineData, PipelinePhase, PipelineStep } from './OutreachPipelineGraphic';

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const base: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    fontSize: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    background: '#fff',
    color: '#1a1a2e',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: textarea ? 'vertical' : undefined,
  };
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 3 }}>
        {label}
      </label>
      {textarea ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} style={base} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={base} />
      )}
    </div>
  );
}

function StepEditor({
  step,
  phaseColor,
  onChange,
}: {
  step: PipelineStep;
  phaseColor: string;
  onChange: (s: PipelineStep) => void;
}) {
  return (
    <div style={{ padding: '8px', background: '#fafafa', borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 6 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#eee', border: `1px solid ${phaseColor}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color: phaseColor, flexShrink: 0,
        }}>
          {step.num}
        </div>
        <input
          type="text"
          value={step.title}
          onChange={(e) => onChange({ ...step, title: e.target.value })}
          style={{ flex: 1, fontSize: 12, padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: 4, fontWeight: 600 }}
        />
      </div>
      <textarea
        rows={2}
        value={step.desc}
        onChange={(e) => onChange({ ...step, desc: e.target.value })}
        style={{ width: '100%', fontSize: 11, padding: '4px 6px', border: '1px solid #e5e7eb', borderRadius: 4, resize: 'vertical', boxSizing: 'border-box', marginBottom: 4 }}
      />
      <input
        type="text"
        value={step.tools.join(', ')}
        onChange={(e) => onChange({ ...step, tools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
        placeholder="Tools (kommagetrennt)"
        style={{ width: '100%', fontSize: 10, padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: 4, boxSizing: 'border-box', color: '#71717a' }}
      />
    </div>
  );
}

function PhaseEditor({
  phase,
  index,
  onChange,
}: {
  phase: PipelinePhase;
  index: number;
  onChange: (p: PipelinePhase) => void;
}) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ marginBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '8px 10px',
          background: phase.bgColor, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 10, fontWeight: 700, color: phase.accentColor,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}
      >
        <span>{phase.label}</span>
        <span style={{ opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: 8 }}>
          {phase.steps.map((step, si) => (
            <StepEditor
              key={si}
              step={step}
              phaseColor={phase.accentColor}
              onChange={(s) => {
                const steps = [...phase.steps];
                steps[si] = s;
                onChange({ ...phase, steps });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OutreachPipelineForm({
  data,
  onChange,
}: {
  data: OutreachPipelineData;
  onChange: (d: OutreachPipelineData) => void;
}) {
  return (
    <div style={{ padding: '12px', fontFamily: 'system-ui, sans-serif' }}>
      <Field label="Top Label" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} textarea />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} textarea />
      <Field label="Footer" value={data.footerText} onChange={(v) => onChange({ ...data, footerText: v })} />

      <div style={{ marginTop: 12, marginBottom: 6, fontSize: 10, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1 }}>
        Phasen & Schritte
      </div>
      {data.phases.map((phase, pi) => (
        <PhaseEditor
          key={pi}
          phase={phase}
          index={pi}
          onChange={(p) => {
            const phases = [...data.phases];
            phases[pi] = p;
            onChange({ ...data, phases });
          }}
        />
      ))}
    </div>
  );
}
