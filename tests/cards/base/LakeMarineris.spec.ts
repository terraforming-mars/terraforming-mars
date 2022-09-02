import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {LakeMarineris} from '../../../src/server/cards/base/LakeMarineris';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';

describe('LakeMarineris', function() {
  let card: LakeMarineris;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new LakeMarineris();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -0;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(2);
    const firstOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    firstOcean.cb(firstOcean.availableSpaces[0]);
    const secondOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    secondOcean.cb(secondOcean.availableSpaces[1]);
    expect(player.getTerraformRating()).to.eq(22);

    expect(card.getVictoryPoints()).to.eq(2);
  });
});
