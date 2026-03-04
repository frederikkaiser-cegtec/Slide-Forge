import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
  PieChart, Pie,
} from 'recharts';
import type { ChartConfig } from '../../types/charts';

const BLUE = '#3B4BF9';
const PINK = '#E93BCD';
const COLORS = [BLUE, PINK, '#6875FF', '#FF6BE6', '#4BCCF9', '#F94B8A'];
const MUTED = 'rgba(240,240,255,0.3)';

interface Props {
  config: ChartConfig;
  width: number;
  height: number;
  scale: number;
}

export function BrandedChart({ config, width, height, scale }: Props) {
  if (config.type === 'none' || config.data.length === 0) return null;

  const fontSize = 10 * scale;
  const data = config.data.map((d) => ({ name: d.label, value: d.value }));

  return (
    <div style={{ width, height, position: 'relative' }}>
      {config.title && (
        <div style={{
          fontSize: 11 * scale, color: 'rgba(240,240,255,0.5)',
          fontWeight: 600, marginBottom: 8 * scale,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {config.title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={config.title ? '85%' : '100%'}>
        {config.type === 'bar' ? (
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fill: MUTED, fontSize }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize }} axisLine={false} tickLine={false} width={35 * scale} />
            <Tooltip
              contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize }}
              itemStyle={{ color: '#f0f0ff' }}
              labelStyle={{ color: 'rgba(240,240,255,0.6)' }}
            />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity={1} />
                <stop offset="100%" stopColor={BLUE} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Bar dataKey="value" radius={[6 * scale, 6 * scale, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        ) : config.type === 'line' ? (
          <LineChart data={data}>
            <XAxis dataKey="name" tick={{ fill: MUTED, fontSize }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize }} axisLine={false} tickLine={false} width={35 * scale} />
            <Tooltip
              contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize }}
              itemStyle={{ color: '#f0f0ff' }}
              labelStyle={{ color: 'rgba(240,240,255,0.6)' }}
            />
            <Line
              type="monotone" dataKey="value"
              stroke={BLUE} strokeWidth={3 * scale}
              dot={{ fill: PINK, r: 4 * scale, strokeWidth: 0 }}
              activeDot={{ fill: PINK, r: 6 * scale, strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        ) : config.type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity={0.4} />
                <stop offset="100%" stopColor={BLUE} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: MUTED, fontSize }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize }} axisLine={false} tickLine={false} width={35 * scale} />
            <Tooltip
              contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize }}
              itemStyle={{ color: '#f0f0ff' }}
              labelStyle={{ color: 'rgba(240,240,255,0.6)' }}
            />
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
            <Tooltip
              contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize }}
              itemStyle={{ color: '#f0f0ff' }}
              labelStyle={{ color: 'rgba(240,240,255,0.6)' }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
