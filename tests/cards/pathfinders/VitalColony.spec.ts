import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {VitalColony} from '../../../src/cards/pathfinders/VitalColony';
import {Player} from '../../../src/Player';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

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

    const buildColonyAction = game.deferredActions.pop()!.execute();

    expect(buildColonyAction).is.instanceOf(SelectColony);

    const selectColony = buildColonyAction as SelectColony;
    const colonyName = selectColony.colonies[0].name as ColonyName;

    expect(colonyName).eq(ColonyName.GANYMEDE);

    selectColony.cb(selectColony.colonies[0]);

    expect(player.getProduction(Resources.PLANTS)).eq(2);
  });
});
