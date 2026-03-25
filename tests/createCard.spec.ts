import {CardName} from '../src/common/cards/CardName';
import {expect} from 'chai';
import {newCeo, newCorporationCard, newProjectCard} from '../src/server/createCard';

describe('createCard', () => {
  it('newProjectCard: success', () => {
    expect(newProjectCard(CardName.AI_CENTRAL)?.name).eq(CardName.AI_CENTRAL);
  });
  it('newProjectCard: failure', () => {
    expect(newProjectCard(CardName.ECOLINE)).is.undefined;
  });
  it('newProjectCard prelude: success', () => {
    expect(newProjectCard(CardName.ALLIED_BANK)?.name).eq(CardName.ALLIED_BANK);
  });
  it('newProjectCard ceo: success', () => {
    expect(newProjectCard(CardName.HAL9000)?.name).eq(CardName.HAL9000);
  });
  it('newCeo: success', () => {
    expect(newCeo(CardName.HAL9000)?.name).eq(CardName.HAL9000);
  });

  // Don't remove this test. It's a placeholder for card renames.
  it('finds renamed cards', () => {
    // expect(newProjectCard('Designed Micr-organisms'as CardName)?.name).to.equal(CardName.DESIGNED_MICROORGANISMS);
    // expect(newProjectCard('Cryo Sleep' as CardName)?.name).to.equal(CardName.CRYO_SLEEP);
    // expect(newProjectCard('City Park' as CardName)?.name).to.equal(CardName.CITY_PARKS);

    // #2839: Fix card names to match printed English versions
    expect(newCorporationCard('Thorgate' as CardName)?.name).to.equal(CardName.THORGATE);
    expect(newCorporationCard('Terralabs Research' as CardName)?.name).to.equal(CardName.TERRALABS_RESEARCH);
    expect(newCorporationCard('Astrodrill' as CardName)?.name).to.equal(CardName.ASTRODRILL);
    expect(newCorporationCard('EcoLine' as CardName)?.name).to.equal(CardName.ECOLINE);
  });
});
