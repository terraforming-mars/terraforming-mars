import {expect} from 'chai';
import {LakeMarineris} from '../../../src/cards/base/LakeMarineris';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('LakeMarineris', function() {
  let card : LakeMarineris; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new LakeMarineris();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -0;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(2);
    const firstOcean = game.deferredActions.pop()!.execute() as SelectSpace;
    firstOcean.cb(firstOcean.availableSpaces[0]);
    const secondOcean = game.deferredActions.pop()!.execute() as SelectSpace;
    secondOcean.cb(secondOcean.availableSpaces[1]);
    expect(player.getTerraformRating()).to.eq(22);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
