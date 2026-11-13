// Lit le dernier METAR et le dernier TAF de Charleroi (NOAA aviationweather.gov) et écrit ebci.json.
// Le navigateur ne peut pas interroger ce service directement (pas d'en-tête CORS) : l'app lit ce fichier.
import fs from 'node:fs';

const ICAO = process.env.AERO_ICAO || 'EBCI';
const OUT = process.env.AERO_OUT || 'ebci.json';
const UA = 'meteo-leuze (https://github.com/Razor-back1/Meteo)';

async function get(kind) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(`https://aviationweather.gov/api/data/${kind}?ids=${ICAO}&format=json`, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(20000),
      });
      if (r.status === 204) return null;
      if (!r.ok) throw new Error(`${kind} ${r.status}`);
      const j = await r.json();
      return Array.isArray(j) ? j[0] ?? null : null;
    } catch (e) {
      console.error(`${kind} : ${e.message}`);
      await new Promise((ok) => setTimeout(ok, 3000 * (i + 1)));
    }
  }
  return undefined; // échec
}

const [m, t] = await Promise.all([get('metar'), get('taf')]);
if (m === undefined && t === undefined) {
  console.error('Service injoignable : on garde le fichier précédent.');
  process.exit(1);
}
const out = {
  icao: ICAO,
  fetched: Math.floor(Date.now() / 1000),
  metar: m ? { rawOb: m.rawOb, obsTime: m.obsTime ?? null, reportTime: m.reportTime ?? null } : null,
  taf: t ? { rawTAF: t.rawTAF, issueTime: t.issueTime ?? null, bulletinTime: t.bulletinTime ?? null } : null,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
