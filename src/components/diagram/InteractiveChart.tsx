import { useMemo } from 'react';
import { generateSvgChart } from '../../utils/svgCharts';
import type { SvgChartOptions } from '../../utils/svgCharts';

interface Props {
  options: SvgChartOptions;
  className?: string;
}

export function InteractiveChart({ options, className }: Props) {
  const svgHtml = useMemo(() => generateSvgChart(options), [options]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
