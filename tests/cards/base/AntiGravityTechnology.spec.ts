import {expect} from 'chai';
import {AntiGravityTechnology} from '../../../src/server/cards/base/AntiGravityTechnology';
import {TestPlayer} from '../../TestPlayer';

describe('AntiGravityTechnology', function() {
  let card: AntiGravityTechnology;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AntiGravityTechnology();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Cannot play', function() {
    player.tagsForTest = {science: 6};
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can play', function() {
    player.tagsForTest = {science: 7};
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(3);
    expect(card.getCardDiscount()).to.eq(2);
  });
});
