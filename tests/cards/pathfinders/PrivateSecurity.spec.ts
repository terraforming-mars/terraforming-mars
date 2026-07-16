import {expect} from 'chai';
import {PrivateSecurity} from '../../../src/server/cards/pathfinders/PrivateSecurity';
import {TestPlayer} from '../../TestPlayer';
import {Fish} from '../../../src/server/cards/base/Fish';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions, setTemperature} from '../../TestingUtils';

describe('PrivateSecurity', () => {
  let card: PrivateSecurity;
  let player: TestPlayer;
  let opponent1: TestPlayer;
  let opponent2: TestPlayer;

  beforeEach(() => {
    card = new PrivateSecurity();
    [/* game */, player, opponent1, opponent2] = testGame(3, {pathfindersExpansion: true});
  });

  it('protects against Fish', () => {
    opponent1.production.override({plants: 2});
    opponent2.production.override({plants: 4});

    const fish = new Fish();

    fish.play(player);
    const action = cast(player.game.deferredActions.pop()?.execute(), SelectPlayer);
    // Options for both opponents.
    expect(action.players).has.lengthOf(2);

    // Opponent 2 has Private Security
    opponent2.playedCards.push(card);
    fish.play(player);
    // Options for only one opponent.
    expect(player.game.deferredActions.pop()?.execute()).is.undefined;
    // And it's the one without Private Security.
    expect(opponent1.production.plants).to.eq(1);
  });

  it('Card cannot be played if the only opponent with production has Private Security', () => {
    opponent1.production.override({plants: 1});
    opponent2.production.override({plants: 0});

    const fish = new Fish();
    setTemperature(player.game, 2);

    expect(fish.canPlay(player)).is.true;
    opponent1.playedCards.push(card);
    expect(fish.canPlay(player)).is.false;
  });

  it('Card applies to you if you have production and Private Security', () => {
    // https://github.com/terraforming-mars/terraforming-mars/issues/4318
    player.production.override({plants: 1});
    opponent1.production.override({plants: 1});
    opponent2.production.override({plants: 1});

    const fish = new Fish();
    setTemperature(player.game, 2);

    player.playedCards.push(card);
    expect(fish.canPlay(player)).is.true;
    expect(fish.play(player)).is.undefined;

    runAllActions(player.game);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    expect(selectPlayer.players).includes(player);
  });
});
