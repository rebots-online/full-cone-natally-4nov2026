import type { SouvenirSnapshot } from './souvenir';
import { souvenirUrl } from './souvenir';
import { auth } from './firebase';

const HOUSE_SYSTEM_NAMES: Record<string, string> = {
  P: 'Placidus',
  W: 'Whole Sign',
  K: 'Koch',
  E: 'Equal',
  R: 'Regiomontanus',
};

function normalizeGlyphs(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/♈/g, 'Aries').replace(/♉/g, 'Taurus').replace(/♊/g, 'Gemini')
    .replace(/♋/g, 'Cancer').replace(/♌/g, 'Leo').replace(/♍/g, 'Virgo')
    .replace(/♎/g, 'Libra').replace(/♏/g, 'Scorpio').replace(/♐/g, 'Sagittarius')
    .replace(/♑/g, 'Capricorn').replace(/♒/g, 'Aquarius').replace(/♓/g, 'Pisces')
    .replace(/☉/g, 'Sun').replace(/☽|☾/g, 'Moon').replace(/♂/g, 'Mars')
    .replace(/♀/g, 'Venus').replace(/☿/g, 'Mercury').replace(/♃/g, 'Jupiter')
    .replace(/♄/g, 'Saturn').replace(/♅/g, 'Uranus').replace(/♆/g, 'Neptune')
    .replace(/♇/g, 'Pluto').replace(/[*_`#]/g, '')
    .replace(/[\u2018\u2019\u201C\u201D\u2600-\u27BF]/g, '');
}

function safeFilename(name: string): string {
  const clean = (name || 'chart').replace(/[^\w\- ]+/g, '').replace(/\s+/g, '_').slice(0, 60);
  return clean || 'chart';
}

function coordinateText(value: number, positive: string, negative: string): string {
  return `${Math.abs(value).toFixed(2)}°${value >= 0 ? positive : negative}`;
}

function formatDate(iso: string): string {
  const parsed = new Date(iso);
  return Number.isFinite(parsed.getTime()) ? parsed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : iso;
}

/** Download the frozen souvenir as a paginated PDF. No synthetic content. */
export async function downloadSouvenirPdf(snapshot: SouvenirSnapshot): Promise<void> {
  const firebaseAuth = auth;
  const owner = firebaseAuth.currentUser;
  if (!owner || owner.uid !== snapshot.accountUid) {
    throw new Error('Sign in to the souvenir owner account to download this keepsake.');
  }
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const TOTAL_PLACEHOLDER = '{total_pages_count_string}';
  const url = souvenirUrl(snapshot.id);
  const input = snapshot.chart.input;
  const houseCode = (input.houseSystem || 'P').toUpperCase();
  const houseSystem = HOUSE_SYSTEM_NAMES[houseCode] || (houseCode || 'Placidus');

  const setupPage = () => {
    doc.setFillColor(18, 12, 28);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text(`NATALLY KEEPSAKE · ${safeFilename(input.name).replace(/_/g, ' ').toUpperCase()}`, 20, 12);
    doc.setFontSize(7.5);
    doc.setTextColor(169, 157, 174);
    doc.text(`Copyright (C)2026 Robin L. M. Cheung, MBA · Natally · Page ${doc.getNumberOfPages()} of ${TOTAL_PLACEHOLDER}`, 20, 288);
  };

  let y = 24;
  const newPage = () => { doc.addPage(); setupPage(); y = 24; };
  const ensureSpace = (needed: number) => { if (y + needed > 280) newPage(); };

  type ParagraphStyle = { fontSize?: number; color?: [number, number, number]; bold?: boolean; italic?: boolean };
  const paragraph = (text: string, style: ParagraphStyle = {}) => {
    const fontSize = style.fontSize ?? 9;
    const color = style.color ?? [235, 230, 240];
    doc.setFont('times', style.bold ? 'bold' : style.italic ? 'italic' : 'normal');
    doc.setFontSize(fontSize);
    const lines: string[] = doc.splitTextToSize(normalizeGlyphs(text).trim(), 170);
    for (const line of lines) {
      ensureSpace(fontSize * 0.5 + 1);
      // newPage (via setupPage) resets fonts, sizes and colors: restore before each line.
      doc.setFont('times', style.bold ? 'bold' : style.italic ? 'italic' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(line, 20, y);
      y += fontSize * 0.45 + 0.6;
    }
    y += 2.5;
  };

  const heading = (title: string, subtitle?: string) => {
    ensureSpace(16);
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    for (const line of doc.splitTextToSize(normalizeGlyphs(title).trim(), 170) as string[]) {
      ensureSpace(8);
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(242, 202, 80);
      doc.text(line, 20, y);
      y += 6;
    }
    if (subtitle) {
      doc.setFont('times', 'italic');
      doc.setFontSize(9.5);
      for (const line of doc.splitTextToSize(normalizeGlyphs(subtitle).trim(), 170) as string[]) {
        ensureSpace(6);
        doc.setFont('times', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(212, 175, 55);
        doc.text(line, 20, y);
        y += 4.5;
      }
    }
    y += 2;
  };

  // Cover page
  setupPage();
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(242, 202, 80);
  doc.text('A KEEPSAKE OF YOUR SKY', 20, 26);
  y = 36;
  paragraph(input.name, { fontSize: 14, bold: true, color: [241, 232, 216] });
  paragraph(
    input.birthTimeUnknown
      ? `Born ${input.birthDate} (birth time unknown) · ${input.placeName}`
      : `Born ${input.birthDate} at ${input.birthTime} · ${input.placeName}`,
    { fontSize: 10, color: [210, 200, 220] },
  );
  paragraph(
    `Coordinates: ${coordinateText(input.latitude, 'N', 'S')}, ${coordinateText(input.longitude, 'E', 'W')} · UTC${input.timezoneOffset >= 0 ? '+' : ''}${input.timezoneOffset}h`,
    { fontSize: 10, color: [210, 200, 220] },
  );
  if (!input.birthTimeUnknown) {
    paragraph(`House system: ${houseSystem}`, { fontSize: 10, color: [210, 200, 220] });
  }
  paragraph(`Frozen: ${formatDate(snapshot.createdAt)}`, { fontSize: 10, color: [210, 200, 220] });
  paragraph(`Hosted through: ${formatDate(snapshot.retainUntil)}`, { fontSize: 10, color: [210, 200, 220] });
  ensureSpace(10);
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(212, 175, 55);
  doc.textWithLink('Open your interactive souvenir', 20, y, { url });
  y += 10;

  paragraph(
    'Astrology is an interpretive tradition: the chapters that follow are authored symbolic background drawn from centuries of astrological writing, paired with your actual calculated chart positions. The conversation section afterwards preserves your real, completed exchange with Natally; the full exact original, unmodified for print, remains in the interactive souvenir online.',
    { fontSize: 9, color: [210, 200, 220] },
  );

  // Calculated natal chart wheel, drawn from actual snapshot coordinates.
  newPage();
  heading('Your calculated natal chart', 'Exact geometry from the ephemeris engine');
  const chart = snapshot.chart;
  const reference = input.birthTimeUnknown ? 0 : chart.ascLon;
  const xy = (lon: number, r: number): [number, number] => [
    105 - Math.cos((lon - reference) * Math.PI / 180) * r,
    130 + Math.sin((lon - reference) * Math.PI / 180) * r,
  ];
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.circle(105, 130, 70, 'S');
  doc.circle(105, 130, 50, 'S');
  for (let sign = 0; sign < 12; sign++) {
    const lon = sign * 30;
    const [x1, y1] = xy(lon, 50);
    const [x2, y2] = xy(lon, 70);
    doc.line(x1, y1, x2, y2);
    const [lx, ly] = xy(lon + 15, 76);
    doc.setFont('times', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(212, 175, 55);
    doc.text(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][sign], lx, ly, { align: 'center' });
  }
  const houseKnownChart = !input.birthTimeUnknown && chart.houseCusps.length > 0;
  if (houseKnownChart) {
    doc.setDrawColor(169, 157, 174);
    for (const cusp of chart.houseCusps) {
      const [x1, y1] = xy(cusp.lon, 50);
      const [x2, y2] = xy(cusp.lon, 70);
      doc.line(x1, y1, x2, y2);
      const [lx, ly] = xy(cusp.lon, 44);
      doc.setFont('times', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(169, 157, 174);
      doc.text(String(cusp.num), lx, ly, { align: 'center' });
    }
  }
  const bodyLon: Record<string, number> = {};
  for (const body of chart.natalBodies) bodyLon[body.name] = body.lon;
  for (const aspect of chart.aspectChords) {
    const fromLon = bodyLon[aspect.from];
    const toLon = bodyLon[aspect.to];
    if (!Number.isFinite(fromLon) || !Number.isFinite(toLon)) continue;
    const hexMatch = /^#?([0-9a-fA-F]{6})$/.exec(aspect.colorHex || '');
    const parsed = hexMatch ? parseInt(hexMatch[1], 16) : NaN;
    const rgb: [number, number, number] = Number.isFinite(parsed)
      ? [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255]
      : [200, 200, 200];
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    const [x1, y1] = xy(fromLon, 50);
    const [x2, y2] = xy(toLon, 50);
    doc.line(x1, y1, x2, y2);
  }
  chart.natalBodies.forEach((body, index) => {
    const [dx, dy] = xy(body.lon, 50);
    doc.setDrawColor(242, 202, 80);
    doc.setFillColor(242, 202, 80);
    doc.circle(dx, dy, 0.7, 'F');
    const [lx, ly] = xy(body.lon, index % 2 === 0 ? 57 : 62);
    doc.setFont('times', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(241, 232, 216);
    doc.text(body.name.slice(0, 3), lx, ly, { align: 'center' });
  });
  y = 222;
  paragraph(
    `Engine ${chart.engineVersion}${input.birthTimeUnknown ? ' · Birth time unknown: houses and angles are not shown' : ''}. Exact positions follow in the table; see it for precise degrees.`,
    { fontSize: 8, color: [210, 200, 220] },
  );

  // Actual calculated body data table, straight from the snapshot chart.
  newPage();
  heading('Your calculated positions', 'Exact values from the ephemeris engine');
  const houseKnown = !snapshot.chart.input.birthTimeUnknown && snapshot.chart.houseCusps.length > 0;
  for (const body of snapshot.chart.natalBodies) {
    ensureSpace(8);
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(242, 202, 80);
    doc.text(normalizeGlyphs(body.name), 20, y);
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(235, 230, 240);
    const houseText = houseKnown && body.house >= 1 && body.house <= 12 ? `House ${body.house}` : 'House unknown';
    const retroText = body.isRetrograde ? 'Retrograde' : 'Direct';
    doc.text(`${normalizeGlyphs(body.fullDegText)} · ${houseText} · ${retroText}`, 60, y);
    y += 6;
  }
  y += 2;

  // One chapter per natal body, each starting on a fresh page.
  for (const chapter of snapshot.chapters) {
    newPage();
    heading(chapter.title, 'Authored symbolic background');
    paragraph(chapter.text, {});
  }

  // Personal conversation: text preserved, chronology intact.
  newPage();
  heading('Your conversation with Natally', 'Your actual completed exchange, preserved as it was delivered');
  for (const message of snapshot.messages) {
    ensureSpace(12);
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...(message.sender === 'user' ? [159, 180, 255] : [242, 202, 80]) as [number, number, number]);
    doc.text(`${message.sender === 'user' ? 'You' : 'Natally'}${message.timestamp ? ` (${normalizeGlyphs(message.timestamp)})` : ''}`, 20, y);
    y += 5;
    paragraph(message.text, { color: [241, 232, 216] });
  }

  if (firebaseAuth.currentUser?.uid !== snapshot.accountUid) {
    throw new Error('Your account changed. The keepsake was not downloaded.');
  }
  doc.putTotalPages(TOTAL_PLACEHOLDER);
  doc.save(`${safeFilename(input.name)}_natally_keepsake_${snapshot.id.slice(0, 8)}.pdf`);
}
