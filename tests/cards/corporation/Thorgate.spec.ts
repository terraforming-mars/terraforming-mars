import {expect} from 'chai';
import {EnergySaving} from '../../../src/cards/base/EnergySaving';
import {Pets} from '../../../src/cards/base/Pets';
import {Thorgate} from '../../../src/cards/corporation/Thorgate';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Thorgate', function() {
  it('Should play', function() {
    const card = new Thorgate();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.powerPlantCost).to.eq(8);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getCardDiscount(player, game, new EnergySaving())).to.eq(3);
    expect(card.getCardDiscount(player, game, new Pets())).to.eq(0);
  });
});
