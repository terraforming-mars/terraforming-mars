import chokidar from 'chokidar';
import {exec} from 'child_process';
import path from 'path';

const directoryToWatch = process.argv[2] ?? 'src/styles';
const pattern = path.join(directoryToWatch, '**/*.less');

let debounceTimeout: NodeJS.Timeout
const DEBOUNCE_DELAY = 300;

function runMakeCss(): void {
  console.log('Running make:css...');
  exec('npm run make:css', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
    console.log('Done.');
  });
}

function onChange(filePath: string): void {
  console.log(`Detected change: ${filePath}`);
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(runMakeCss, DEBOUNCE_DELAY);
}

const watcher = chokidar.watch(pattern, {ignoreInitial: true});
watcher.on('change', onChange);
watcher.on('add', onChange);

// Compile once up front so build/styles.css is fresh before anything is served.
// Without this the watcher only rebuilds on a subsequent change, leaving stale
// CSS if you launch the watcher without editing a .less file.
runMakeCss();

console.log(`Watching for LESS changes in: ${path.resolve(directoryToWatch)}`);

process.on('SIGINT', () => {
  console.log('\nStopping watcher.');
  watcher.close().then(() => process.exit(0));
});
