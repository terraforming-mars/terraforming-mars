import {CardName} from '../src/common/cards/CardName';
import {expect} from 'chai';
import {CardFinder} from '../src/CardFinder';

describe('CardFinder', function() {
  it('findProjectCardByName: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.AI_CENTRAL)).is.not.undefined;
  });
  it('findProjectCardByName: failure', function() {
    expect(new CardFinder().getProjectCardByName(CardName.ECOLINE)).is.undefined;
  });
  it('findProjectCardByName prelude: success', function() {
    expect(new CardFinder().getProjectCardByName(CardName.ALLIED_BANKS)).is.not.undefined;
  });
});
