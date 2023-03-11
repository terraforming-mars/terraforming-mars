import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {DeimosDownAres} from '../../../src/server/cards/ares/DeimosDownAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('DeimosDownAres', function() {
  let card: DeimosDownAres;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new DeimosDownAres();
    game = newTestGame(2, ARES_OPTIONS_NO_HAZARDS);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
  });

  it('Can remove plants', function() {
    player.plants = 0;
    player2.plants = 8;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);

    expect(player.game.deferredActions).has.lengthOf(1);

    // Choose Remove 6 plants option
    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(player2.plants).to.eq(2);
  });

  it('Adjacency bonus', function() {
    card.play(player);
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile && space.tile.tileType).to.eq(TileType.DEIMOS_DOWN);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.ASTEROID, SpaceBonus.STEEL]});
  });
});
