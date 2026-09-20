import chokidar from 'chokidar';
import {exec} from 'child_process';

const directoryToWatch = process.argv[2] ?? 'src/server/cards';
const pattern = `${directoryToWatch}/**/*.ts`;

let debounceTimeout: NodeJS.Timeout;
const DEBOUNCE_DELAY = 300;

// Listens to changes of src/server/cards and triggers rebuilding
// card rendering which is picked up by dev:client. In other words,
// it applies card changes live.
//
// This doesn't respond to some changes from global events, colonies,
// milestones and awards.
function runMakeCards(): void {
  console.log('Running make:cards...');
  exec('npm run make:cards', (error, stdout, stderr) => {
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
  debounceTimeout = setTimeout(runMakeCards, DEBOUNCE_DELAY);
}

const watcher = chokidar.watch(pattern, {ignoreInitial: true});
watcher.on('change', onChange);
watcher.on('add', onChange);

console.log(`Watching for card changes in: ${pattern}`);

process.on('SIGINT', () => {
  console.log('\nStopping watcher.');
  watcher.close().then(() => process.exit(0));
});
