import {expect} from 'chai';
import {FoodFactory} from '../../../src/cards/base/FoodFactory';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('FoodFactory', function() {
  let card : FoodFactory; let player : Player;

  beforeEach(function() {
    card = new FoodFactory();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.PLANTS);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
