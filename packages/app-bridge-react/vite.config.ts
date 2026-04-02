/// <reference types="node" />
/// <reference types="vitest" />

import {existsSync, readFileSync, globSync} from 'node:fs';
import {copyFile, writeFile, readFile, mkdir} from 'node:fs/promises';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import babelPlugin from '@rollup/plugin-babel';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseCoverage = {
  provider: 'istanbul',
  include: ['src/**/*.ts', 'src/**/*.tsx'],
  all: true,
  clean: false,
  reportsDirectory: '../../coverage/raws',
  reportOnFailure: true,
};

interface ViteConfigOptions {
  packageDir: string;
  useReact?: boolean;
  external?: string[] | ((deps: string[]) => string[]);
  tsConfigFilePath?: string;
  test?: any;
}

function getTsConfigFilePath(mode: string, options: ViteConfigOptions) {
  if (options.tsConfigFilePath) {
    return options.tsConfigFilePath;
  }
  const hasTestTsConfigFile = existsSync(
    resolve(options.packageDir, `tsconfig.test.json`),
  );
  const hasProdTsConfigFile = existsSync(
    resolve(options.packageDir, `tsconfig.prod.json`),
  );
  if (mode === 'test' && hasTestTsConfigFile) {
    return 'tsconfig.test.json';
  }
  return hasProdTsConfigFile ? 'tsconfig.prod.json' : 'tsconfig.json';
}

export function createViteConfig(options: ViteConfigOptions) {
  const {packageDir, useReact = false} = options;

  const packageJson = JSON.parse(
    readFileSync(resolve(packageDir, 'package.json'), 'utf8'),
  );
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
    ...packageJson.optionalDependencies,
  };

  const baseExternal = Object.keys(dependencies);
  const filteredExternal =
    typeof options.external === 'function'
      ? options.external(baseExternal)
      : [...baseExternal, ...(options.external || [])];
  const external = filteredExternal.map(
    (dep) => new RegExp(`^${dep}($|\\/.*)`),
  );

  const tsOutputDir = resolve(packageDir, 'build/types/esm');
  const cjsOutputDir = resolve(packageDir, 'build/types/cjs');

  function dtsToOriginalFile(dtsFilePath: string) {
    if (!dtsFilePath.endsWith('.d.ts')) return null;
    const originalFile = ['.ts', '.tsx']
      .map((ext) =>
        resolve(
          packageDir,
          'src',
          dtsFilePath.replace(tsOutputDir, '.').replace('.d.ts', ext),
        ),
      )
      .filter(existsSync)[0];
    return existsSync(originalFile) ? originalFile : null;
  }

  return defineConfig(({mode}) => ({
    esbuild: false,
    plugins: [
      tsconfigPaths({
        root: packageDir,
        configNames: [getTsConfigFilePath(mode, options)],
      }),
      dts({
        tsconfigPath: getTsConfigFilePath(mode, options),
        outDir: tsOutputDir,
        beforeWriteFile(filePath, rawContent) {
          const originalFile = dtsToOriginalFile(filePath);
          if (!originalFile) return {filePath, content: rawContent};
          // Add .js extension to imports and exports
          const content = rawContent.replace(
            /(from\s+['"])(\..*?)(['"])/g,
            (_, prefix, path, suffix) => {
              const fullPath = resolve(dirname(filePath), path);
              const isFile = Boolean(dtsToOriginalFile(`${fullPath}.d.ts`));
              const newPath = isFile ? path : `./${join(path, 'index')}`;
              return `${prefix}${newPath}.js${suffix}`;
            },
          );
          // Preserve triple slash comments
          const tripleSplashLines = readFileSync(originalFile, 'utf8')
            .split('\n')
            .filter((line) => line.startsWith('///'))
            .join('\n');
          return {
            filePath,
            content: `${tripleSplashLines}\n${content}`,
          };
        },
        // Ref https://github.com/qmhc/vite-plugin-dts/issues/267#issuecomment-2142950802
        afterBuild: async () => {
          // Fetch all .d.ts and .d.ts.map files recursively
          const files = globSync(`${tsOutputDir}/**/*.d.{ts,ts.map}`, {
            // nodir: true, // TODO: Is this needed if we specify the file extensions in the glob pattern?
          });
          // Since TypeScript 5.0, it has emphasized that type files (*.d.ts) are also affected by its ESM and CJS context.
          // This means that you can't share a single type file for both ESM and CJS exports of your library.
          // You need to have two type files when dual-publishing your library.
          // see https://www.typescriptlang.org/docs/handbook/modules/reference.html#node16-nodenext and
          // https://publint.dev/rules#export_types_invalid_format
          await Promise.all(
            // Ideally, this plugin will support different types in the future
            // See https://github.com/qmhc/vite-plugin-dts/issues/267
            files.map(async (file) => {
              // Generate the new files with the new .mts/.mts.map naming
              const newFilePath = file
                .replace(tsOutputDir, cjsOutputDir)
                .replace(/\.d\.ts(\.map)?$/, '.d.cts$1');
              await mkdir(dirname(newFilePath), {recursive: true});
              await copyFile(file, newFilePath);
              // Update sourceMappingURL references
              if (newFilePath.endsWith('.d.cts')) {
                const content = await readFile(newFilePath, 'utf-8');
                let updatedContent = content.replace(
                  /\/\/# sourceMappingURL=.*\.d\.ts\.map/g,
                  (match) => match.replace('.d.ts.map', '.d.cts.map'),
                );
                // Update .js references to .mjs
                updatedContent = updatedContent.replace(
                  /(from\s+['"].*?)\.js(['"])/g,
                  '$1.cjs$2',
                );
                await writeFile(newFilePath, updatedContent, 'utf-8');
              }
              // Update source map file references
              if (newFilePath.endsWith('.d.cts.map')) {
                const content = await readFile(newFilePath, 'utf-8');
                const updatedContent = content.replace('.d.ts', '.d.cts');
                await writeFile(newFilePath, updatedContent);
              }
            }),
          );
        },
      }),
    ],
    build: {
      rollupOptions: {
        external,
        output: [
          {
            format: 'cjs',
            dir: 'build/cjs',
            entryFileNames: '[name].cjs',
            preserveModules: true,
            generatedCode: {
              symbols: false,
            },
            esModule: true,
            exports: 'named',
            interop: 'auto',
          },
          {
            format: 'es',
            dir: 'build/esm',
            entryFileNames: '[name].js',
            preserveModules: true,
            generatedCode: {
              symbols: false,
            },
          },
          {
            format: 'es',
            dir: 'build/esnext',
            entryFileNames: '[name].esnext',
            preserveModules: true,
            generatedCode: {
              symbols: false,
            },
            target: 'esnext',
          },
        ],
        plugins: [
          babelPlugin({
            configFile: false,
            extensions: ['.ts', '.tsx'],
            babelHelpers: 'bundled',
            envName: 'production',
            targets: ['last 1 chrome versions'],
            presets: [
              [
                '@shopify/babel-preset',
                {
                  typescript: true,
                  react: useReact,
                  reactOptions: {runtime: 'automatic'},
                },
              ],
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {legacy: true}],
              ['@babel/plugin-proposal-class-properties', {loose: true}],
              ['@babel/plugin-transform-private-methods', {loose: true}],
            ],
            assumptions: {
              setPublicClassFields: true,
              privateFieldsAsProperties: true,
            },
          }),
        ],
      },
      outDir: './build',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      minify: false,
      lib: {
        entry: Object.fromEntries(
          globSync(
            ['./src/**/*.ts', './src/**/*.tsx'].map((file) =>
              resolve(packageDir, file),
            ),
          )
            .map((file) => {
              if (
                file.includes('.test.') ||
                file.includes('.d.ts') ||
                file.includes('/tests/')
              ) {
                // Bypass type error
                return null as any;
              }
              const name = file
                .replace(packageDir, '')
                .replace(/^(\.\/|\/)src\//, '')
                .replace(/\.(ts|tsx)$/, '');
              return [name, file];
            })
            .filter(Boolean),
        ),
      },
    },
    // TODO: bring this back when we have tests in this package. Consider using happy-dom
    // test: {
    //   environment: 'jsdom',
    //   globals: true,
    //   ...options.test,
    //   coverage: options.test?.coverage
    //     ? {
    //         ...baseCoverage,
    //         ...options.test?.coverage,
    //       }
    //     : undefined,
    // },
  }));
}

export default createViteConfig({
  packageDir: __dirname,
  useReact: true,
  test: {
    coverage: {
      reporter: [
        [
          'json',
          {
            file: `app-bridge-react-coverage.json`,
          },
        ],
      ],
    },
  },
});
