import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {MartianLumberYard} from '../../../src/cards/community/preludes/MartianLumberYard';

describe('MartianLumberYard', function() {
  let card : MartianLumberYard; let player : Player;

  beforeEach(function() {
    card = new MartianLumberYard();
    player = new Player('test', Color.BLUE, false);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.steel).to.eq(2);
    expect(player.plants).to.eq(3);
  });
});
