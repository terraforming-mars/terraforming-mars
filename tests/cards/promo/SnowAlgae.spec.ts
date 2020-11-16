import {expect} from 'chai';
import {SnowAlgae} from '../../../src/cards/promo/SnowAlgae';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {maxOutOceans} from '../../TestingUtils';

describe('SnowAlgae', function() {
  let card : SnowAlgae; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SnowAlgae();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player], player);
  });

  it('Can\'t play', function() {
    maxOutOceans(player, game, 1);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, game, 2);
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});
