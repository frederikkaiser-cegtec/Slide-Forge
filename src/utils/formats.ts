export interface FormatPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const FORMAT_PRESETS: FormatPreset[] = [
  { id: '16:9', label: '16:9 (1920×1080)', width: 1920, height: 1080 },
  { id: '1:1', label: '1:1 (1080×1080)', width: 1080, height: 1080 },
  { id: '9:16', label: '9:16 (1080×1920)', width: 1080, height: 1920 },
  { id: '4:5', label: '4:5 (1080×1350)', width: 1080, height: 1350 },
  { id: 'linkedin', label: 'LinkedIn (1200×627)', width: 1200, height: 627 },
];

export function getFormat(id: string): FormatPreset {
  return FORMAT_PRESETS.find((f) => f.id === id) ?? FORMAT_PRESETS[0];
}
