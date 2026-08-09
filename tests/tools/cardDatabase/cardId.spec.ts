import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {cardId} from '@/server/tools/cardDatabase/cardId';

describe('cardId', () => {
  it('lowercases and underscores a plain name', () => {
    expect(cardId(CardName.AI_CENTRAL)).eq('ai_central');
  });

  it('collapses runs of punctuation and whitespace into a single underscore', () => {
    expect(cardId(CardName.POWER_PLANT_STANDARD_PROJECT)).eq('power_plant_sp');
  });

  it('does not leave leading or trailing underscores', () => {
    expect(cardId(CardName.UNMI_CONTRACTOR)).eq('unmi_contractor');
    expect(cardId(CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT)).eq('air_scrapping_var');
  });

  it('preserves digits', () => {
    expect(cardId(CardName.SEARCH_FOR_LIFE)).eq('search_for_life');
  });
});
