import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {DuskLaserMining} from '../../../src/cards/promo/DuskLaserMining';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('DuskLaserMining', function() {
  let card : DuskLaserMining; let player : Player;

  beforeEach(function() {
    card = new DuskLaserMining();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play if not enough science tags', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play if no energy production', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
