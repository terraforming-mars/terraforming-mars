import {CardName} from '../src/common/cards/CardName';
import {expect} from 'chai';
import {CardFinder} from '../src/server/CardFinder';

describe('CardFinder', function() {
  it('findProjectCardByName: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.AI_CENTRAL)?.name).eq(CardName.AI_CENTRAL);
  });
  it('findProjectCardByName: failure', function() {
    expect(new CardFinder().getProjectCardByName(CardName.ECOLINE)).is.undefined;
  });
  it('findProjectCardByName prelude: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.ALLIED_BANKS)?.name).eq(CardName.ALLIED_BANKS);
  });
  // Dont' remove this test. It's a placeholder for card renames.
  it('finds renamed cards', function() {
    // expect(new CardFinder().getProjectCardByName('Earth Embasy' as CardName)?.name).to.equal(CardName.EARTH_EMBASSY);
  });
});
