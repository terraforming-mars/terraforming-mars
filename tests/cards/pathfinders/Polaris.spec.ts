import {expect} from 'chai';
import {Polaris} from '../../../src/server/cards/pathfinders/Polaris';
import {Game} from '../../../src/server/Game';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame, getTestPlayer} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('Polaris', function() {
  let card: Polaris;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Polaris();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.setCorporationForTest(card);
  });

  it('initial action', function() {
    card.initialAction(player);
    runAllActions(game);
    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    const space = game.board.getSpace('06');

    expect(selectSpace.availableSpaces).includes(space);

    selectSpace.cb(space);
    runAllActions(game);

    expect(space.tile?.tileType === TileType.OCEAN);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When anyone plays ocean tile', function() {
    game.addOceanTile(player2, '06');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When you play ocean tile', function() {
    game.addOceanTile(player, '06');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });
});

