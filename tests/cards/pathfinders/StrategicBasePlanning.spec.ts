import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {StrategicBasePlanning} from '../../../src/server/cards/pathfinders/StrategicBasePlanning';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('StrategicBasePlanning', function() {
  let card: StrategicBasePlanning;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new StrategicBasePlanning();
    // 2 players to remove an early-game solo action in the deferred actions queue.
    [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        // The important thing is that Europa is absent.
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.TITAN,
        ColonyName.TRITON],
    });
  });

  it('Should play', function() {
    game.deferredActions.pop();

    player.megaCredits = 100;
    card.play(player);
    expect(player.megaCredits).to.eq(92);

    // Expecting build colony before place city
    UnderworldTestHelper.assertBuildColony(player, game.deferredActions.pop()!.execute());
    UnderworldTestHelper.assertPlaceCity(player, game.deferredActions.pop()!.execute());
  });
});
