import {expect} from 'chai';
import {PrivateSecurity} from '../../../src/cards/pathfinders/PrivateSecurity';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Fish} from '../../../src/cards/base/Fish';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Resources} from '../../../src/Resources';

describe('PrivateSecurity', function() {
  let card: PrivateSecurity;
  let player: TestPlayer;
  let opponent1: TestPlayer;
  let opponent2: TestPlayer;

  beforeEach(function() {
    card = new PrivateSecurity();
    player = TestPlayers.BLUE.newPlayer();
    opponent1 = TestPlayers.RED.newPlayer();
    opponent2 = TestPlayers.GREEN.newPlayer();
    Game.newInstance('id', [player, opponent1, opponent2], player);
  });

  it('protects against Fish', function() {
    opponent1.setProductionForTest({plants: 2});
    opponent2.setProductionForTest({plants: 4});

    const fish = new Fish();

    opponent2.playedCards = [];
    fish.play(player);
    let action = player.game.deferredActions.pop()?.execute()! as SelectPlayer;
    // Options for both opponents.
    expect(action.players).has.lengthOf(2);

    // Opponent 2 has Private Security
    opponent2.playedCards = [card];
    fish.play(player);
    action = player.game.deferredActions.pop()?.execute()! as SelectPlayer;
    // Options for only one opponent.
    expect(action).is.undefined;
    // And it's the one without Private Security.
    expect(opponent1.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
