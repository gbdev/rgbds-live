#!/usr/bin/env node

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

// Regex to match INCLUDE "file" and INCBIN "file" in asm source
const INCLUDE_RE = /^\s*(INCLUDE|INCBIN)\s+"([^"]+)"/i;


//Parse INCLUDE/INCBIN directives from a source file.
//Returns an array of filenames referenced.
function parseIncludes(filePath) {
  const results = [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const m = INCLUDE_RE.exec(line);
      if (m) {
        results.push(m[2]);
      }
    }
  } catch (e) {
    // If file can't be read, skip dependency analysis
  }
  return results;
}

//Collect files to upload.
// If args is empty: look for all .asm and .inc in current dir (non-recursive),
//maybe have other types of files in the future, but for now just these two.
// If args given: add those files + any same-directory dependencies found via INCLUDE/INCBIN
function collectFiles(args) {
  const files = new Set();

  if (args.length === 0) {
    // Upload all .asm and .inc files in current directory
    const cwd = process.cwd();
    const entries = fs.readdirSync(cwd, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {// Only consider files, ignore subdirectories
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.asm' || ext === '.inc') {
          files.add(entry.name);
        }
      }
    }
  } else {
    const cwd = process.cwd();
    for (const arg of args) {
      // Normalize path separators for cross-platform
      const normalized = arg.replace(/\\/g, '/');
      const filePath = path.resolve(cwd, normalized);
      const name = path.relative(cwd, filePath).replace(/\\/g, '/');

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        files.add(name);

        // Scan .asm/.inc files for INCLUDE/INCBIN dependencies
        const ext = path.extname(name).toLowerCase();
        if (ext === '.asm' || ext === '.inc') {
          const includes = parseIncludes(filePath);
          for (const inc of includes) {
            // Only include same-directory dependencies
            const dir = path.dirname(normalized);
            const depName = dir === '.' ? inc : `${dir}/${inc}`;
            const depPath = path.resolve(cwd, depName);
            if (fs.existsSync(depPath) && fs.statSync(depPath).isFile()) {
              files.add(depName);
            }
          }
        }
      }
    }
  }

  return [...files].sort();
}

//Start HTTP server that serves file manifest and file contents.
//Returns a Promise that resolves with { server, port } once the server is listening.
function startServer(files) {
  const cwd = process.cwd();

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      // CORS headers - allow requests from any origin (the gbdev.io web app)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url, `http://localhost`);
      const pathname = url.pathname;

      if (pathname === '/manifest') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(files));
        return;
      }

      const filePrefix = '/files/';
      if (pathname.startsWith(filePrefix)) {
        const filename = decodeURIComponent(pathname.slice(filePrefix.length));
        if (!files.includes(filename)) {
          res.writeHead(404);
          res.end('File not found');
          return;
        }

        const filePath = path.resolve(cwd, filename);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(content);
        } catch (e) {
          res.writeHead(500);
          res.end('Failed to read file');
        }
        return;
      }

      res.writeHead(404);
      res.end('Not found');
    });

    // Port 0 tells the OS to assign a free port automatically
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      console.log(`rgbds-live: Local server running on http://127.0.0.1:${port}`);
      resolve({ server, port });
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
}

//Open a URL in the default browser, cross-platform.
function openBrowser(url) {
  const platform = process.platform;
  let cmd;
  let args;

  if (platform === 'darwin') {
    cmd = 'open';
    args = [url];
  } else if (platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', url];
  } else if (
    platform === 'linux' &&
    (fs.existsSync('/proc/sys/fs/binfmt_misc/WSLInterop') || process.env.WSL_DISTRO_NAME)
  ) {
    // WSL: use Windows cmd.exe to open the default browser
    cmd = 'cmd.exe';
    args = ['/c', 'start', url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }

  const child = spawn(cmd, args, {
    stdio: 'ignore',
    detached: true,
  });
  child.unref();
}

async function main() {
  const rawArgs = process.argv.slice(2);

  // Detect --dev flag for local testing
  const devMode = rawArgs.includes('--dev');
  const args = rawArgs.filter((a) => a !== '--dev');

  // Collect files
  const files = collectFiles(args);

  if (files.length === 0) {
    console.error('rgbds-live: No .asm or .inc files found in the current directory.');
    process.exit(1);
  }

  console.log('rgbds-live: Uploading files:');
  for (const f of files) {
    console.log(`  - ${f}`);
  }

  // Start server (port 0 = OS assigns a free port automatically)
  const { server, port } = await startServer(files);

  // Open browser: --dev uses Vite dev server, otherwise production URL
  const baseUrl = devMode ? 'http://localhost:5173' : 'https://gbdev.io/rgbds-live';
  const url = `${baseUrl}/?local=${port}`;
  console.log(`rgbds-live: Opening ${url}`);
  openBrowser(url);

  // Graceful shutdown
  const shutdown = () => {
    console.log('\nrgbds-live: Shutting down...');
    server.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('rgbds-live:', err.message);
  process.exit(1);
});