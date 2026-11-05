// Node counterpart of Vite's public configuration and ?raw source imports.
// Read committed public defaults only, never the operator's local .env/secrets.
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const defaults = parseEnv(readFileSync(new URL('../.env.example', import.meta.url), 'utf8'));
const publicEnv = Object.fromEntries(Object.entries(defaults).filter(([key]) => key.startsWith('VITE_')));
Object.assign(publicEnv, { MODE: 'test', DEV: false, PROD: false, SSR: true });

registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith('file:') && new URL(url).searchParams.has('raw')) {
      const file = new URL(url);
      file.search = '';
      return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(readFileSync(file, 'utf8'))};` };
    }
    const loaded = nextLoad(url, context);
    if (!url.startsWith('file:') || url.includes('/node_modules/') || loaded.format !== 'module' || loaded.source == null) return loaded;
    const source = typeof loaded.source === 'string' ? loaded.source : Buffer.from(loaded.source).toString('utf8');
    if (!source.includes('import.meta.env')) return loaded;
    return { ...loaded, source: `import.meta.env ??= Object.freeze(${JSON.stringify(publicEnv)});\n${source}` };
  },
});
