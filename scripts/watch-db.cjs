'use strict';

const { watch } = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const schemaDirectory = path.join(projectRoot, 'db', 'schema');
const drizzleCli = require.resolve('drizzle-kit/bin.cjs');
let debounceTimer;
let pushProcess;
let pushQueued = false;

function runPush() {
  console.log('Pushing database schema...');
  pushProcess = spawn(process.execPath, [drizzleCli, 'push'], {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  });

  pushProcess.on('error', (error) => {
    console.error('Could not start Drizzle Kit:', error.message);
  });

  pushProcess.on('exit', (code) => {
    pushProcess = undefined;
    if (code === 0) {
      console.log('Database schema is up to date.');
    } else {
      console.error(`Database schema push failed with exit code ${code}.`);
    }

    if (pushQueued) {
      pushQueued = false;
      schedulePush();
    }
  });
}

function schedulePush() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (pushProcess) {
      pushQueued = true;
      return;
    }
    runPush();
  }, 500);
}

const watcher = watch(schemaDirectory, { recursive: true }, (_event, filename) => {
  const changedFile = filename?.toString();
  if (changedFile && path.extname(changedFile).toLowerCase() !== '.ts') {
    return;
  }

  console.log(`${changedFile || 'A schema file'} changed; syncing shortly.`);
  schedulePush();
});

watcher.on('error', (error) => {
  console.error('Schema watcher failed:', error.message);
  process.exitCode = 1;
});

console.log('Watching db/schema for TypeScript changes. Press Ctrl+C to stop.');
schedulePush();
