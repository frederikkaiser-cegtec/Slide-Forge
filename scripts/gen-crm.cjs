const fs = require('fs');
const template = JSON.parse(fs.readFileSync('src/data/outbound-stack.json', 'utf8'));
const crm = JSON.parse(JSON.stringify(template));
crm.id = 'crm-audit-v1';
crm.title = 'Dein CRM lügt';

const replacements = {
  // Slide 1 - Cover
  's01-meta': '<p>INDIGO \u00b7 CegTec Brand</p>',
  's01-head': '<h1>Dein CRM l\u00fcgt. 40% deiner Kontakte sind M\u00fcll.</h1>',
  's01-sub': '<p>Claude Code + HubSpot MCP.<br/><br/>Kein CSV-Export. Kein manuelles Aufr\u00e4umen.</p>',
  's01-tools': '<p>Audit \u2192 Duplikate \u2192 Anreichern \u2192 Archivieren \u2192 Automatisieren</p>',

  // Slide 2 - Problem
  's02-head': '<h1>Dein Vertrieb arbeitet mit falschen Daten.</h1>',
  's02-b1': '<p>Duplikate</p>',
  's02-b1p': '<p>15\u201330% aller Kontakte</p>',
  's02-b2': '<p>Veraltete E-Mails</p>',
  's02-b2p': '<p>20\u201340% Bounce</p>',
  's02-b3': '<p>Fehlende Felder</p>',
  's02-b3p': '<p>Branche, Gr\u00f6\u00dfe, Rolle</p>',
  's02-b4': '<p>Kein Scoring</p>',
  's02-b4p': '<p>0% priorisiert</p>',
  's02-punch': '<p>Und keiner merkt es, bis die Pipeline leer ist.</p>',
  's02-next': '<p>Die L\u00f6sung \u2192</p>',

  // Slide 3 - Stack
  's03-head': '<h1>1 Prompt. Dein ganzes CRM.</h1>',
  's03-node1-name': '<p><strong>Claude Code</strong></p>',
  's03-node1-desc': '<p>Steuert den gesamten Prozess</p>',
  's03-node1-price': '<p>~$20/Mo</p>',
  's03-node2-name': '<p><strong>HubSpot MCP</strong></p>',
  's03-node2-desc': '<p>Direkter CRM-Zugriff, kein Export</p>',
  's03-node2-price': '<p>$0</p>',
  's03-node3-name': '<p><strong>FullEnrich</strong></p>',
  's03-node3-desc': '<p>Fehlende E-Mails + Telefon</p>',
  's03-node3-price': '<p>$29/Mo</p>',
  's03-node4-name': '<p><strong>CegTec Agent</strong></p>',
  's03-node4-desc': '<p>Research + Scoring Automation</p>',
  's03-node4-price': '<p>custom</p>',
  's03-total-val': '<p>~50\u20ac/Monat</p>',
  's03-total-vs': '<p>vs. Agentur 2.000\u20ac+</p>',
  's03-next': '<p>Der Prozess \u2192</p>',

  // Slide 4 - Process
  's04-section': '<p>Der Prozess</p>',
  's04-head': '<h1>5 Schritte zum sauberen CRM.</h1>',
  's04-bar1': '<p>Audit \u2014 Datenqualit\u00e4t messen</p>',
  's04-bar1v': '<p>Schritt 1</p>',
  's04-bar2': '<p>Duplikate finden + mergen</p>',
  's04-bar2v': '<p>Schritt 2</p>',
  's04-bar3': '<p>Fehlende Daten anreichern</p>',
  's04-bar3v': '<p>Schritt 3</p>',
  's04-bar4': '<p>Karteileichen archivieren</p>',
  's04-bar4v': '<p>Schritt 4</p>',
  's04-time-label': '<p>DAUER</p>',
  's04-time-val': '<p>2\u20134 Std</p>',
  's04-time-sub': '<p>f\u00fcr 10.000 Kontakte</p>',
  's04-first-label': '<p>ERGEBNIS</p>',
  's04-first-val': '<p>-40% M\u00fcll</p>',
  's04-first-sub': '<p>saubere Pipeline ab Tag 1</p>',
  's04-next': '<p>Vorher / Nachher \u2192</p>',

  // Slide 5 - Compare
  's05-head': '<h1>Gleiches CRM. Andere Datenqualit\u00e4t.</h1>',
  's05-th-left': '<p>NACH AUDIT</p>',
  's05-th-right': '<p>VORHER</p>',
  's05-r1l-label': '<p>Duplikate</p>',
  's05-r1l': '<p>< 2%</p>',
  's05-r1r': '<p>15\u201330%</p>',
  's05-r2l-label': '<p>E-Mail Bounce</p>',
  's05-r2l': '<p>< 3%</p>',
  's05-r2r': '<p>20\u201340%</p>',
  's05-r3l-label': '<p>Enrichment</p>',
  's05-r3l': '<p>85%+ vollst\u00e4ndig</p>',
  's05-r3r': '<p>40\u201360%</p>',
  's05-r4l-label': '<p>Lead Scoring</p>',
  's05-r4l': '<p>Automatisch</p>',
  's05-r4r': '<p>Nicht vorhanden</p>',
  's05-next': '<p>Warum jetzt \u2192</p>',

  // Slide 6 - Why now
  's06-section': '<p>Warum jetzt</p>',
  's06-head': '<h1>Jeder Tag mit schlechten Daten kostet dich Deals.</h1>',
  's06-r1': '<p>Falsche E-Mails = verbrannte Sender-Reputation</p>',
  's06-r2': '<p>Duplikate = doppelte Ansprache = genervte Prospects</p>',
  's06-r3': '<p>Fehlende Daten = kein Scoring = keine Priorisierung</p>',
  's06-r4': '<p>Veraltete Kontakte = aufgebl\u00e4hte CRM-Kosten</p>',
  's06-r5': '<p>Kein Enrichment = generische Outreach = niedrige Reply Rate</p>',
  's06-r6': '<p>Manuelle Pflege = 5\u201310h/Woche die keiner macht</p>',
  's06-r7': '<p>AI-Agents brauchen saubere Daten als Grundlage</p>',
  's06-disclaimer': '<p>Je l\u00e4nger du wartest, desto teurer wird der Cleanup.</p>',
  's06-next': '<p>N\u00e4chster Schritt \u2192</p>',

  // Slide 7 - CTA
  's07-head': '<h1>Sauberes CRM in 48 Stunden.</h1>',
  's07-a-head': '<p>Selbst machen</p>',
  's07-a-body': '<p>Claude Code + HubSpot MCP.<br/>Anleitung in der Academy.</p>',
  's07-b-head': '<p>Machen lassen</p>',
  's07-b-body': '<p>Wir auditieren, bereinigen<br/>und automatisieren dein CRM.</p>',
  's07-p1-label': '<p>EINMALIG</p>',
  's07-p1-val': '<p>1.900\u20ac</p>',
  's07-p2-label': '<p>MIT RETAINER</p>',
  's07-p2-val': '<p>ab 500\u20ac</p>',
  's07-p3': '<p>Monatliche Hygiene inklusive.<br/>Ergebnis-Garantie.</p>',
  's07-url': '<p>cegtec.net/crm-audit</p>',
};

for (const slide of crm.slides) {
  for (const el of slide.elements) {
    if (replacements[el.id] && el.type === 'text') {
      el.content = replacements[el.id];
    }
  }
}

fs.writeFileSync('src/data/crm-audit.json', JSON.stringify(crm, null, 2));
console.log('Done: ' + crm.slides.length + ' slides');
