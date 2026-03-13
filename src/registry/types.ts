import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export interface GraphicDefinition<TData = any> {
  id: string;
  label: string;
  icon: LucideIcon;
  defaultData: TData;
  defaultFormat: string;
  forceFormat?: boolean;
  getDisplayName: (data: TData) => string;
  FormComponent: ComponentType<{ data: TData; onChange: (d: TData) => void }>;
  GraphicComponent: ComponentType<{ data: TData; width: number; height: number }>;
  syncGroup?: string;
  extractCore?: (data: TData) => any;
  applyCore?: (core: any, current: TData) => TData;
}
