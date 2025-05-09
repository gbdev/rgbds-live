import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { execSync } from 'node:child_process';

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // Extract the RGBDS version we're using and set it as an env variable
  process.env.VITE_RGBDS_VERSION = execSync(
    "git --git-dir=rgbds/.git -c safe.directory='*' describe --tags --always",
  ).toString('utf8');
  console.log('VITE_RGBDS_VERSION set to', process.env.VITE_RGBDS_VERSION);
  return {
    base: '',
    build: {
      target: ['chrome109', 'safari15.6', 'firefox102'],
      outDir: 'www',
      chunkSizeWarningLimit: 1000,
    },
    resolve: {
      alias: {
        ace: 'ace-builds/src-noconflict/',
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: './node_modules/ace-builds/src-noconflict/**',
            dest: 'assets/ace',
          },
        ],
      }),
    ],
  };
});
