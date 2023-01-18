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
    expect(new CardFinder().getProjectCardByName(CardName.ALLIED_BANK)?.name).eq(CardName.ALLIED_BANK);
  });
  // Dont' remove this test. It's a placeholder for card renames.
  it('finds renamed cards', function() {
    // expect(new CardFinder().getProjectCardByName('Designed Micr-organisms'as CardName)?.name).to.equal(CardName.DESIGNED_MICROORGANISMS);
    // expect(new CardFinder().getProjectCardByName('Cryo Sleep' as CardName)?.name).to.equal(CardName.CRYO_SLEEP);
  });
});
