import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {DuskLaserMining} from '../../../src/server/cards/promo/DuskLaserMining';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('DuskLaserMining', function() {
  let card: DuskLaserMining;
  let player: Player;

  beforeEach(function() {
    card = new DuskLaserMining();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can not play if not enough science tags', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if no energy production', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    player.production.add(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.titanium).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
