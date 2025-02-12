import {expect} from 'chai';
import {ApiCreateGame} from '../../src/server/routes/ApiCreateGame';
import {MockRequest, MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';
import {NewGameConfig} from '../../src/common/game/NewGameConfig';
import {RandomBoardOption} from '../../src/common/boards/RandomBoardOption';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {AgendaStyle} from '../../src/common/turmoil/Types';
import {Color} from '../../src/common/Color';
import {SimpleGameModel} from '../../src/common/models/SimpleGameModel';

describe('ApiCreateGame', () => {
  let scaffolding: RouteTestScaffolding;
  let req: MockRequest;
  let res: MockResponse;

  beforeEach(() => {
    req = new MockRequest();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req);
  });

  it('no get', async () => {
    await scaffolding.get(ApiCreateGame.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('simple create', async () => {
    const put = scaffolding.put(ApiCreateGame.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      const newGameConfig: NewGameConfig = {
        players: [{
          name: 'Robot',
          color: Color.BLUE,
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
        politicalAgendasExtension: AgendaStyle.STANDARD,
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
});
