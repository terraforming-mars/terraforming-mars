import {expect} from 'chai';
import {SelectPartyToSendDelegate} from '../../src/server/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../src/common/turmoil/PartyName';

describe('SelectPartyToSendDelegate', function() {
  let selected: PartyName | undefined;
  const cb = (cards: PartyName) => {
    selected = cards;
    return undefined;
  };

  beforeEach(() => {
    selected = undefined;
  });

  it('Simple', function() {
    const selectPartyToSendDelegate = new SelectPartyToSendDelegate(
      '', '', [PartyName.GREENS, PartyName.KELVINISTS], cb);

    selectPartyToSendDelegate.process({type: 'party', partyName: PartyName.GREENS});
    expect(selected).eq(PartyName.GREENS);

    selectPartyToSendDelegate.process({type: 'party', partyName: PartyName.KELVINISTS});
    expect(selected).eq(PartyName.KELVINISTS);
  });

  it('Cannot select unavailable party', function() {
    const selectPartyToSendDelegate = new SelectPartyToSendDelegate(
      '', '', [PartyName.GREENS, PartyName.KELVINISTS], cb);

    expect(() => selectPartyToSendDelegate.process({type: 'party', partyName: PartyName.SCIENTISTS}))
      .to.throw(Error, /Invalid party selected/);
  });
});
