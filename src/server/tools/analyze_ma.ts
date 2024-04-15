require('dotenv').config();

import * as http from 'http';
import * as fs from 'fs';
import * as responses from '../routes/responses';

import {chooseMilestonesAndAwards} from '../ma/MilestoneAwardSelector';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../game/GameOptions';
import {BoardName} from '../../common/boards/BoardName';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {MultiSet} from 'mnemonist';
import {Request} from '../Request';
import {Response} from '../Response';

function processRequest(req: Request, res: Response): void {
  if (req.url === undefined) {
    return;
  }
  const url = new URL(req.url, `http://localhost`);
  if (url.pathname === '/') {
    fs.readFile('src/server/tools/analyze_ma.html', (err, data) => {
      if (err) {
        responses.internalServerError(req, res, err);
      }
      res.setHeader('Content-Length', data.length);
      res.end(data);
    });
  } else if (url.pathname === '/data') {
    const data = calc(url.searchParams);
    res.setHeader('Content-type', 'text/csv');
    res.setHeader('Content-Length', data.length);
    res.end(data);
  } else {
    responses.notFound(req, res);
  }
}

const server = http.createServer(processRequest);
console.log('Starting server on port ' + (process.env.PORT || 8081));
server.listen(process.env.PORT || 8081);

function calc(params: URLSearchParams): string {
  const runs = Number(params.get('runs') || 100);
  const options = simpleGameOptions();

  if (params.get('venus') === 'true') {
    options.venusNextExtension = true;
    options.includeVenusMA = true;
  }

  if (params.get('ares') === 'true') {
    options.aresExtension = true;
  }

  if (params.get('moon') === 'true') {
    options.moonExpansion = true;
  }
  if (params.get('fan-maps') === 'true') {
    options.includeFanMA = true;
  }

  const type = params.get('type');
  switch (type) {
  case 'NONE':
    options.randomMA = RandomMAOptionType.NONE;
    break;
  case 'LIMITED':
    options.randomMA = RandomMAOptionType.LIMITED;
    break;
  case 'FULL':
    options.randomMA = RandomMAOptionType.UNLIMITED;
    break;
  }
  const results = new MultiSet<string>();
  for (let nth = 1; nth <= runs; nth++) {
    if (nth % 100 === 0) {
      console.log(`#${nth}`);
    }
    try {
      const mas = chooseMilestonesAndAwards(options);
      mas.awards.forEach((award) => results.add(award.name));
      mas.milestones.forEach((milestone) => results.add(milestone.name));
    } catch (err) {
      console.log(err);
      results.add('ERROR');
    }
  }

  const copy: Array<[string, number]> = new Array(...results.multiplicities());
  copy.sort((a, b) => b[1] - a[1]);
  return 'name,count\n' + copy.map(([name, count]) => `${name},${count}`).join('\n');
}

function simpleGameOptions(): GameOptions {
  return {
    ...DEFAULT_GAME_OPTIONS,
    aresHazards: false,
    corporateEra: false,
    initialDraftVariant: false,
    showTimers: false,
    startingCorporations: 0,

    // The options that can change, should be parameters.
    boardName: BoardName.THARSIS,
    venusNextExtension: false,
    aresExtension: false,
    includeVenusMA: false,
    moonExpansion: false,
    pathfindersExpansion: false,
    includeFanMA: false,
    randomMA: RandomMAOptionType.NONE,
  };
}
