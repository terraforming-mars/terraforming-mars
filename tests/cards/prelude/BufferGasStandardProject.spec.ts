import {expect} from 'chai';
import {BufferGasStandardProject} from '../../../src/server/cards/prelude/BufferGasStandardProject';
import {runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {testGame} from '../../TestGame';

describe('BufferGasStandardProject', function() {
  let card: BufferGasStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BufferGasStandardProject();
    [game, player] = testGame(1);
  });

  it('Can act', function() {
    player.stock.megacredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.stock.megacredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.stock.megacredits = card.cost;
    player.setTerraformRating(20);

    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Test reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    testRedsCosts(() => card.canAct(player), player, card.cost, 3, /* canAct= */ true);
  });
});
