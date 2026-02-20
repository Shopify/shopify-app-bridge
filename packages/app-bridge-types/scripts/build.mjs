import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';

const CDN_URL = 'https://cdn.shopify.com/shopifycloud/app-bridge.d.ts';
const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, '..', 'dist', 'index.d.ts');

const response = await fetch(CDN_URL);

if (!response.ok) {
  throw new Error(
    `Failed to download types from ${CDN_URL}: ${response.status} ${response.statusText}`,
  );
}

const types = await response.text();
await writeFile(outFile, types);

console.log(`Downloaded types to ${outFile}`);
