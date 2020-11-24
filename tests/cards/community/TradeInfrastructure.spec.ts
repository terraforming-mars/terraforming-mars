import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TradeInfrastructure} from '../../../src/cards/community/preludes/TradeInfrastructure';

describe('TradeInfrastructure', function() {
  let card : TradeInfrastructure; let player : Player;

  beforeEach(function() {
    card = new TradeInfrastructure();
    player = new Player('test', Color.BLUE, false);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.energy).to.eq(3);
    expect(player.getFleetSize()).to.eq(2);
  });
});
