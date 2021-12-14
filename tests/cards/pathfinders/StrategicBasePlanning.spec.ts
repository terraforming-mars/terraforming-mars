import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {StrategicBasePlanning} from '../../../src/cards/pathfinders/StrategicBasePlanning';
import {Player} from '../../../src/Player';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/TileType';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Game} from '../../../src/Game';

describe('StrategicBasePlanning', function() {
  let card: StrategicBasePlanning;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new StrategicBasePlanning();
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
    game.deferredActions.pop();

    player.megaCredits = 100;
    card.play(player);
    expect(player.megaCredits).to.eq(92);

    // Expecting build colony before place city
    const buildColonyAction = game.deferredActions.pop()!.execute();

    expect(buildColonyAction).is.instanceOf(SelectColony);
    const selectColony = buildColonyAction as SelectColony;
    const colony = selectColony.colonies[0];
    expect(colony.colonies).is.empty;

    selectColony.cb(colony);

    expect(colony.colonies).deep.eq([player.id]);

    // Place city comes next
    const placeCityAction = game.deferredActions.pop()!.execute();

    expect(placeCityAction).is.instanceOf(SelectSpace);
    const selectSpace = placeCityAction as SelectSpace;
    const space = selectSpace.availableSpaces[0];
    expect(space.tile).is.undefined;

    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
  });
});
