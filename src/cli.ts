import * as fs from 'fs';
import * as path from 'path';
import { generateDiagramHTML } from './export/htmlExporter';
import { diagramTemplates } from './templates/diagrams';
import { getTheme } from './themes';
import { generateId } from './utils/id';
import { autoLayoutDiagram } from './utils/diagramLayout';
import type { Diagram } from './types/diagram';

const args = process.argv.slice(2);
const command = args[0];

function printUsage() {
  console.log(`
Slide Forge CLI — Diagram Generator

Befehle:
  generate <template-id> [--data <file.json>] [--out <output.html>] [--theme <id>] [--minify] [--embed]
    Erzeugt ein Diagramm als HTML-Datei

  list-templates
    Zeigt alle verfügbaren Vorlagen

  from-json <input.json> [--out <output.html>] [--minify] [--embed]
    Rendert ein vollständiges Diagramm aus einer JSON-Datei

Optionen:
  --theme <id>    Theme (default: cegtec). Verfügbar: midnight, clean, corporate, minimal, warm, cegtec
  --minify        Minified Output
  --embed         Webflow Embed-Mode (ohne <html>/<head>/<body>)
  --auto-layout   Automatisches Layout anwenden
  --out <file>    Output-Datei (default: stdout)
`);
}

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

if (!command || command === '--help' || command === '-h') {
  printUsage();
  process.exit(0);
}

if (command === 'list-templates') {
  console.log('\nVerfügbare Vorlagen:\n');
  for (const tpl of diagramTemplates) {
    console.log(`  ${tpl.icon} ${tpl.id.padEnd(20)} ${tpl.name} — ${tpl.description}`);
  }
  console.log('');
  process.exit(0);
}

if (command === 'generate') {
  const templateId = args[1];
  if (!templateId) {
    console.error('Fehler: Template-ID erforderlich. Nutze "list-templates" für verfügbare Vorlagen.');
    process.exit(1);
  }

  const template = diagramTemplates.find((t) => t.id === templateId);
  if (!template) {
    console.error(`Fehler: Template "${templateId}" nicht gefunden.`);
    process.exit(1);
  }

  const themeId = getArg('--theme') ?? 'cegtec';
  const theme = getTheme(themeId);
  const data = template.create(theme.colors);

  let diagram: Diagram = {
    ...data,
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Load custom data if provided
  const dataFile = getArg('--data');
  if (dataFile) {
    try {
      const json = fs.readFileSync(path.resolve(dataFile), 'utf-8');
      const custom = JSON.parse(json);
      diagram = { ...diagram, ...custom, id: diagram.id };
    } catch (err) {
      console.error(`Fehler beim Lesen von ${dataFile}:`, err);
      process.exit(1);
    }
  }

  if (hasFlag('--auto-layout')) {
    const result = autoLayoutDiagram(diagram.nodes, diagram.edges, diagram.diagramType);
    diagram.nodes = result.nodes;
    diagram.edges = result.edges;
  }

  const html = generateDiagramHTML(diagram, {
    minify: hasFlag('--minify'),
    standalone: !hasFlag('--embed'),
  });

  const outFile = getArg('--out');
  if (outFile) {
    fs.writeFileSync(path.resolve(outFile), html, 'utf-8');
    console.log(`✓ ${outFile} geschrieben (${html.length} Zeichen)`);
  } else {
    process.stdout.write(html);
  }

  process.exit(0);
}

if (command === 'from-json') {
  const inputFile = args[1];
  if (!inputFile) {
    console.error('Fehler: JSON-Datei erforderlich.');
    process.exit(1);
  }

  try {
    const json = fs.readFileSync(path.resolve(inputFile), 'utf-8');
    const diagram = JSON.parse(json) as Diagram;

    if (!diagram.nodes || !diagram.edges) {
      console.error('Fehler: Ungültige Diagram-JSON (nodes/edges fehlen).');
      process.exit(1);
    }

    if (hasFlag('--auto-layout')) {
      const result = autoLayoutDiagram(diagram.nodes, diagram.edges, diagram.diagramType);
      diagram.nodes = result.nodes;
      diagram.edges = result.edges;
    }

    const html = generateDiagramHTML(diagram, {
      minify: hasFlag('--minify'),
      standalone: !hasFlag('--embed'),
    });

    const outFile = getArg('--out');
    if (outFile) {
      fs.writeFileSync(path.resolve(outFile), html, 'utf-8');
      console.log(`✓ ${outFile} geschrieben (${html.length} Zeichen)`);
    } else {
      process.stdout.write(html);
    }
  } catch (err) {
    console.error(`Fehler:`, err);
    process.exit(1);
  }

  process.exit(0);
}

console.error(`Unbekannter Befehl: ${command}`);
printUsage();
process.exit(1);
