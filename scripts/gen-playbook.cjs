const fs = require('fs');
const template = JSON.parse(fs.readFileSync('src/data/outbound-stack.json', 'utf8'));
const pb = JSON.parse(JSON.stringify(template));
pb.id = 'data-playbook-v1';
pb.title = 'Dein CRM wei\u00df was funktioniert';

const replacements = {
  // Slide 1 - Cover
  's01-meta': '<p>INDIGO \u00b7 CegTec Academy</p>',
  's01-head': '<h1>Dein CRM wei\u00df bereits, was funktioniert. Du fragst nur nicht.</h1>',
  's01-sub': '<p>Claude + HubSpot MCP.<br/><br/>Von CRM-Daten zum fertigen Playbook in 2 Stunden.</p>',
  's01-tools': '<p>Audit \u2192 Win/Loss \u2192 ICP \u2192 Messaging \u2192 Playbook</p>',

  // Slide 2 - Problem
  's02-head': '<h1>Playbooks auf Basis von Bauchgef\u00fchl.</h1>',
  's02-b1': '<p>"Unsere ICP sind Mittelst\u00e4ndler"</p>',
  's02-b1p': '<p>Nie gepr\u00fcft</p>',
  's02-b2': '<p>"LinkedIn ist unser bester Kanal"</p>',
  's02-b2p': '<p>Gef\u00fchl, keine Daten</p>',
  's02-b3': '<p>"Unsere Value Prop ist klar"</p>',
  's02-b3p': '<p>Keiner liest Deal Notes</p>',
  's02-b4': '<p>"Wir machen alles richtig"</p>',
  's02-b4p': '<p>60% sterben in Stage 2</p>',
  's02-punch': '<p>Im CRM liegen hunderte Datenpunkte. Niemand fragt.</p>',
  's02-next': '<p>Die L\u00f6sung \u2192</p>',

  // Slide 3 - Stack
  's03-head': '<h1>5 Schritte. 2 Stunden. 1 Playbook.</h1>',
  's03-node1-name': '<p><strong>CRM Audit</strong></p>',
  's03-node1-desc': '<p>Datenqualit\u00e4t pr\u00fcfen, Readiness Score</p>',
  's03-node1-price': '<p>20 Min</p>',
  's03-node2-name': '<p><strong>Win/Loss Analyse</strong></p>',
  's03-node2-desc': '<p>Muster in Won vs. Lost Deals finden</p>',
  's03-node2-price': '<p>25 Min</p>',
  's03-node3-name': '<p><strong>ICP Extraktion</strong></p>',
  's03-node3-desc': '<p>Idealprofil aus echten Conversions</p>',
  's03-node3-price': '<p>20 Min</p>',
  's03-node4-name': '<p><strong>Messaging + Assembly</strong></p>',
  's03-node4-desc': '<p>Angles, Sequenzen, fertiges Playbook</p>',
  's03-node4-price': '<p>55 Min</p>',
  's03-total-val': '<p>~2 Stunden</p>',
  's03-total-vs': '<p>vs. 3\u20134 Wochen manuell</p>',
  's03-next': '<p>Ergebnisse \u2192</p>',

  // Slide 4 - Results
  's04-section': '<p>Typische Erkenntnisse</p>',
  's04-head': '<h1>Was Teams entdecken, wenn sie ihre Daten auswerten.</h1>',
  's04-bar1': '<p>Beste Branche war nicht die fokussierte</p>',
  's04-bar1v': '<p>Win Rate</p>',
  's04-bar2': '<p>Cold Email schl\u00e4gt LinkedIn bei Segment X</p>',
  's04-bar2v': '<p>Kanal-Mix</p>',
  's04-bar3': '<p>Mid-Market: 4x Deal Size, l\u00e4ngerer Cycle</p>',
  's04-bar3v': '<p>Trade-off</p>',
  's04-bar4': '<p>Playbook in Stunden statt Wochen</p>',
  's04-bar4v': '<p>Speed</p>',
  's04-time-label': '<p>VORAUSSETZUNG</p>',
  's04-time-val': '<p>50+ Deals</p>',
  's04-time-sub': '<p>Won + Lost, letzte 12 Monate</p>',
  's04-first-label': '<p>TOOLS</p>',
  's04-first-val': '<p>Claude + MCP</p>',
  's04-first-sub': '<p>HubSpot Connector, 5 Min Setup</p>',
  's04-next': '<p>Vorher / Nachher \u2192</p>',

  // Slide 5 - Compare
  's05-head': '<h1>Bauchgef\u00fchl vs. Daten.</h1>',
  's05-th-left': '<p>DATENBASIERT</p>',
  's05-th-right': '<p>BAUCHGEF\u00dcHL</p>',
  's05-r1l-label': '<p>ICP Definition</p>',
  's05-r1l': '<p>Win Rate + Deal Size</p>',
  's05-r1r': '<p>"War schon immer so"</p>',
  's05-r2l-label': '<p>Kanal-Strategie</p>',
  's05-r2l': '<p>First-Touch Attribution</p>',
  's05-r2r': '<p>Pers\u00f6nliche Vorliebe</p>',
  's05-r3l-label': '<p>Messaging</p>',
  's05-r3l': '<p>Won-Deal Patterns</p>',
  's05-r3r': '<p>Generisch an alle</p>',
  's05-r4l-label': '<p>Playbook</p>',
  's05-r4l': '<p>Schriftlich, teilbar</p>',
  's05-r4r': '<p>Im Kopf des Sales Leads</p>',
  's05-next': '<p>Next Level \u2192</p>',

  // Slide 6 - Next Level
  's06-section': '<p>Vom Dokument zur Execution</p>',
  's06-head': '<h1>Ein Playbook allein generiert keine Pipeline.</h1>',
  's06-r1': '<p>ICP-Definition wird zu automatischen Suchfiltern</p>',
  's06-r2': '<p>Messaging Framework wird zu personalisierten E-Mails</p>',
  's06-r3': '<p>Kanal-Mix wird zu Multi-Channel Sequenzen</p>',
  's06-r4': '<p>Qualifizierungskriterien werden zu Lead Scoring</p>',
  's06-r5': '<p>Reply Rates optimieren das Playbook automatisch</p>',
  's06-r6': '<p>Von Wochen Analyse zu Stunden Setup</p>',
  's06-r7': '<p>Daten \u2192 Playbook \u2192 Outbound \u2192 Pipeline</p>',
  's06-disclaimer': '<p>Der n\u00e4chste Schritt: automatisierte Execution mit CegTec.</p>',
  's06-next': '<p>N\u00e4chster Schritt \u2192</p>',

  // Slide 7 - CTA
  's07-head': '<h1>Datenbasiertes Playbook in 2 Stunden.</h1>',
  's07-a-head': '<p>Selbst machen</p>',
  's07-a-body': '<p>Claude + HubSpot MCP.<br/>5 Prompts, fertig.</p>',
  's07-b-head': '<p>Machen lassen</p>',
  's07-b-body': '<p>Wir bauen dein Playbook<br/>und setzen es direkt um.</p>',
  's07-p1-label': '<p>PLAYBOOK</p>',
  's07-p1-val': '<p>1.900\u20ac</p>',
  's07-p2-label': '<p>MIT EXECUTION</p>',
  's07-p2-val': '<p>ab 3.900\u20ac</p>',
  's07-p3': '<p>Playbook + Outbound Setup.<br/>In einer Woche live.</p>',
  's07-url': '<p>cegtec.net/academy</p>',
};

for (const slide of pb.slides) {
  for (const el of slide.elements) {
    if (replacements[el.id] && el.type === 'text') {
      el.content = replacements[el.id];
    }
  }
}

fs.writeFileSync('src/data/data-playbook.json', JSON.stringify(pb, null, 2));
console.log('Done: ' + pb.slides.length + ' slides');
