import {expect} from 'chai';
import {ApiGame} from '../../src/server/routes/ApiGame';
import {Game} from '../../src/server/Game';
import {MockResponse} from './HttpMocks';
import {TestPlayer} from '../TestPlayer';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiGame', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('no parameter', async () => {
    scaffolding.url = '/api/game';
    await scaffolding.get(ApiGame.INSTANCE, res);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('invalid id', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.ctx.gameLoader.add(Game.newInstance('game-valid-id', [player], player));
    scaffolding.url = '/api/game?id=invalidId';
    await scaffolding.get(ApiGame.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: game not found');
  });

  it('valid id', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.ctx.gameLoader.add(Game.newInstance('game-valid-id', [player], player));
    scaffolding.url = '/api/game?id=game-valid-id';
    await scaffolding.get(ApiGame.INSTANCE, res);
    // This test is probably brittle.
    const json = JSON.parse(res.content);
    json.expectedPurgeTimeMs = -1;
    expect(json).deep.eq(
      {
        'activePlayer': 'black',
        'expectedPurgeTimeMs': -1,
        'id': 'game-valid-id',
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
          'bannedCards': [],
          'ceoExtension': false,
          'coloniesExtension': false,
          'communityCardsOption': false,
          'corporateEra': true,
          'draftVariant': false,
          'escapeVelocityMode': false,
          'escapeVelocityPenalty': 1,
          'escapeVelocityPeriod': 2,
          'escapeVelocityThreshold': 30,
          'escapeVelocityBonusSeconds': 2,
          'fastModeOption': false,
          'includeFanMA': false,
          'includeVenusMA': true,
          'initialDraftVariant': false,
          'moonExpansion': false,
          'pathfindersExpansion': false,
          'preludeExtension': false,
          'prelude2Expansion': false,
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
          'twoCorpsVariant': false,
          'underworldExpansion': false,
        },
      },
    );
  });
});
