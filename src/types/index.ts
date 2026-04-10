export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'svg';
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string; // HTML for text, URL for image
  style: ElementStyle;
  locked?: boolean;
}

export interface ElementStyle {
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  filter?: string;
}

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
  templateId?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textMuted: string;
    accent: string;
  };
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  themeId: string;
  formatId: string;
  createdAt: number;
  updatedAt: number;
}

export type TemplateId =
  | 'title'
  | 'content'
  | 'two-column'
  | 'quote'
  | 'image-text'
  | 'full-image'
  | 'metrics'
  | 'section-break'
  | 'closing';

export interface Template {
  id: TemplateId;
  name: string;
  icon: string;
  create: (theme: Theme) => Slide;
}
