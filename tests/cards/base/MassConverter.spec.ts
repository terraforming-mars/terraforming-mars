import {expect} from 'chai';
import {MassConverter} from '../../../src/server/cards/base/MassConverter';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';

describe('MassConverter', function() {
  let card: MassConverter;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MassConverter();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    player.tagsForTest = {science: 4};
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can play', function() {
    player.tagsForTest = {science: 5};
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should play', function() {
    card.play(player);

    expect(player.production.energy).to.eq(6);
    expect(card.getCardDiscount(player, card)).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);

    const fake = fakeCard({tags: [Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE]});
    expect(card.getCardDiscount(player, fake)).eq(2);
  });
});
