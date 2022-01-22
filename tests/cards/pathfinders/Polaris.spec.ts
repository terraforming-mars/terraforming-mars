import {expect} from 'chai';
import {Polaris} from '../../../src/cards/pathfinders/Polaris';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame, getTestPlayer} from '../../TestGame';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
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
    player.corporationCard = card;
  });

  it('initial action', function() {
    card.initialAction(player);
    TestingUtils.runAllActions(game);
    const input = player.getWaitingFor();

    expect(input).instanceOf(SelectSpace);

    const space = game.board.getSpace('06');
    const selectSpace = input as SelectSpace;

    expect(selectSpace.availableSpaces).includes(space);

    selectSpace.cb(space);
    TestingUtils.runAllActions(game);

    expect(space.tile?.tileType === TileType.OCEAN);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When anyone plays ocean tile', function() {
    game.addOceanTile(player2, '06');
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.megaCredits).to.eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When you play ocean tile', function() {
    game.addOceanTile(player, '06');
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });
});

