import {expect} from 'chai';
import {SendDelegateToArea} from '../../src/server/deferredActions/SendDelegateToArea';
import {SelectParty} from '../../src/server/inputs/SelectParty';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {testGame} from '../TestGame';
import {cast} from '../../src/common/utils/utils';

describe('SendDelegateToArea', () => {
  it('sends and counts only the delegates in reserve', () => {
    const [game, player] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);
    while (turmoil.getAvailableDelegateCount(player) > 1) {
      turmoil.delegateReserve.remove(player);
    }

    cast(new SendDelegateToArea(player, undefined, {count: 2}).execute(), SelectParty).cb(PartyName.GREENS);

    expect(turmoil.getPartyByName(PartyName.GREENS).delegates.get(player)).eq(1);
    expect(player.totalDelegatesPlaced).eq(1);
  });
});
