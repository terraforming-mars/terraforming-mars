// watch.js
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');

// Get the directory from command line arguments
const directoryToWatch = process.argv[2];

if (!directoryToWatch) {
  console.error('Usage: node watch.js <directory_to_watch>');
  process.exit(1);
}

// Resolve the absolute path to the directory
const absolutePath = path.resolve(directoryToWatch);

// Check if the directory exists
try {
  fs.accessSync(absolutePath, fs.constants.F_OK);
} catch (error) {
  console.error(`Error: Directory "${absolutePath}" does not exist.`);
  process.exit(1);
}

console.log(`Watching for file changes in: ${absolutePath}`);

let debounceTimeout;
const DEBOUNCE_DELAY = 500; // milliseconds to wait before running npm command

fs.watch(absolutePath, {/* recursive: true */}, (eventType, filename) => {
  // filename can be null in some cases, so we check for it
  if (filename) {
    console.log(`Detected change: ${eventType} - ${filename}`);

    // Debounce the execution to avoid multiple runs for a single save event
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log('Running npm run make:css...');
      exec('npm run make:css', (error, stdout, stderr) => {
        console.log('Done');
        if (error) {
          console.error(`exec error: ${error.message}`);
          return;
        }
        if (stdout) {
          console.log(`stdout: ${stdout}`);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
      });
    }, DEBOUNCE_DELAY);
  }
});

process.on('SIGINT', () => {
  console.log('\nStopping watcher.');
  process.exit(0);
});
