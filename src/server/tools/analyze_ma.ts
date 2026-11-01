import '@/server/init';

import http from 'http';
import fs from 'fs';
import * as responses from '@/server/server/responses';

import {BoardName} from '../../common/boards/BoardName';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {MultiSet} from 'mnemonist';
import {Request} from '../Request';
import {Response} from '../Response';
import {comparing, reversed} from '../../common/utils/Ordering';
import {MA_EXPANSIONS, MAScenario, drawMAs, noExpansions} from './ma_simulation';

function processRequest(req: Request, res: Response): void {
  try {
    if (req.url === undefined) {
      return;
    }
    const url = new URL(req.url, `http://localhost`);
    if (url.pathname === '/') {
      fs.readFile('src/server/tools/analyze_ma.html', (err, data) => {
        try {
          if (err) {
            responses.internalServerError(req, res, err);
            return;
          }
          res.setHeader('Content-Length', data.length);
          res.end(data);
        } catch (e) {
          console.error(e);
        }
      });
    } else if (url.pathname === '/data') {
      const data = calc(url.searchParams);
      res.setHeader('Content-type', 'text/csv');
      res.setHeader('Content-Length', data.length);
      res.end(data);
    } else {
      responses.notFound(req, res);
    }
  } catch (e) {
    console.error(e);
  }
}

const server = http.createServer(processRequest);
console.log('Starting server on port ' + (process.env.PORT || 8081));
server.listen(process.env.PORT || 8081);

// Draws milestones and awards `runs` times and returns how often each was picked, as CSV. Draws that
// break (the selector gives up) are counted as "ERROR".
function calc(params: URLSearchParams): string {
  const runs = Number(params.get('runs') || 100);
  const flag = (name: string) => params.get(name) === 'true';

  const expansions = noExpansions();
  for (const expansion of MA_EXPANSIONS) {
    expansions[expansion] = flag(expansion);
  }
  const board = params.get('board') as BoardName | null;
  const scenario: MAScenario = {
    board: board !== null && Object.values(BoardName).includes(board) ? board : BoardName.THARSIS,
    randomMA: randomMAType(params.get('type')),
    modularMA: flag('modular'),
    includeFanMA: flag('fan-maps'),
    expansions,
  };

  const results = new MultiSet<string>();
  for (let nth = 1; nth <= runs; nth++) {
    if (nth % 1000 === 0) {
      console.log(`#${nth}`);
    }
    const drawn = drawMAs(scenario);
    if (drawn.ok) {
      for (const ma of [...drawn.milestones, ...drawn.awards]) {
        results.add(ma);
      }
    } else {
      results.add('ERROR');
    }
  }

  const copy: Array<[string, number]> = [...results.multiplicities()];
  copy.sort(reversed(comparing((entry) => entry[1])));
  return 'name,count\n' + copy.map(([name, count]) => `${name},${count}`).join('\n');
}

function randomMAType(type: string | null): RandomMAOptionType {
  switch (type) {
  case 'NONE':
    return RandomMAOptionType.NONE;
  case 'FULL':
    return RandomMAOptionType.UNLIMITED;
  default:
    return RandomMAOptionType.LIMITED;
  }
}
