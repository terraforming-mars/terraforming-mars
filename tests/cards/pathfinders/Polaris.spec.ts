import {expect} from 'chai';
import {Polaris} from '../../../src/server/cards/pathfinders/Polaris';
import {Game} from '../../../src/server/Game';
import {addOcean, cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('Polaris', function() {
  let card: Polaris;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Polaris();
    [game, player, player2] = testGame(2);
    player.setCorporationForTest(card);
  });

  it('initial action', function() {
    player.deferInitialAction(card);
    runAllActions(game);
    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    const space = game.board.getSpace('06');

    expect(selectSpace.spaces).includes(space);

    selectSpace.cb(space);
    runAllActions(game);

    expect(space.tile?.tileType === TileType.OCEAN);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When anyone plays ocean tile', function() {
    addOcean(player2, '06');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When you play ocean tile', function() {
    addOcean(player, '06');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });
});

