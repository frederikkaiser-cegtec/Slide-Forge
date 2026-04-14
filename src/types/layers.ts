export interface BaseLayer {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  color: string;
  content: string;
}

export interface SvgLayer extends BaseLayer {
  type: 'svg';
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
}

export type Layer = SvgLayer | TextLayer;

export function createSvgLayer(svg: string, x = 40, y = 40): SvgLayer {
  // Use native SVG dimensions if present and reasonable, else 240×180
  const wm = svg.match(/\bwidth="(\d+(?:\.\d+)?)"/);
  const hm = svg.match(/\bheight="(\d+(?:\.\d+)?)"/);
  const nw = wm ? parseFloat(wm[1]) : 0;
  const nh = hm ? parseFloat(hm[1]) : 0;
  const width = nw >= 50 && nw <= 1800 ? nw : 240;
  const height = nh >= 50 && nh <= 1800 ? nh : 180;
  return { id: crypto.randomUUID(), type: 'svg', x, y, width, height, rotation: 0, opacity: 100, color: '#ffffff', content: svg };
}

export function createTextLayer(): TextLayer {
  return {
    id: crypto.randomUUID(), type: 'text', x: 60, y: 60, width: 320, height: 80,
    rotation: 0, opacity: 100, color: '#ffffff', content: 'Text hier',
    fontSize: 36, fontWeight: 'bold', fontFamily: 'Plus Jakarta Sans', textAlign: 'left',
  };
}
