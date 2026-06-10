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

const types = relaxGlobalMenuItemProperties(await response.text());
await writeFile(outFile, types);

console.log(`Downloaded types to ${outFile}`);

function relaxGlobalMenuItemProperties(types) {
  const exactMenuItemTypes = `interface MenuItemProperties {
\tvariant?: "primary" | "breadcrumb" | null | undefined;
\ttone?: "critical" | "default";
\tdisabled?: boolean;
\tloading?: boolean | string;
}`;

  const relaxedMenuItemTypes = `interface MenuItemProperties {
\tvariant?: "primary" | "breadcrumb" | (string & {}) | null | undefined;
\ttone?: "critical" | "default" | (string & {});
\tdisabled?: boolean;
\tloading?: boolean | string;
}`;

  if (!types.includes(exactMenuItemTypes)) {
    throw new Error('Unable to find MenuItemProperties in downloaded types');
  }

  return types.replace(exactMenuItemTypes, relaxedMenuItemTypes);
}
