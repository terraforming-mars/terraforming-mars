import {expect} from 'chai';
import {BoardName} from '../../src/common/boards/BoardName';
import {ApiCreateGame} from '../../src/server/routes/ApiCreateGame';
import {MockRequest, MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';
import {NewGameConfig} from '../../src/common/game/NewGameConfig';
import {RandomBoardOption} from '../../src/common/boards/RandomBoardOption';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {SimpleGameModel} from '../../src/common/models/SimpleGameModel';
import {FakeClock} from '../common/FakeClock';

describe('ApiCreateGame', () => {
  let scaffolding: RouteTestScaffolding;
  let req: MockRequest;
  let res: MockResponse;
  let apiCreateGame: ApiCreateGame;

  beforeEach(() => {
    req = new MockRequest();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req);
    apiCreateGame = new ApiCreateGame([{limit: 99999, perMs: 1}]);
  });

  it('Official random boards do not include fan maps', () => {
    expect(ApiCreateGame.boardOptions(RandomBoardOption.OFFICIAL)).deep.eq([BoardName.THARSIS, BoardName.HELLAS, BoardName.ELYSIUM]);
  });
  it('Fully random boards do include fan maps', () => {
    expect(ApiCreateGame.boardOptions(RandomBoardOption.ALL)).deep.eq([
      BoardName.THARSIS,
      BoardName.HELLAS,
      BoardName.ELYSIUM,
      BoardName.UTOPIA_PLANITIA,
      BoardName.VASTITAS_BOREALIS_NOVA,
      BoardName.TERRA_CIMMERIA_NOVA,
      BoardName.ARABIA_TERRA,
      BoardName.VASTITAS_BOREALIS,
      BoardName.AMAZONIS,
      BoardName.TERRA_CIMMERIA,
      BoardName.HOLLANDIA,
    ]);
  });

  it('no get', async () => {
    await scaffolding.get(apiCreateGame, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('simple create', async () => {
    const post = scaffolding.post(apiCreateGame, res);
    const emit = Promise.resolve().then(() => {
      const newGameConfig: NewGameConfig = {
        players: [{
          name: 'Robot',
          color: 'blue',
          beginner: false,
          handicap: 0,
          first: true,
        }],
        expansions: {
          corpera: true,
          promo: false,
          venus: false,
          colonies: false,
          prelude: false,
          prelude2: false,
          turmoil: false,
          community: false,
          ares: false,
          moon: false,
          pathfinders: false,
          ceo: false,
          starwars: false,
          underworld: false,
          deltaProject: false,
        },
        board: RandomBoardOption.OFFICIAL,
        seed: 0,
        randomFirstPlayer: false,
        clonedGamedId: undefined,
        undoOption: false,
        showTimers: false,
        fastModeOption: false,
        showOtherPlayersVP: false,
        aresExtremeVariant: false,
        politicalAgendasExtension: 'Standard',
        solarPhaseOption: false,
        removeNegativeGlobalEventsOption: false,
        modularMA: false,
        draftVariant: false,
        initialDraft: false,
        preludeDraftVariant: false,
        ceosDraftVariant: false,
        startingCorporations: 0,
        shuffleMapOption: false,
        randomMA: RandomMAOptionType.NONE,
        includeFanMA: false,
        soloTR: false,
        customCorporationsList: [],
        bannedCards: [],
        includedCards: [],
        customColoniesList: [],
        customPreludes: [],
        requiresMoonTrackCompletion: false,
        requiresVenusTrackCompletion: false,
        moonStandardProjectVariant: false,
        moonStandardProjectVariant1: false,
        altVenusBoard: false,
        escapeVelocity: undefined,
        twoCorpsVariant: false,
        customCeos: [],
        startingCeos: 0,
        startingPreludes: 0,
      };
      req.emitter.emit('data', JSON.stringify(newGameConfig));
      req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));
    expect(res.statusCode).eq(statusCode.ok);
    expect(res.headers.get('Content-Type')).eq('application/json');
    const model = JSON.parse(res.content) as SimpleGameModel;
    expect(model.id).is.not.undefined;
    expect(model.id.startsWith('g')).is.true;
    const game = await scaffolding.ctx.gameLoader.getGame(model.id);
    expect(game).is.not.undefined;
    expect(game!.players[0].name).eq('Robot');
  });

  it('red rover solo game', async () => {
    const post = scaffolding.post(apiCreateGame, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emitter.emit('data', JSON.stringify({players: [{name: 'a player', color: 'red'}]}));
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    expect(res.statusCode).eq(statusCode.internalServerError);
  });

  // Issues one create-game POST against `handler`, using fresh request/response objects,
  // reusing `scaffolding.ctx` (and therefore its ip and clock) across calls.
  function postGame(handler: ApiCreateGame, request: MockRequest, response: MockResponse) {
    const post = handler.post(request, response, scaffolding.ctx);
    const emit = Promise.resolve().then(() => {
      request.emitter.emit('data', JSON.stringify({players: [{name: 'a player', color: 'red'}]}));
      request.emitter.emit('end');
    });
    return Promise.all([emit, post]);
  }

  it('a quota handler does not block while under its limit', async () => {
    const apiCreateGame = new ApiCreateGame([{limit: 1, perMs: 120_000}]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);
  });

  it('a quota handler blocks once its limit is exceeded', async () => {
    const apiCreateGame = new ApiCreateGame([{limit: 1, perMs: 120_000}]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);
    expect(res2.content).eq('Quota exceeded');
  });

  it('two quota handlers do not block while both are under their limits', async () => {
    const apiCreateGame = new ApiCreateGame([{limit: 99999, perMs: 1}, {limit: 99999, perMs: 1}]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);
  });

  it('two quota handlers block when the first exceeds its limit and the second does not', async () => {
    const apiCreateGame = new ApiCreateGame([{limit: 1, perMs: 120_000}, {limit: 99999, perMs: 1}]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);
    expect(res2.content).eq('Quota exceeded');
  });

  it('two quota handlers block when the first does not exceed its limit but the second does', async () => {
    const apiCreateGame = new ApiCreateGame([{limit: 99999, perMs: 1}, {limit: 1, perMs: 120_000}]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);
    expect(res2.content).eq('Quota exceeded');
  });

  it('elapsed time restores a blocked quota', async () => {
    const apiCreateGame = new ApiCreateGame([{limit: 1, perMs: 120_000}]);
    const clock = scaffolding.ctx.clock as FakeClock;

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);

    clock.millis += 120_001;

    const req3 = new MockRequest();
    const res3 = new MockResponse();
    await postGame(apiCreateGame, req3, res3);
    expect(res3.statusCode).not.eq(statusCode.tooManyRequests);
  });
});
