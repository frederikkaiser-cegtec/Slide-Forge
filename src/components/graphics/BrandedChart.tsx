import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
  PieChart, Pie,
} from 'recharts';
import type { ChartConfig } from '../../types/charts';
import { isDark } from '../../utils/cegtecTheme';

const DEFAULT_COLORS = ['#3B4BF9', '#E93BCD', '#6875FF', '#FF6BE6', '#4BCCF9', '#F94B8A'];

interface Props {
  config: ChartConfig;
  width: number;
  height: number;
  scale: number;
  /** Pass the background color so chart adapts to light/dark */
  bgColor?: string;
  accentColor?: string;
  accentColor2?: string;
}

export function BrandedChart({ config, width, height, scale, bgColor, accentColor, accentColor2 }: Props) {
  if (config.type === 'none' || config.data.length === 0) return null;

  const dark = bgColor ? isDark(bgColor) : true;
  const BLUE = accentColor || '#3B4BF9';
  const PINK = accentColor2 || '#E93BCD';
  const COLORS = [BLUE, PINK, ...DEFAULT_COLORS.slice(2)];

  // Theme-aware colors
  const axisColor = dark ? 'rgba(240,240,255,0.3)' : 'rgba(0,0,0,0.35)';
  const tooltipBg = dark ? '#1a1a44' : '#ffffff';
  const tooltipBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const tooltipText = dark ? '#f0f0ff' : '#1a1a2e';
  const tooltipLabel = dark ? 'rgba(240,240,255,0.6)' : 'rgba(0,0,0,0.5)';
  const titleColor = dark ? 'rgba(240,240,255,0.5)' : 'rgba(0,0,0,0.45)';
  const gradientEnd = dark ? 0.02 : 0.05;

  const fontSize = 10 * scale;
  const data = config.data.map((d) => ({ name: d.label, value: d.value }));

  const tooltipStyle = {
    contentStyle: {
      background: tooltipBg,
      border: `1px solid ${tooltipBorder}`,
      borderRadius: 8,
      fontSize,
      boxShadow: dark ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
    },
    itemStyle: { color: tooltipText },
    labelStyle: { color: tooltipLabel },
  };

  return (
    <div style={{ width, height, position: 'relative' }}>
      {config.title && (
        <div style={{
          fontSize: 11 * scale, color: titleColor,
          fontWeight: 600, marginBottom: 8 * scale,
          textTransform: 'uppercase' as const, letterSpacing: 1,
        }}>
          {config.title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={config.title ? '85%' : '100%'}>
        {config.type === 'bar' ? (
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fill: axisColor, fontSize }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize }} axisLine={false} tickLine={false} width={35 * scale} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" radius={[6 * scale, 6 * scale, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        ) : config.type === 'line' ? (
          <LineChart data={data}>
            <XAxis dataKey="name" tick={{ fill: axisColor, fontSize }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize }} axisLine={false} tickLine={false} width={35 * scale} />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone" dataKey="value"
              stroke={BLUE} strokeWidth={3 * scale}
              dot={{ fill: PINK, r: 4 * scale, strokeWidth: 0 }}
              activeDot={{ fill: PINK, r: 6 * scale, strokeWidth: 2, stroke: dark ? '#fff' : '#000' }}
            />
          </LineChart>
        ) : config.type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity={0.4} />
                <stop offset="100%" stopColor={BLUE} stopOpacity={gradientEnd} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: axisColor, fontSize }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize }} axisLine={false} tickLine={false} width={35 * scale} />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone" dataKey="value"
              stroke={BLUE} strokeWidth={2.5 * scale}
              fill="url(#areaGrad)"
              dot={{ fill: PINK, r: 3 * scale, strokeWidth: 0 }}
            />
          </AreaChart>
        ) : (
          <PieChart>
            <Pie
              data={data} dataKey="value" nameKey="name"
              cx="50%" cy="50%"
              innerRadius="55%" outerRadius="80%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
