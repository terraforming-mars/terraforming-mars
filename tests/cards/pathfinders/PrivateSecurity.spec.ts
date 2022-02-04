import {expect} from 'chai';
import {PrivateSecurity} from '../../../src/cards/pathfinders/PrivateSecurity';
import {TestPlayer} from '../../TestPlayer';
import {Fish} from '../../../src/cards/base/Fish';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Resources} from '../../../src/common/Resources';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PrivateSecurity', function() {
  let card: PrivateSecurity;
  let player: TestPlayer;
  let opponent1: TestPlayer;
  let opponent2: TestPlayer;

  beforeEach(function() {
    card = new PrivateSecurity();
    const game = newTestGame(3, {pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    opponent1 = getTestPlayer(game, 1);
    opponent2 = getTestPlayer(game, 2);
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

  it('Card cannot be played if the only opponent with production has Private Security', () => {
    opponent1.setProductionForTest({plants: 1});
    opponent2.setProductionForTest({plants: 0});

    const fish = new Fish();

    opponent2.playedCards = [];
    expect(fish.canPlay(player)).is.true;
    opponent1.playedCards = [card];
    expect(fish.canPlay(player)).is.false;
  });
});
