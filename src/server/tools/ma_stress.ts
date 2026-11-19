// Draws milestones and awards over and over for random game settings, and reports how often the
// draw breaks (the selector gives up and throws).
//
//   npx tsx src/server/tools/ma_stress.ts [--runs 100] [--type limited|unlimited]
//
// --runs is in thousands of draws: --runs 500 draws 500,000 regular games and then 500,000 modular
// games.
//
// Each draw picks a random board, fan MAs on or off (regular games only; modular games ignore it),
// and each expansion that affects MAs on or off.

import '@/server/init';

import {BoardName} from '../../common/boards/BoardName';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {DrawResult, MA_EXPANSIONS, MAScenario, describeScenario, drawMAs} from './ma_simulation';

/** How many draws one run is. */
const DRAWS_PER_RUN = 1000;

type Args = {runs: number, randomMA: RandomMAOptionType};

function parseArgs(argv: ReadonlyArray<string>): Args {
  const args: Args = {runs: 100, randomMA: RandomMAOptionType.LIMITED};
  for (let i = 0; i < argv.length; i++) {
    const value = argv[i + 1];
    switch (argv[i]) {
    case '--runs':
      args.runs = Number(value);
      i++;
      break;
    case '--type':
      if (value === 'limited') {
        args.randomMA = RandomMAOptionType.LIMITED;
      } else if (value === 'unlimited') {
        args.randomMA = RandomMAOptionType.UNLIMITED;
      } else {
        throw new Error(`--type must be limited or unlimited, not ${value}`);
      }
      i++;
      break;
    default:
      throw new Error(`Unknown argument ${argv[i]}`);
    }
  }
  if (!(args.runs > 0)) {
    throw new Error('--runs must be a positive number');
  }
  return args;
}

const BOARDS = Object.values(BoardName);
const coin = () => Math.random() < 0.5;
const pick = <T>(list: ReadonlyArray<T>): T => list[Math.floor(Math.random() * list.length)];

function randomScenario(randomMA: RandomMAOptionType, modularMA: boolean): MAScenario {
  const expansions = Object.fromEntries(MA_EXPANSIONS.map((e) => [e, coin()])) as MAScenario['expansions'];
  return {board: pick(BOARDS), randomMA, modularMA, includeFanMA: !modularMA && coin(), expansions};
}

/** Draws and failures, counted under any key. */
class Tally {
  private readonly counts = new Map<string, {draws: number, failures: number}>();

  add(key: string, failed: boolean) {
    const count = this.counts.get(key) ?? {draws: 0, failures: 0};
    count.draws++;
    if (failed) {
      count.failures++;
    }
    this.counts.set(key, count);
  }

  entries() {
    return [...this.counts.entries()].map(([key, count]) => ({key, ...count, rate: count.failures / count.draws}));
  }
}

/** The draws for one kind of game, regular or modular. */
class ModeReport {
  draws = 0;
  failures = 0;
  /** One line per option value: "board: hellas", "venus: no". */
  readonly byOption = new Tally();
  /** Exact combinations of settings. */
  readonly byScenario = new Tally();
  readonly errors = new Map<string, number>();

  constructor(readonly name: string) {}

  record(scenario: MAScenario, result: DrawResult) {
    const failed = !result.ok;
    this.draws++;
    if (failed) {
      this.failures++;
    }
    const yesNo = (b: boolean) => b ? 'yes' : 'no';
    this.byOption.add(`board: ${scenario.board}`, failed);
    if (!scenario.modularMA) {
      this.byOption.add(`fan MAs: ${yesNo(scenario.includeFanMA)}`, failed);
    }
    for (const e of MA_EXPANSIONS) {
      this.byOption.add(`${e}: ${yesNo(scenario.expansions[e])}`, failed);
    }
    this.byScenario.add(describeScenario(scenario), failed);
    if (!result.ok) {
      this.errors.set(result.error, (this.errors.get(result.error) ?? 0) + 1);
    }
  }
}

/** Collects every draw, split into regular and modular games. */
class Report {
  readonly regular = new ModeReport('Regular');
  readonly modular = new ModeReport('Modular');

  record(scenario: MAScenario, result: DrawResult) {
    (scenario.modularMA ? this.modular : this.regular).record(scenario, result);
  }
}

// Breaks are rare, so small rates keep more digits: 0.0012% rather than 0.00%.
function pct(rate: number): string {
  if (rate === 0) {
    return '0%';
  }
  const percent = 100 * rate;
  return `${percent >= 0.1 ? percent.toFixed(2) : percent.toPrecision(2)}%`;
}

function summary(mode: ModeReport): string {
  return `${mode.draws} draws, ${mode.failures} breaks (${pct(mode.failures / mode.draws)})`;
}

function printProgress(mode: ModeReport) {
  console.log(`  ${mode.name.toLowerCase()}: ${summary(mode)}`);
}

function printModeReport(mode: ModeReport) {
  console.log();
  console.log(`== ${mode.name}: ${summary(mode)}.`);
  if (mode.failures === 0) {
    return;
  }

  console.log();
  console.log('Break rate by option (options with no breaks are left out):');
  const options = mode.byOption.entries().filter((e) => e.failures > 0).sort((a, b) => b.rate - a.rate);
  for (const e of options) {
    console.log(`  ${e.key.padEnd(32)} ${pct(e.rate).padStart(7)}  (${e.failures} of ${e.draws})`);
  }

  console.log();
  console.log('Settings with the most breaks:');
  const scenarios = mode.byScenario.entries().filter((e) => e.failures > 0)
    .sort((a, b) => b.failures - a.failures || b.rate - a.rate)
    .slice(0, 15);
  for (const e of scenarios) {
    console.log(`  ${String(e.failures).padStart(5)} of ${String(e.draws).padEnd(5)} ${e.key}`);
  }

  console.log();
  console.log('Errors:');
  for (const [message, count] of [...mode.errors.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(5)}  ${message}`);
  }
}

function printReport(report: Report, args: Args) {
  console.log();
  console.log(`${args.randomMA}:`);
  printModeReport(report.regular);
  printModeReport(report.modular);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = new Report();
  const draws = Math.round(args.runs * DRAWS_PER_RUN);
  const progressEvery = Math.max(1, Math.floor(draws / 10));

  // The full count for regular games, then the full count for modular games.
  for (const modularMA of [false, true]) {
    const mode = modularMA ? report.modular : report.regular;
    console.log(`Drawing ${args.randomMA} milestones and awards for ${draws} ${mode.name.toLowerCase()} games...`);
    for (let run = 1; run <= draws; run++) {
      const scenario = randomScenario(args.randomMA, modularMA);
      report.record(scenario, drawMAs(scenario));
      if (run % progressEvery === 0) {
        printProgress(mode);
      }
    }
  }
  printReport(report, args);
}

main();
