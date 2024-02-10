import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {QuantumExtractor} from '../../../src/server/cards/base/QuantumExtractor';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {TestPlayer} from '../../TestPlayer';

describe('QuantumExtractor', function() {
  let card: QuantumExtractor;
  let player: TestPlayer;

  beforeEach(function() {
    card = new QuantumExtractor();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', function() {
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
