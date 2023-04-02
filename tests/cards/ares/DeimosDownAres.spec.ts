import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {DeimosDownAres} from '../../../src/server/cards/ares/DeimosDownAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';

describe('DeimosDownAres', function() {
  let card: DeimosDownAres;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new DeimosDownAres();
    [game, player, player2] = testGame(2, ARES_OPTIONS_NO_HAZARDS);
  });

  // Identical to the Deimos Down Promo test
  it('Should play without plants', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    const input = player.game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  // Identical to the Deimos Down Promo test
  it('Can remove plants', function() {
    player2.plants = 5;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);

    expect(player.game.deferredActions).has.lengthOf(1);

    // Choose Remove 5 plants option
    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(player2.plants).to.eq(0);
  });

  // Identical to the Deimos Down Promo test
  it('Works fine in solo mode', function() {
    game = Game.newInstance('gameid', [player], player);

    player.plants = 15;
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);

    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
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
