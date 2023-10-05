import {expect} from 'chai';
import {SelectParty} from '../../src/server/inputs/SelectParty';
import {PartyName} from '../../src/common/turmoil/PartyName';

describe('SelectParty', function() {
  let selected: PartyName | undefined;
  const cb = (cards: PartyName) => {
    selected = cards;
    return undefined;
  };

  beforeEach(() => {
    selected = undefined;
  });

  it('Simple', function() {
    const selectParty = new SelectParty('', '', [PartyName.GREENS, PartyName.KELVINISTS]).andThen(cb);

    selectParty.process({type: 'party', partyName: PartyName.GREENS});
    expect(selected).eq(PartyName.GREENS);

    selectParty.process({type: 'party', partyName: PartyName.KELVINISTS});
    expect(selected).eq(PartyName.KELVINISTS);
  });

  it('Cannot select unavailable party', function() {
    const selectParty = new SelectParty('', '', [PartyName.GREENS, PartyName.KELVINISTS]).andThen(cb);

    expect(() => selectParty.process({type: 'party', partyName: PartyName.SCIENTISTS}))
      .to.throw(Error, /Invalid party selected/);
  });
});
