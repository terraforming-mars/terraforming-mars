import {expect} from 'chai';

import {CardName} from '../../src/CardName';
import {CardType} from '../../src/cards/CardType';
import {Helion} from '../../src/cards/corporation/Helion';
import {Inventrix} from '../../src/cards/corporation/Inventrix';
import {Tags} from '../../src/cards/Tags';

describe('Card', function() {
  it('pulls values for typical corporation', function() {
    const card = new Helion();
    expect(card.cardType).to.eq(CardType.CORPORATION);
    expect(card.initialActionText).is.undefined;
    expect(card.startingMegaCredits).to.eq(42);
    expect(card.metadata).not.is.undefined;
    expect(card.name).to.eq(CardName.HELION);
    expect(card.tags).to.deep.eq([Tags.SPACE]);
  });
  it('pulls initialActionText', function() {
    const card = new Inventrix();
    expect(card.initialActionText).to.eq('Draw 3 cards');
  });
});
