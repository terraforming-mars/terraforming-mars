import {expect} from 'chai';
import {AntiGravityTechnology} from '../../../src/server/cards/base/AntiGravityTechnology';
import {TestPlayer} from '../../TestPlayer';

describe('AntiGravityTechnology', () => {
  let card: AntiGravityTechnology;
  let player: TestPlayer;

  beforeEach(() => {
    card = new AntiGravityTechnology();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Cannot play', () => {
    player.tagsForTest = {science: 6};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.tagsForTest = {science: 7};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(3);
    expect(card.getCardDiscount()).to.eq(2);
  });
});
