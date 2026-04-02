import {writeFileSync, readFileSync, mkdirSync, mkdtempSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve, dirname, join} from 'node:path';
import {tmpdir} from 'node:os';

const CDN_URL = 'https://cdn.shopify.com/shopifycloud/app-bridge.d.ts';
const NPM_PACKAGE = '@shopify/app-bridge-types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');

/**
 * Set a GitHub Actions output variable. No-op outside of Actions.
 */
function setOutput(name, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    writeFileSync(outputFile, `${name}=${value}\n`, {flag: 'a'});
  }
}

/**
 * Normalize whitespace so trivial formatting differences don't trigger a diff.
 */
function normalize(text) {
  return text.replace(/\r\n/g, '\n').trimEnd() + '\n';
}

/**
 * Fetch text from a URL. Returns null if the request fails.
 */
async function fetchText(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`${url} returned ${response.status}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.log(`Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

/**
 * Get the published index.d.ts from npm via `npm pack`.
 * Returns the file contents as a string, or null if the package isn't published.
 */
function getPublishedTypes(workDir) {
  try {
    execSync(`npm pack ${NPM_PACKAGE} --pack-destination "${workDir}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (error) {
    console.log(
      `npm pack failed (package may not be published yet): ${error.message}`,
    );
    return null;
  }

  try {
    execSync(
      `tar xzf "${workDir}"/*.tgz -C "${workDir}" package/dist/index.d.ts`,
      {encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe']},
    );
    return readFileSync(
      join(workDir, 'package', 'dist', 'index.d.ts'),
      'utf-8',
    );
  } catch (error) {
    console.log(`Failed to extract types from tarball: ${error.message}`);
    return null;
  }
}

// --- Main ---

const cdnText = await fetchText(CDN_URL);

if (cdnText == null) {
  console.log('CDN is unavailable. Exiting without changes.');
  setOutput('has_changes', 'false');
  process.exit(0);
}

// If npm package isn't published yet, treat published types as empty
const npmWorkDir = mkdtempSync(join(tmpdir(), 'npm-pack-'));
const npmText = getPublishedTypes(npmWorkDir) ?? '';

const normalizedCdn = normalize(cdnText);
const normalizedNpm = normalize(npmText);

if (normalizedCdn === normalizedNpm) {
  console.log('CDN types match published npm types. No changes needed.');
  setOutput('has_changes', 'false');
  process.exit(0);
}

console.log('CDN types differ from published npm types. Generating changeset.');

// Write both versions to temp files for diffing
const tempDir = mkdtempSync(join(tmpdir(), 'cdn-types-'));
const npmFile = join(tempDir, 'npm.d.ts');
const cdnFile = join(tempDir, 'cdn.d.ts');
writeFileSync(npmFile, normalizedNpm);
writeFileSync(cdnFile, normalizedCdn);

// Generate unified diff
let diff;
try {
  // diff exits with 1 when files differ, which is expected
  diff = execSync(`diff -u "${npmFile}" "${cdnFile}"`, {
    encoding: 'utf-8',
  });
} catch (error) {
  // diff returns exit code 1 when files differ — that's the expected path
  diff = error.stdout ?? '';
}

// Replace temp file paths with readable labels in the diff header
diff = diff
  .replace(
    new RegExp(npmFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    'npm (published)',
  )
  .replace(
    new RegExp(cdnFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    'cdn (latest)',
  );

// Count diff stats
const additions = (diff.match(/^\+[^+]/gm) || []).length;
const deletions = (diff.match(/^-[^-]/gm) || []).length;

// Write changeset
const changesetDir = resolve(repoRoot, '.changeset');
mkdirSync(changesetDir, {recursive: true});

const changesetFile = resolve(changesetDir, 'automated-cdn-types-update.md');
const changesetContent = `---
'@shopify/app-bridge-types': patch
---

Automated update of CDN types (+${additions} -${deletions} lines)

See the [App Bridge changelog](https://shopify.dev/changelog?filter=api&api_type=app-bridge) for details.
`;
writeFileSync(changesetFile, changesetContent);
console.log(`Wrote changeset to ${changesetFile}`);

// Write PR body to temp file (truncate large diffs)
const MAX_DIFF_LENGTH = 60_000;
const truncatedDiff =
  diff.length > MAX_DIFF_LENGTH
    ? diff.slice(0, MAX_DIFF_LENGTH) + '\n\n... (diff truncated)'
    : diff;

const prBody = `## Automated CDN Types Update

The types at \`${CDN_URL}\` have changed compared to the published \`@shopify/app-bridge-types\` package.

**Stats:** +${additions} -${deletions} lines

<details>
<summary>Full diff</summary>

\`\`\`diff
${truncatedDiff}
\`\`\`

</details>

Merging this PR will trigger a patch release of \`@shopify/app-bridge-types\`.
`;

const prBodyFile = join(tempDir, 'pr-body.md');
writeFileSync(prBodyFile, prBody);

setOutput('has_changes', 'true');
setOutput('pr_body_file', prBodyFile);

console.log(`PR body written to ${prBodyFile}`);
console.log('Done.');
