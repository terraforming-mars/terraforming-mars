import {expect} from 'chai';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {SelectParty} from '../../src/server//inputs/SelectParty';
import {cast} from '../TestingUtils';
import {IPlayer} from '../../src/server/IPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';

export function assertAddDelegateAction(player: IPlayer, action: PlayerInput | undefined, count: number = 1) {
  const selectParty = cast(action, SelectParty);
  const turmoil = Turmoil.getTurmoil(player.game);
  const marsFirst = turmoil.getPartyByName(PartyName.MARS);

  expect(turmoil.getAvailableDelegateCount(player)).eq(7);
  expect(marsFirst.delegates.get(player)).eq(0);

  selectParty.cb(marsFirst.name);

  expect(turmoil.getAvailableDelegateCount(player)).eq(7 - count);
  expect(marsFirst.delegates.get(player)).eq(count);
}
