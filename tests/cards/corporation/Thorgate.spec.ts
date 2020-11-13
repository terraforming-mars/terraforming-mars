
import {expect} from 'chai';
import {Thorgate} from '../../../src/cards/corporation/Thorgate';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Pets} from '../../../src/cards/Pets';
import {EnergySaving} from '../../../src/cards/EnergySaving';
import {Resources} from '../../../src/Resources';

describe('Thorgate', function() {
  it('Should play', function() {
    const card = new Thorgate();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.powerPlantCost).to.eq(8);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getCardDiscount(player, game, new EnergySaving())).to.eq(3);
    expect(card.getCardDiscount(player, game, new Pets())).to.eq(0);
  });
});
