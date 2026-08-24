import {readFile, readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';

const publishedPackages = parsePublishedPackages(
  process.env.PUBLISHED_PACKAGES,
);
const packagesByName = await readWorkspacePackages('packages');

for (const publishedPackage of publishedPackages) {
  const workspacePackage = packagesByName.get(publishedPackage.name);
  if (!workspacePackage) {
    throw new Error(
      `Published package ${publishedPackage.name} does not exist in the workspace`,
    );
  }

  const tag = `${publishedPackage.name}@${publishedPackage.version}`;
  const notes = extractChangelogEntry(
    await readFile(join(workspacePackage.directory, 'CHANGELOG.md'), 'utf8'),
    publishedPackage.version,
  );

  if (runGh(['release', 'view', tag], {allowFailure: true}).status === 0) {
    console.log(`GitHub release ${tag} already exists; skipping`);
    continue;
  }

  runGh(
    [
      'release',
      'create',
      tag,
      '--target',
      process.env.GITHUB_SHA,
      '--title',
      tag,
      '--notes-file',
      '-',
      ...(publishedPackage.version.includes('-') ? ['--prerelease'] : []),
    ],
    {input: notes},
  );
  console.log(`Created GitHub release ${tag}`);
}

function parsePublishedPackages(rawValue) {
  if (!rawValue) {
    throw new Error('PUBLISHED_PACKAGES is required');
  }

  let value;
  try {
    value = JSON.parse(rawValue);
  } catch (error) {
    throw new Error('PUBLISHED_PACKAGES must be valid JSON', {cause: error});
  }

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('PUBLISHED_PACKAGES must be a non-empty array');
  }

  for (const publishedPackage of value) {
    if (
      !publishedPackage ||
      typeof publishedPackage.name !== 'string' ||
      typeof publishedPackage.version !== 'string' ||
      !/^(@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i.test(publishedPackage.name) ||
      !/^[0-9A-Za-z][0-9A-Za-z.+-]*$/.test(publishedPackage.version)
    ) {
      throw new Error('PUBLISHED_PACKAGES contains an invalid package');
    }
  }

  return value;
}

async function readWorkspacePackages(packagesDirectory) {
  const packages = new Map();

  for (const entry of await readdir(packagesDirectory, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;

    const directory = join(packagesDirectory, entry.name);
    const packageJson = JSON.parse(
      await readFile(join(directory, 'package.json'), 'utf8'),
    );
    packages.set(packageJson.name, {directory, packageJson});
  }

  return packages;
}

function extractChangelogEntry(changelog, version) {
  const heading = `## ${version}`;
  const lines = changelog.replaceAll('\r\n', '\n').split('\n');
  const start = lines.findIndex((line) => line.trimEnd() === heading);

  if (start === -1) {
    throw new Error(`Could not find changelog entry for version ${version}`);
  }

  let end = lines.findIndex(
    (line, index) => index > start && line.startsWith('## '),
  );
  if (end === -1) end = lines.length;

  const entry = lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
  if (!entry) {
    throw new Error(`Changelog entry for version ${version} is empty`);
  }

  return `${entry}\n`;
}

function runGh(args, {allowFailure = false, input} = {}) {
  const result = spawnSync('gh', args, {
    encoding: 'utf8',
    input,
    stdio: input === undefined ? 'pipe' : ['pipe', 'pipe', 'pipe'],
  });

  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error(
      `gh ${args.join(' ')} failed: ${result.stderr || result.stdout}`,
    );
  }

  return result;
}
