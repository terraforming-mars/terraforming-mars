require('dotenv').config();

import * as http from 'http';
import * as fs from 'fs';
import {MilestoneAwardSelector} from '../MilestoneAwardSelector';
import {GameOptions} from '../Game';
import {BoardName} from '../boards/BoardName';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {Multiset} from '../utils/Multiset';

function processRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url === undefined) {
    return;
  }
  const url = new URL(req.url, `http://localhost`);
  if (url.pathname === '/') {
    fs.readFile('src/tools/analyze_ma.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.write('Internal server error ' + err);
        res.end();
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
    res.writeHead(404);
    res.write('Not found');
    res.end();
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
  const results: Multiset<string> = new Multiset();
  for (let nth = 1; nth <= runs; nth++) {
    if (nth % 100 === 0) {
      console.log(`#${nth}`);
    }
    try {
      const mas = MilestoneAwardSelector.chooseMilestonesAndAwards(options);
      mas.awards.forEach((award) => results.add(award.name));
      mas.milestones.forEach((milestone) => results.add(milestone.name));
    } catch (err) {
      console.log(err);
      results.add('ERROR');
    }
  }

  const copy = new Array(...results.entries());
  copy.sort((a, b) => b[1] - a[1]);
  return 'name,count\n' + copy.map(([name, count]) => `${name},${count}`).join('\n');
}

function simpleGameOptions(): GameOptions {
  return {
    clonedGamedId: undefined,
    undoOption: false,
    showTimers: false,
    fastModeOption: false,
    showOtherPlayersVP: false,
    corporateEra: false,
    coloniesExtension: false,
    preludeExtension: false,
    turmoilExtension: false,
    promoCardsOption: false,
    communityCardsOption: false,
    aresHazards: false,
    politicalAgendasExtension: AgendaStyle.STANDARD,
    solarPhaseOption: false,
    removeNegativeGlobalEventsOption: false,
    draftVariant: false,
    initialDraftVariant: false,
    startingCorporations: 0,
    shuffleMapOption: false,
    soloTR: false,
    customCorporationsList: [],
    cardsBlackList: [],
    customColoniesList: [],
    requiresVenusTrackCompletion: false, // Venus must be completed to end the game
    requiresMoonTrackCompletion: false, // Moon must be completed to end the game
    moonStandardProjectVariant: false,
    altVenusBoard: false,
    escapeVelocityMode: false,
    escapeVelocityThreshold: undefined,
    escapeVelocityPeriod: undefined,
    escapeVelocityPenalty: undefined,

    // The options that can change, should be parameters.
    boardName: BoardName.ORIGINAL,
    venusNextExtension: false,
    aresExtension: false,
    includeVenusMA: false,
    moonExpansion: false,
    pathfindersExpansion: false,
    randomMA: RandomMAOptionType.NONE,
  };
}
