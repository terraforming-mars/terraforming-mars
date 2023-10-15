import {CardName} from '../src/common/cards/CardName';
import {expect} from 'chai';
import {CardFinder} from '../src/server/CardFinder';

describe('CardFinder', function() {
  it('getProjectCardByName: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.AI_CENTRAL)?.name).eq(CardName.AI_CENTRAL);
  });
  it('getProjectCardByName: failure', function() {
    expect(new CardFinder().getProjectCardByName(CardName.ECOLINE)).is.undefined;
  });
  it('getProjectCardByName prelude: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.ALLIED_BANK)?.name).eq(CardName.ALLIED_BANK);
  });
  it('getProjectCardByName ceo: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.HAL9000)?.name).eq(CardName.HAL9000);
  });
  it('getCeoByName ceo: success', function() {
    expect(new CardFinder().getCeoByName(CardName.HAL9000)?.name).eq(CardName.HAL9000);
  });
  // Dont' remove this test. It's a placeholder for card renames.
  it('finds renamed cards', function() {
    // expect(new CardFinder().getProjectCardByName('Designed Micr-organisms'as CardName)?.name).to.equal(CardName.DESIGNED_MICROORGANISMS);
    // expect(new CardFinder().getProjectCardByName('Cryo Sleep' as CardName)?.name).to.equal(CardName.CRYO_SLEEP);
  });
});
