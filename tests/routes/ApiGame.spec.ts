import * as http from 'http';
import {expect} from 'chai';
import {ApiGame} from '../../src/routes/ApiGame';
import {Route} from '../../src/routes/Route';
import {Game} from '../../src/Game';
import {FakeGameLoader} from './FakeGameLoader';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {TestPlayers} from '../TestPlayers';

describe('ApiGame', () => {
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;

  // Strictly speaking |parameters| can also accept a fragment.
  const setRequest = function(parameters: string) {
    req.url = parameters;
    ctx.url = new URL('http://boo.com' + parameters);
  };

  beforeEach(() => {
    req = {} as http.IncomingMessage;
    res = new MockResponse();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });

  it('no parameter', () => {
    setRequest('/api/game');
    ApiGame.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: id parameter missing');
  });

  it('invalid id', () => {
    const player = TestPlayers.BLACK.newPlayer();
    ctx.gameLoader.add(Game.newInstance('validId', [player], player));
    setRequest('/api/game?id=invalidId');
    ApiGame.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: game not found');
  });

  it('valid id', () => {
    const player = TestPlayers.BLACK.newPlayer();
    ctx.gameLoader.add(Game.newInstance('validId', [player], player));
    setRequest('/api/game?id=validId');
    ApiGame.INSTANCE.get(req, res.hide(), ctx);
    // This test is probably brittle.
    expect(JSON.parse(res.content)).deep.eq(
      {
        'activePlayer': 'black',
        'id': 'validId',
        'lastSoloGeneration': 14,
        'phase': 'research',
        'players': [
          {
            'color': 'black',
            'id': 'p-black-id',
            'name': 'player-black',
          },
        ],
        'gameOptions': {
          'altVenusBoard': false,
          'aresExtension': false,
          'boardName': 'tharsis',
          'cardsBlackList': [],
          'coloniesExtension': false,
          'communityCardsOption': false,
          'corporateEra': true,
          'draftVariant': false,
          'escapeVelocityMode': false,
          'escapeVelocityPenalty': 1,
          'escapeVelocityPeriod': 2,
          'escapeVelocityThreshold': 30,
          'fastModeOption': false,
          'includeVenusMA': true,
          'initialDraftVariant': false,
          'moonExpansion': false,
          'pathfindersExpansion': false,
          'preludeExtension': false,
          'promoCardsOption': false,
          'politicalAgendasExtension': 'Standard',
          'removeNegativeGlobalEvents': false,
          'requiresMoonTrackCompletion': false,
          'requiresVenusTrackCompletion': false,
          'showOtherPlayersVP': false,
          'showTimers': true,
          'shuffleMapOption': false,
          'solarPhaseOption': false,
          'soloTR': false,
          'randomMA': 'No randomization',
          'turmoilExtension': false,
          'undoOption': false,
          'venusNextExtension': false,
        },
      },
    );
  });
});
