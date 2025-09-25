import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {QuantumExtractor} from '../../../src/server/cards/base/QuantumExtractor';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {TestPlayer} from '../../TestPlayer';

describe('QuantumExtractor', () => {
  let card: QuantumExtractor;
  let player: TestPlayer;

  beforeEach(() => {
    card = new QuantumExtractor();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    card.play(player);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
