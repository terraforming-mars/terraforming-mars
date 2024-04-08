import {expect} from 'chai';
import {FreeTradePort} from '../../../src/server/cards/underworld/FreeTradePort';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

describe('FreeTradePort', () => {
  it('play', () => {
    const card = new FreeTradePort();
    // 2 players to remove an early-game solo action in the deferred actions queue.
    const [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        // The important thing is that Europa is absent.
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.TITAN,
        ColonyName.TRITON],
    });

    expect(player.underworldData.corruption).eq(0);

    cast(card.play(player), undefined);
    runAllActions(game);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const colony = selectColony.colonies[0];
    expect(colony.colonies).is.empty;

    selectColony.cb(colony);

    expect(player.underworldData.corruption).eq(1);
    expect(colony.colonies).deep.eq([player.id]);
  });
});
