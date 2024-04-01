import {CardName} from '../src/common/cards/CardName';
import {expect} from 'chai';
import {newCeo, newProjectCard} from '../src/server/CardFinder';

describe('CardFinder', function() {
  it('findProjectCard: success', function() {
    expect(newProjectCard(CardName.AI_CENTRAL)?.name).eq(CardName.AI_CENTRAL);
  });
  it('findProjectCard: failure', function() {
    expect(newProjectCard(CardName.ECOLINE)).is.undefined;
  });
  it('findProjectCard prelude: success', function() {
    expect(newProjectCard(CardName.ALLIED_BANK)?.name).eq(CardName.ALLIED_BANK);
  });
  it('findProjectCard ceo: success', function() {
    expect(newProjectCard(CardName.HAL9000)?.name).eq(CardName.HAL9000);
  });
  it('getCeoByName ceo: success', function() {
    expect(newCeo(CardName.HAL9000)?.name).eq(CardName.HAL9000);
  });

  // Don't remove this test. It's a placeholder for card renames.
  it('finds renamed cards', function() {
    // expect(findProjectCard('Designed Micr-organisms'as CardName)?.name).to.equal(CardName.DESIGNED_MICROORGANISMS);
    // expect(findProjectCard('Cryo Sleep' as CardName)?.name).to.equal(CardName.CRYO_SLEEP);
  });
});
