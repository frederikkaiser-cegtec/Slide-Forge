import type { Slide, SlideElement, Theme, Template, TemplateId } from '../types';
import { generateId } from '../utils/id';

function el(partial: Partial<SlideElement> & Pick<SlideElement, 'type' | 'x' | 'y' | 'width' | 'height' | 'content'>): SlideElement {
  return {
    id: generateId(),
    rotation: 0,
    style: {},
    ...partial,
  };
}

function makeSlide(elements: SlideElement[], bg: string, templateId: TemplateId): Slide {
  return { id: generateId(), elements, background: bg, templateId };
}

export const templates: Template[] = [
  {
    id: 'title',
    name: 'Title Slide',
    icon: 'Presentation',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 10, y: 30, width: 80, height: 20,
            content: '<h1>Your Presentation Title</h1>',
            style: { fontSize: 64, fontWeight: 800, color: theme.colors.text, textAlign: 'center' },
          }),
          el({
            type: 'text',
            x: 20, y: 55, width: 60, height: 10,
            content: '<p>Subtitle or tagline goes here</p>',
            style: { fontSize: 28, fontWeight: 400, color: theme.colors.textMuted, textAlign: 'center' },
          }),
          el({
            type: 'text',
            x: 30, y: 80, width: 40, height: 6,
            content: '<p>Presenter Name &bull; Date</p>',
            style: { fontSize: 18, color: theme.colors.textMuted, textAlign: 'center' },
          }),
        ],
        theme.colors.background,
        'title'
      ),
  },
  {
    id: 'content',
    name: 'Content',
    icon: 'FileText',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 8, y: 8, width: 84, height: 12,
            content: '<h2>Section Title</h2>',
            style: { fontSize: 44, fontWeight: 700, color: theme.colors.text },
          }),
          el({
            type: 'text',
            x: 8, y: 25, width: 84, height: 65,
            content: '<p>Add your content here. Use bullet points, paragraphs, or any text formatting to present your ideas clearly.</p>',
            style: { fontSize: 24, color: theme.colors.text, textAlign: 'left' },
          }),
        ],
        theme.colors.background,
        'content'
      ),
  },
  {
    id: 'two-column',
    name: 'Two Columns',
    icon: 'Columns2',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 8, y: 8, width: 84, height: 12,
            content: '<h2>Two Column Layout</h2>',
            style: { fontSize: 44, fontWeight: 700, color: theme.colors.text },
          }),
          el({
            type: 'text',
            x: 8, y: 25, width: 40, height: 65,
            content: '<p><strong>Left Column</strong></p><p>Content for the left side of your slide.</p>',
            style: { fontSize: 22, color: theme.colors.text },
          }),
          el({
            type: 'text',
            x: 52, y: 25, width: 40, height: 65,
            content: '<p><strong>Right Column</strong></p><p>Content for the right side of your slide.</p>',
            style: { fontSize: 22, color: theme.colors.text },
          }),
        ],
        theme.colors.background,
        'two-column'
      ),
  },
  {
    id: 'quote',
    name: 'Quote',
    icon: 'Quote',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 10, y: 8, width: 10, height: 20,
            content: '<h1>"</h1>',
            style: { fontSize: 120, fontWeight: 800, color: theme.colors.primary },
          }),
          el({
            type: 'text',
            x: 12, y: 30, width: 76, height: 35,
            content: '<p>The best way to predict the future is to create it.</p>',
            style: { fontSize: 40, fontWeight: 500, color: theme.colors.text, textAlign: 'left' },
          }),
          el({
            type: 'text',
            x: 12, y: 72, width: 76, height: 10,
            content: '<p>— Peter Drucker</p>',
            style: { fontSize: 24, color: theme.colors.textMuted },
          }),
        ],
        theme.colors.background,
        'quote'
      ),
  },
  {
    id: 'image-text',
    name: 'Image + Text',
    icon: 'ImageIcon',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'shape',
            x: 0, y: 0, width: 50, height: 100,
            content: '',
            style: { backgroundColor: theme.colors.surface, borderRadius: 0 },
          }),
          el({
            type: 'text',
            x: 55, y: 15, width: 40, height: 15,
            content: '<h2>Visual Story</h2>',
            style: { fontSize: 40, fontWeight: 700, color: theme.colors.text },
          }),
          el({
            type: 'text',
            x: 55, y: 35, width: 40, height: 50,
            content: '<p>Pair your visuals with compelling text. Drop an image on the left panel to create an engaging layout.</p>',
            style: { fontSize: 22, color: theme.colors.textMuted },
          }),
        ],
        theme.colors.background,
        'image-text'
      ),
  },
  {
    id: 'full-image',
    name: 'Full Image',
    icon: 'Image',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'shape',
            x: 0, y: 0, width: 100, height: 100,
            content: '',
            style: { backgroundColor: theme.colors.surface },
          }),
          el({
            type: 'text',
            x: 8, y: 75, width: 84, height: 15,
            content: '<h2>Full Bleed Image</h2>',
            style: { fontSize: 40, fontWeight: 700, color: '#ffffff', textAlign: 'center' },
          }),
        ],
        theme.colors.background,
        'full-image'
      ),
  },
  {
    id: 'metrics',
    name: 'Metrics',
    icon: 'BarChart3',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 8, y: 8, width: 84, height: 12,
            content: '<h2>Key Metrics</h2>',
            style: { fontSize: 44, fontWeight: 700, color: theme.colors.text },
          }),
          el({
            type: 'text',
            x: 5, y: 30, width: 27, height: 35,
            content: '<h1>10K+</h1><p>Active Users</p>',
            style: { fontSize: 24, fontWeight: 700, color: theme.colors.primary, textAlign: 'center' },
          }),
          el({
            type: 'text',
            x: 36, y: 30, width: 27, height: 35,
            content: '<h1>98%</h1><p>Satisfaction</p>',
            style: { fontSize: 24, fontWeight: 700, color: theme.colors.primary, textAlign: 'center' },
          }),
          el({
            type: 'text',
            x: 67, y: 30, width: 27, height: 35,
            content: '<h1>$2M</h1><p>Revenue</p>',
            style: { fontSize: 24, fontWeight: 700, color: theme.colors.primary, textAlign: 'center' },
          }),
        ],
        theme.colors.background,
        'metrics'
      ),
  },
  {
    id: 'section-break',
    name: 'Section Break',
    icon: 'Minus',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 10, y: 35, width: 80, height: 30,
            content: '<h1>New Section</h1>',
            style: { fontSize: 72, fontWeight: 800, color: theme.colors.text, textAlign: 'center' },
          }),
          el({
            type: 'shape',
            x: 40, y: 68, width: 20, height: 0.5,
            content: '',
            style: { backgroundColor: theme.colors.primary },
          }),
        ],
        theme.colors.background,
        'section-break'
      ),
  },
  {
    id: 'closing',
    name: 'Closing',
    icon: 'Heart',
    create: (theme) =>
      makeSlide(
        [
          el({
            type: 'text',
            x: 10, y: 30, width: 80, height: 20,
            content: '<h1>Thank You</h1>',
            style: { fontSize: 72, fontWeight: 800, color: theme.colors.text, textAlign: 'center' },
          }),
          el({
            type: 'text',
            x: 20, y: 55, width: 60, height: 10,
            content: '<p>Questions? Let\'s connect.</p>',
            style: { fontSize: 28, color: theme.colors.textMuted, textAlign: 'center' },
          }),
          el({
            type: 'text',
            x: 25, y: 75, width: 50, height: 8,
            content: '<p>email@example.com</p>',
            style: { fontSize: 20, color: theme.colors.primary, textAlign: 'center' },
          }),
        ],
        theme.colors.background,
        'closing'
      ),
  },
];

export function getTemplate(id: TemplateId): Template {
  return templates.find((t) => t.id === id)!;
}
