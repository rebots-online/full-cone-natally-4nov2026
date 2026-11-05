import { createServer } from 'node:http';
import { createBillingRuntime } from './runtime.mjs';

const handle = createBillingRuntime(process.env);
const server = createServer(async (request, response) => {
  try {
    const chunks = []; let size = 0;
    for await (const chunk of request) { size += chunk.length; if (size > 1048576) { response.writeHead(413); response.end(); return; } chunks.push(chunk); }
    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(',') : value);
    const result = await handle(new Request(`http://localhost${request.url}`, { method: request.method, headers,
      ...(['GET', 'HEAD'].includes(request.method) ? {} : { body: Buffer.concat(chunks) }) }));
    response.writeHead(result.status, Object.fromEntries(result.headers)); response.end(Buffer.from(await result.arrayBuffer()));
  } catch { response.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify({ message: 'Billing request could not be confirmed.' })); }
});
server.listen(Number(process.env.PORT || 8080), '0.0.0.0', () => process.stdout.write('Natally billing service listening.\n'));
