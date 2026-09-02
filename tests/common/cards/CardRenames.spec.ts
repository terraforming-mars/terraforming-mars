import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {CARD_RENAMES, resolveCardName} from '../../../src/common/cards/CardRenames';

describe('CardRenames', () => {
  it('resolveCardName returns the canonical name for a renamed card', () => {
    // #2839: Fix card names to match printed English versions
    expect(resolveCardName('Thorgate' as CardName)).to.equal(CardName.THORGATE);
    expect(resolveCardName('Terralabs Research' as CardName)).to.equal(CardName.TERRALABS_RESEARCH);
    expect(resolveCardName('Astrodrill' as CardName)).to.equal(CardName.ASTRODRILL);
    expect(resolveCardName('EcoLine' as CardName)).to.equal(CardName.ECOLINE);
    expect(resolveCardName('Colony' as CardName)).to.equal(CardName.BUILD_COLONY_STANDARD_PROJECT);
  });

  it('resolveCardName returns the input unchanged for a canonical name', () => {
    expect(resolveCardName(CardName.THORGATE)).to.equal(CardName.THORGATE);
    expect(resolveCardName(CardName.ECOLINE)).to.equal(CardName.ECOLINE);
  });

  it('CARD_RENAMES values are all valid CardNames', () => {
    const validNames = new Set<string>(Object.values(CardName));
    for (const [_old, canonical] of CARD_RENAMES) {
      expect(validNames.has(canonical), `${canonical} is not a valid CardName`).to.be.true;
    }
  });
});
