import {expect} from 'chai';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {SelectParty} from '../../src/server/inputs/SelectParty';
import {cast} from '../TestingUtils';
import {IPlayer} from '../../src/server/IPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';

export function assertAddDelegateAction(player: IPlayer, action: PlayerInput | undefined, count: number = 1) {
  const selectParty = cast(action, SelectParty);
  const turmoil = Turmoil.getTurmoil(player.game);
  const marsFirst = turmoil.getPartyByName(PartyName.MARS);

  const delegatesInReserve = turmoil.getAvailableDelegateCount(player);
  const delegatesInParty = marsFirst.delegates.get(player);

  selectParty.cb(marsFirst.name);

  expect(turmoil.getAvailableDelegateCount(player)).eq(delegatesInReserve - count);
  expect(marsFirst.delegates.get(player)).eq(delegatesInParty + count);
}
