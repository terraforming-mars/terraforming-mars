import {expect} from 'chai';
import {BASE_BONUS_CARDS, BonusCardId} from '../../src/common/automa/AutomaTypes';
import {bonusCard, createBaseBonusCards} from '../../src/server/automa/MarsBotBonusCard';

describe('MarsBotBonusCard', () => {
  it('bonusCard creates a card that is not destroyed', () => {
    const card = bonusCard(BonusCardId.B01_METEOR_SHOWER, 'Meteor Shower');
    expect(card.id).to.eq(BonusCardId.B01_METEOR_SHOWER);
    expect(card.name).to.eq('Meteor Shower');
    expect(card.destroyed).is.false;
  });

  it('createBaseBonusCards matches BASE_BONUS_CARDS', () => {
    const cards = createBaseBonusCards();
    expect(cards.map((card) => card.id)).to.deep.eq([...BASE_BONUS_CARDS]);
    expect(cards.every((card) => card.destroyed === false)).is.true;
  });

  it('base bonus cards have unique names', () => {
    const names = createBaseBonusCards().map((card) => card.name);
    expect(new Set(names).size).to.eq(names.length);
  });
});
