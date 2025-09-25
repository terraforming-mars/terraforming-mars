import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {VitalColony} from '../../../src/server/cards/pathfinders/VitalColony';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {IGame} from '../../../src/server/IGame';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('VitalColony', () => {
  let card: VitalColony;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VitalColony();
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

  it('Should play', () => {
    card.play(player);

    const selectColony = cast(game.deferredActions.pop()!.execute(), SelectColony);
    const colonyName = selectColony.colonies[0].name;

    expect(colonyName).eq(ColonyName.GANYMEDE);

    selectColony.cb(selectColony.colonies[0]);

    expect(player.production.plants).eq(2);
  });
});
