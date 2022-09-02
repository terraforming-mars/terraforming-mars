import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {VitalColony} from '../../../src/server/cards/pathfinders/VitalColony';
import {Player} from '../../../src/server/Player';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/server/Game';
import {cast} from '../../TestingUtils';

describe('VitalColony', function() {
  let card: VitalColony;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new VitalColony();
    // 2 players to remove an early-game solo action in the deferred actions queue.
    game = newTestGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        // The important thing is that Europa is absent.
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.TITAN,
        ColonyName.TRITON],
    });
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);

    const selectColony = cast(game.deferredActions.pop()!.execute(), SelectColony);
    const colonyName = selectColony.colonies[0].name;

    expect(colonyName).eq(ColonyName.GANYMEDE);

    selectColony.cb(selectColony.colonies[0]);

    expect(player.production.plants).eq(2);
  });
});
