import { memo } from 'react';
import { getDefinition } from '../../registry';
import { getFormat } from '../../utils/formats';

/**
 * Live-rendered thumbnail of a graphic template.
 *
 * Renders the actual GraphicComponent at its native size, then scales the
 * whole thing down with CSS transform to fit the requested display width.
 * The wrapper absorbs the post-scale dimensions so surrounding flex/grid
 * layouts see the correct size (a raw transform doesn't affect layout box).
 */
export const GraphicPreview = memo(function GraphicPreview({
  graphicType,
  formatId,
  data,
  width,
}: {
  graphicType: string;
  formatId?: string;
  data?: unknown;
  /** Display width in px. Height is derived from aspect ratio. */
  width: number;
}) {
  const def = getDefinition(graphicType);
  const format = getFormat(formatId ?? def.defaultFormat);
  const scale = width / format.width;
  const height = Math.round(format.height * scale);
  const GraphicComponent = def.GraphicComponent;
  const renderData = (data ?? def.defaultData) as any;

  return (
    <div
      style={{ width, height, overflow: 'hidden', position: 'relative' }}
      // Make it explicit that this is just a preview; screen readers don't
      // need to announce every data point inside the rendered component.
      aria-hidden="true"
    >
      <div
        style={{
          width: format.width,
          height: format.height,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <GraphicComponent data={renderData} width={format.width} height={format.height} />
      </div>
    </div>
  );
});
