export interface ChartSeries {
  name: string;
  values: number[];
  color: string;
}

export interface ChartConfig {
  type: 'bar' | 'bar-h' | 'line' | 'area' | 'pie';
  xLabels: string[];
  series: ChartSeries[];
  style: {
    backgroundColor: string;
    gridColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    showGrid: boolean;
    showLegend: boolean;
    showValues: boolean;
    barRadius: number;
    padding: number;
  };
  width: number;
  height: number;
}

function niceMax(val: number): number {
  if (val <= 0) return 10;
  const exp = Math.pow(10, Math.floor(Math.log10(val)));
  const frac = val / exp;
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return nice * exp;
}

function fmt(val: number): string {
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000) return (val / 1_000).toFixed(1) + 'k';
  if (Number.isInteger(val)) return String(val);
  return val.toFixed(1);
}

function legendHeight(config: ChartConfig): number {
  if (!config.style.showLegend) return 0;
  if (config.type === 'pie') return config.series.length > 0 ? 28 : 0;
  return config.series.length > 1 ? 28 : 0;
}

export function generateBarSvg(config: ChartConfig): string {
  const { width: W, height: H, series, xLabels, style } = config;
  const { backgroundColor, gridColor, textColor, fontFamily, fontSize: fs, showGrid, showValues } = style;
  const p = style.padding;
  const legH = legendHeight(config);
  const ml = 52 + p, mr = 16 + (p >> 1), mt = 16 + (p >> 1), mb = 38 + p;
  const plotW = W - ml - mr;
  const plotH = H - mt - mb - legH;

  const nG = xLabels.length;
  const nS = series.length;
  if (nG === 0 || nS === 0) return emptysvg(W, H, backgroundColor);

  const allV = series.flatMap((s) => s.values).filter(isFinite);
  const yMax = niceMax(Math.max(...allV, 1));
  const nTicks = 5;

  let out = '';

  for (let i = 0; i <= nTicks; i++) {
    const v = (yMax / nTicks) * i;
    const y = mt + plotH - (v / yMax) * plotH;
    if (showGrid) out += `<line x1="${ml}" y1="${f1(y)}" x2="${f1(ml + plotW)}" y2="${f1(y)}" stroke="${gridColor}" stroke-width="1" opacity="0.35"/>`;
    out += `<text x="${f1(ml - 6)}" y="${f1(y + fs * 0.35)}" text-anchor="end" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.7">${fmt(v)}</text>`;
  }

  const gW = plotW / nG;
  const bW = Math.max(2, (gW * 0.76 - Math.max(0, nS - 1) * 2) / nS);
  const gap = nS > 1 ? 2 : 0;
  const innerPad = (gW - bW * nS - gap * (nS - 1)) / 2;

  for (let gi = 0; gi < nG; gi++) {
    const gx = ml + gi * gW;
    out += `<text x="${f1(gx + gW / 2)}" y="${f1(mt + plotH + fs + 5)}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.7">${xLabels[gi] ?? ''}</text>`;
    for (let si = 0; si < nS; si++) {
      const v = series[si].values[gi] ?? 0;
      const bh = Math.max(0, (v / yMax) * plotH);
      const bx = gx + innerPad + si * (bW + gap);
      const by = mt + plotH - bh;
      const rx = Math.min(style.barRadius, bW / 2, bh > 0 ? bh / 2 : 0);
      out += `<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bW)}" height="${f1(bh)}" fill="${series[si].color}" rx="${rx}"/>`;
      if (showValues && v !== 0) out += `<text x="${f1(bx + bW / 2)}" y="${f1(by - 4)}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${Math.max(9, fs - 1)}" opacity="0.9">${fmt(v)}</text>`;
    }
  }

  out += axes(ml, mt, plotW, plotH, gridColor);
  out += legend(config, ml, W, H, legH, fs, textColor, fontFamily);

  return svg(W, H, backgroundColor, out);
}

export function generateBarHSvg(config: ChartConfig): string {
  const { width: W, height: H, series, xLabels, style } = config;
  const { backgroundColor, gridColor, textColor, fontFamily, fontSize: fs, showGrid, showValues } = style;
  const p = style.padding;
  const legH = legendHeight(config);
  const ml = 80 + p, mr = 20 + (p >> 1), mt = 16 + (p >> 1), mb = 36 + p;
  const plotW = W - ml - mr;
  const plotH = H - mt - mb - legH;

  const nG = xLabels.length;
  const nS = series.length;
  if (nG === 0 || nS === 0) return emptysvg(W, H, backgroundColor);

  const allV = series.flatMap((s) => s.values).filter(isFinite);
  const xMax = niceMax(Math.max(...allV, 1));
  const nTicks = 5;

  let out = '';

  for (let i = 0; i <= nTicks; i++) {
    const v = (xMax / nTicks) * i;
    const x = ml + (v / xMax) * plotW;
    if (showGrid) out += `<line x1="${f1(x)}" y1="${mt}" x2="${f1(x)}" y2="${f1(mt + plotH)}" stroke="${gridColor}" stroke-width="1" opacity="0.35"/>`;
    out += `<text x="${f1(x)}" y="${f1(mt + plotH + fs + 5)}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.7">${fmt(v)}</text>`;
  }

  const gH = plotH / nG;
  const bH = Math.max(2, (gH * 0.76 - Math.max(0, nS - 1) * 2) / nS);
  const gap = nS > 1 ? 2 : 0;
  const innerPad = (gH - bH * nS - gap * (nS - 1)) / 2;

  for (let gi = 0; gi < nG; gi++) {
    const gy = mt + gi * gH;
    out += `<text x="${f1(ml - 8)}" y="${f1(gy + gH / 2 + fs * 0.35)}" text-anchor="end" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.7">${xLabels[gi] ?? ''}</text>`;
    for (let si = 0; si < nS; si++) {
      const v = series[si].values[gi] ?? 0;
      const bw = Math.max(0, (v / xMax) * plotW);
      const by = gy + innerPad + si * (bH + gap);
      const rx = Math.min(style.barRadius, bH / 2, bw > 0 ? bw / 2 : 0);
      out += `<rect x="${ml}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bH)}" fill="${series[si].color}" rx="${rx}"/>`;
      if (showValues && v !== 0) out += `<text x="${f1(ml + bw + 4)}" y="${f1(by + bH / 2 + fs * 0.35)}" fill="${textColor}" font-family="${fontFamily}" font-size="${Math.max(9, fs - 1)}" opacity="0.9">${fmt(v)}</text>`;
    }
  }

  out += axes(ml, mt, plotW, plotH, gridColor);
  out += legend(config, ml, W, H, legH, fs, textColor, fontFamily);

  return svg(W, H, backgroundColor, out);
}

export function generateLineSvg(config: ChartConfig): string {
  const { width: W, height: H, series, xLabels, style, type } = config;
  const { backgroundColor, gridColor, textColor, fontFamily, fontSize: fs, showGrid, showValues } = style;
  const isArea = type === 'area';
  const p = style.padding;
  const legH = legendHeight(config);
  const ml = 52 + p, mr = 16 + (p >> 1), mt = 16 + (p >> 1), mb = 38 + p;
  const plotW = W - ml - mr;
  const plotH = H - mt - mb - legH;

  const nG = xLabels.length;
  const nS = series.length;
  if (nG === 0 || nS === 0) return emptysvg(W, H, backgroundColor);

  const allV = series.flatMap((s) => s.values).filter(isFinite);
  const rawMin = Math.min(...allV, 0);
  const rawMax = Math.max(...allV, 1);
  const yMin = rawMin < 0 ? rawMin : 0;
  const yMax = niceMax(rawMax);
  const yRange = yMax - yMin || 1;

  const toY = (v: number) => mt + plotH - ((v - yMin) / yRange) * plotH;
  const toX = (i: number) => ml + (i / Math.max(nG - 1, 1)) * plotW;

  const nTicks = 5;
  let out = '';

  for (let i = 0; i <= nTicks; i++) {
    const v = yMin + (yRange / nTicks) * i;
    const y = toY(v);
    if (showGrid) out += `<line x1="${ml}" y1="${f1(y)}" x2="${f1(ml + plotW)}" y2="${f1(y)}" stroke="${gridColor}" stroke-width="1" opacity="0.35"/>`;
    out += `<text x="${f1(ml - 6)}" y="${f1(y + fs * 0.35)}" text-anchor="end" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.7">${fmt(v)}</text>`;
  }

  for (let i = 0; i < nG; i++) {
    out += `<text x="${f1(toX(i))}" y="${f1(mt + plotH + fs + 5)}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.7">${xLabels[i] ?? ''}</text>`;
  }

  for (let si = 0; si < nS; si++) {
    const s = series[si];
    const pts = Array.from({ length: nG }, (_, i) => `${f1(toX(i))},${f1(toY(s.values[i] ?? 0))}`);
    const pStr = pts.join(' ');

    if (isArea) {
      const baseY = f1(toY(yMin));
      const fx = pts[0].split(',')[0];
      const lx = pts[pts.length - 1].split(',')[0];
      out += `<polygon points="${pStr} ${lx},${baseY} ${fx},${baseY}" fill="${s.color}" opacity="0.15"/>`;
    }

    out += `<polyline points="${pStr}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;

    for (let i = 0; i < nG; i++) {
      const v = s.values[i] ?? 0;
      const px = toX(i), py = toY(v);
      out += `<circle cx="${f1(px)}" cy="${f1(py)}" r="4" fill="${s.color}" stroke="${backgroundColor}" stroke-width="1.5"/>`;
      if (showValues) out += `<text x="${f1(px)}" y="${f1(py - 8)}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${Math.max(9, fs - 1)}" opacity="0.9">${fmt(v)}</text>`;
    }
  }

  out += axes(ml, mt, plotW, plotH, gridColor);

  if (style.showLegend && nS > 1) {
    const ly = H - legH + 7;
    let lx = ml + (plotW - nS * 90) / 2;
    for (let si = 0; si < nS; si++) {
      out += `<line x1="${f1(lx)}" y1="${ly + 5}" x2="${f1(lx + 16)}" y2="${ly + 5}" stroke="${series[si].color}" stroke-width="2.5"/>`;
      out += `<circle cx="${f1(lx + 8)}" cy="${ly + 5}" r="3" fill="${series[si].color}"/>`;
      out += `<text x="${f1(lx + 20)}" y="${ly + 9}" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.85">${series[si].name}</text>`;
      lx += 90;
    }
  }

  return svg(W, H, backgroundColor, out);
}

export function generatePieSvg(config: ChartConfig): string {
  const { width: W, height: H, series, style } = config;
  const { backgroundColor, textColor, fontFamily, fontSize: fs, showValues } = style;
  const legH = legendHeight(config);
  const cx = W / 2;
  const cy = (H - legH) / 2;
  const r = Math.min(W, H - legH) * 0.38;
  const ir = r * 0.55;

  const slices = series.map((s) => ({ name: s.name, value: Math.max(0, s.values[0] ?? 0), color: s.color }));
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;

  let out = '';
  let angle = -Math.PI / 2;

  for (const sl of slices) {
    const sweep = (sl.value / total) * 2 * Math.PI;
    if (sweep <= 0.001) { angle += sweep; continue; }
    const ea = angle + sweep;
    const la = sweep > Math.PI ? 1 : 0;

    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
    const xi1 = cx + ir * Math.cos(ea), yi1 = cy + ir * Math.sin(ea);
    const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);

    const d = `M ${f2(x1)} ${f2(y1)} A ${f1(r)} ${f1(r)} 0 ${la} 1 ${f2(x2)} ${f2(y2)} L ${f2(xi1)} ${f2(yi1)} A ${f1(ir)} ${f1(ir)} 0 ${la} 0 ${f2(xi2)} ${f2(yi2)} Z`;
    out += `<path d="${d}" fill="${sl.color}" stroke="${backgroundColor}" stroke-width="2"/>`;

    if (showValues && sweep > 0.2) {
      const midA = angle + sweep / 2;
      const lr = (r + ir) / 2;
      const pct = ((sl.value / total) * 100).toFixed(0);
      out += `<text x="${f1(cx + lr * Math.cos(midA))}" y="${f1(cy + lr * Math.sin(midA) + fs * 0.35)}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" font-weight="600" opacity="0.95">${pct}%</text>`;
    }

    angle = ea;
  }

  if (style.showLegend && slices.length > 0) {
    const ly = H - legH + 7;
    const iW = 90;
    let lx = (W - slices.length * iW) / 2;
    for (const sl of slices) {
      out += `<rect x="${f1(lx)}" y="${ly}" width="10" height="10" fill="${sl.color}" rx="2"/>`;
      out += `<text x="${f1(lx + 14)}" y="${ly + 9}" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.85">${sl.name}</text>`;
      lx += iW;
    }
  }

  return svg(W, H, backgroundColor, out);
}

export function generateSvg(config: ChartConfig): string {
  switch (config.type) {
    case 'bar': return generateBarSvg(config);
    case 'bar-h': return generateBarHSvg(config);
    case 'line':
    case 'area': return generateLineSvg(config);
    case 'pie': return generatePieSvg(config);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────
function f1(n: number) { return n.toFixed(1); }
function f2(n: number) { return n.toFixed(2); }

function emptysvg(w: number, h: number, bg: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/></svg>`;
}

function svg(w: number, h: number, bg: string, inner: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
}

function axes(ml: number, mt: number, plotW: number, plotH: number, color: string) {
  return `<line x1="${ml}" y1="${mt}" x2="${ml}" y2="${f1(mt + plotH)}" stroke="${color}" stroke-width="1.5" opacity="0.7"/>` +
    `<line x1="${ml}" y1="${f1(mt + plotH)}" x2="${f1(ml + plotW)}" y2="${f1(mt + plotH)}" stroke="${color}" stroke-width="1.5" opacity="0.7"/>`;
}

function legend(config: ChartConfig, ml: number, W: number, H: number, legH: number, fs: number, textColor: string, fontFamily: string) {
  if (!config.style.showLegend || config.series.length < 2) return '';
  const ly = H - legH + 7;
  const iW = 90;
  let lx = ml + (W - ml - 16 - config.series.length * iW) / 2;
  let out = '';
  for (const s of config.series) {
    out += `<rect x="${f1(lx)}" y="${ly}" width="10" height="10" fill="${s.color}" rx="2"/>`;
    out += `<text x="${f1(lx + 14)}" y="${ly + 9}" fill="${textColor}" font-family="${fontFamily}" font-size="${fs}" opacity="0.85">${s.name}</text>`;
    lx += iW;
  }
  return out;
}
