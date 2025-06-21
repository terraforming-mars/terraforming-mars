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
import {RecursivePartial} from '../../src/common/utils/utils';

describe('ApiCreateGame', () => {
  let scaffolding: RouteTestScaffolding;
  let req: MockRequest;
  let res: MockResponse;
  let apiCreateGame: ApiCreateGame;

  beforeEach(() => {
    req = new MockRequest();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req);
    apiCreateGame = new ApiCreateGame({limit: 99999, perMs: 1});
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
      BoardName.VASTITAS_BOREALIS_NOVUS,
      BoardName.TERRA_CIMMERIA_NOVUS,
      BoardName.ARABIA_TERRA,
      BoardName.VASTITAS_BOREALIS,
      BoardName.AMAZONIS,
      BoardName.TERRA_CIMMERIA,
    ]);
  });

  it('no get', async () => {
    await scaffolding.get(apiCreateGame, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('simple create', async () => {
    const put = scaffolding.put(apiCreateGame, res);
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
        escapeVelocityMode: false,
        escapeVelocityThreshold: undefined,
        escapeVelocityBonusSeconds: undefined,
        escapeVelocityPeriod: undefined,
        escapeVelocityPenalty: undefined,
        twoCorpsVariant: false,
        customCeos: [],
        startingCeos: 0,
        startingPreludes: 0,
      };
      req.emitter.emit('data', JSON.stringify(newGameConfig));
      req.emitter.emit('end');
    });
    await Promise.all(([emit, put]));
    expect(res.statusCode).eq(statusCode.ok);
    expect(res.headers.get('Content-Type')).eq('application/json');
    const model = JSON.parse(res.content) as SimpleGameModel;
    expect(model.id).is.not.undefined;
    expect(model.id.startsWith('g')).is.true;
    const game = await scaffolding.ctx.gameLoader.getGame(model.id);
    expect(game).is.not.undefined;
    expect(game!.getPlayers()[0].name).eq('Robot');
  });


  async function create(data: RecursivePartial<NewGameConfig>) {
    const put = scaffolding.put(apiCreateGame, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emitter.emit('data', JSON.stringify(data));
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, put]));
  }

  it('red rover solo game', async () => {
    await create({players: [{name: 'a player', color: 'red'}]});

    expect(res.statusCode).eq(statusCode.internalServerError);
  });
});
