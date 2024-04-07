import {expect} from 'chai';
import {GameHandler} from '../../src/server/routes/Game';
import {BoardName} from '../../src/common/boards/BoardName';
import {RandomBoardOption} from '../../src/common/boards/RandomBoardOption';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';
// import {isGameId, isPlayerId, isSpectatorId} from '../../src/common/Types';

describe('GameHandler', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('Official random boards do not include fan maps', () => {
    expect(GameHandler.boardOptions(RandomBoardOption.OFFICIAL)).deep.eq([BoardName.THARSIS, BoardName.HELLAS, BoardName.ELYSIUM]);
  });
  it('Fully random boards do include fan maps', () => {
    expect(GameHandler.boardOptions(RandomBoardOption.ALL)).deep.eq([
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

  // TODO make data type RecursivePartial<NewGameConfig>
  async function create(data: any) {
    scaffolding.url='/game';
    const put = scaffolding.put(GameHandler.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emitter.emit('data', JSON.stringify(data));
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, put]));
  }

  it('red rover solo game', async () => {
    await create({players: [{name: 'a player', color: 'red'}]});

    expect(res.statusCode).eq(statusCode.internalServerError);

    // expect(res.statusCode).eq(statusCode.ok);

    // const game = JSON.parse(res.content);

    // expect(isGameId(game.id)).is.true;
    // expect(isSpectatorId(game.spectatorId)).is.true;
    // expect(game.activePlayer).eq('red');
    // expect(game.players).has.length(1);
    // expect(isPlayerId(game.players[0].id)).is.true;
    // expect(game.players[0].color).eq('red');
    // expect(game.players[0].name).eq('a player');
  });
});
