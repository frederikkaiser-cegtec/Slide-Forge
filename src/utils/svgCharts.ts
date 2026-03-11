export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface SvgChartOptions {
  type: 'bar' | 'line' | 'area' | 'donut';
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  bgColor?: string;
  animated?: boolean;
  title?: string;
}

const DEFAULT_COLORS = ['#3B4BF9', '#E93BCD', '#22c55e', '#f59e0b', '#06b6d4', '#8b5cf6'];

export function generateSvgChart(opts: SvgChartOptions): string {
  const { type, data, width = 400, height = 250 } = opts;

  switch (type) {
    case 'bar':
      return barChart(data, width, height, opts);
    case 'line':
      return lineChart(data, width, height, opts);
    case 'area':
      return areaChart(data, width, height, opts);
    case 'donut':
      return donutChart(data, width, height, opts);
    default:
      return '';
  }
}

function barChart(data: ChartDataPoint[], w: number, h: number, opts: SvgChartOptions): string {
  const pad = { top: 30, right: 20, bottom: 40, left: 20 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length * 0.4;
  const textColor = opts.textColor ?? '#a0a0c0';
  const anim = opts.animated ? `<style>
    .sf-bar { animation: sf-grow 0.8s ease-out forwards; transform-origin: bottom; transform: scaleY(0); }
    @keyframes sf-grow { to { transform: scaleY(1); } }
  </style>` : '';

  const bars = data.map((d, i) => {
    const barH = (d.value / maxVal) * chartH;
    const x = pad.left + i * (barW + gap) + gap / 2;
    const y = pad.top + chartH - barH;
    const color = d.color ?? opts.primaryColor ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
    const delay = opts.animated ? `animation-delay:${i * 0.1}s;` : '';
    return `<rect class="sf-bar" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${color}" style="${delay}">
      <title>${d.label}: ${d.value}</title>
    </rect>
    <text x="${x + barW / 2}" y="${h - 10}" text-anchor="middle" fill="${textColor}" font-size="10" font-family="Inter,sans-serif">${d.label}</text>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${anim}
${opts.title ? `<text x="${w / 2}" y="18" text-anchor="middle" fill="${textColor}" font-size="12" font-weight="600" font-family="Inter,sans-serif">${opts.title}</text>` : ''}
${bars}
</svg>`;
}

function lineChart(data: ChartDataPoint[], w: number, h: number, opts: SvgChartOptions): string {
  const pad = { top: 30, right: 20, bottom: 40, left: 20 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const color = opts.primaryColor ?? '#3B4BF9';
  const textColor = opts.textColor ?? '#a0a0c0';

  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: pad.top + chartH - (d.value / maxVal) * chartH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const totalLen = points.reduce((acc, p, i) => {
    if (i === 0) return 0;
    return acc + Math.sqrt((p.x - points[i - 1].x) ** 2 + (p.y - points[i - 1].y) ** 2);
  }, 0);

  const anim = opts.animated ? `<style>
    .sf-line { stroke-dasharray: ${totalLen}; stroke-dashoffset: ${totalLen}; animation: sf-draw 1.5s ease forwards; }
    @keyframes sf-draw { to { stroke-dashoffset: 0; } }
  </style>` : '';

  const dots = points.map((p, i) =>
    `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="${opts.bgColor ?? '#111133'}" stroke-width="2"><title>${data[i].label}: ${data[i].value}</title></circle>`
  ).join('\n');

  const labels = data.map((d, i) =>
    `<text x="${points[i].x}" y="${h - 10}" text-anchor="middle" fill="${textColor}" font-size="10" font-family="Inter,sans-serif">${d.label}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${anim}
${opts.title ? `<text x="${w / 2}" y="18" text-anchor="middle" fill="${textColor}" font-size="12" font-weight="600" font-family="Inter,sans-serif">${opts.title}</text>` : ''}
<path class="sf-line" d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
${dots}
${labels}
</svg>`;
}

function areaChart(data: ChartDataPoint[], w: number, h: number, opts: SvgChartOptions): string {
  const pad = { top: 30, right: 20, bottom: 40, left: 20 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const color = opts.primaryColor ?? '#3B4BF9';
  const textColor = opts.textColor ?? '#a0a0c0';

  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: pad.top + chartH - (d.value / maxVal) * chartH,
  }));

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${lineD} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`;

  const gradId = 'sf-area-grad';
  const labels = data.map((d, i) =>
    `<text x="${points[i].x}" y="${h - 10}" text-anchor="middle" fill="${textColor}" font-size="10" font-family="Inter,sans-serif">${d.label}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
  <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
  </linearGradient>
</defs>
${opts.title ? `<text x="${w / 2}" y="18" text-anchor="middle" fill="${textColor}" font-size="12" font-weight="600" font-family="Inter,sans-serif">${opts.title}</text>` : ''}
<path d="${areaD}" fill="url(#${gradId})"/>
<path d="${lineD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
${labels}
</svg>`;
}

function donutChart(data: ChartDataPoint[], w: number, h: number, opts: SvgChartOptions): string {
  const cx = w / 2;
  const cy = h / 2 + 10;
  const r = Math.min(w, h) * 0.32;
  const inner = r * 0.6;
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const textColor = opts.textColor ?? '#a0a0c0';

  let angle = -90;
  const paths = data.map((d, i) => {
    const pct = d.value / total;
    const startAngle = angle;
    const endAngle = angle + pct * 360;
    angle = endAngle;
    const color = d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
    return arcPath(cx, cy, r, inner, startAngle, endAngle, color, d.label, d.value);
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${opts.title ? `<text x="${w / 2}" y="18" text-anchor="middle" fill="${textColor}" font-size="12" font-weight="600" font-family="Inter,sans-serif">${opts.title}</text>` : ''}
${paths}
<text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="${textColor}" font-size="18" font-weight="700" font-family="Inter,sans-serif">${total}</text>
</svg>`;
}

function arcPath(cx: number, cy: number, outer: number, inner: number, startDeg: number, endDeg: number, color: string, label: string, value: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const s1 = toRad(startDeg);
  const e1 = toRad(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;

  const x1 = cx + outer * Math.cos(s1);
  const y1 = cy + outer * Math.sin(s1);
  const x2 = cx + outer * Math.cos(e1);
  const y2 = cy + outer * Math.sin(e1);
  const x3 = cx + inner * Math.cos(e1);
  const y3 = cy + inner * Math.sin(e1);
  const x4 = cx + inner * Math.cos(s1);
  const y4 = cy + inner * Math.sin(s1);

  return `<path d="M ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z" fill="${color}" opacity="0.85">
    <title>${label}: ${value}</title>
  </path>`;
}
