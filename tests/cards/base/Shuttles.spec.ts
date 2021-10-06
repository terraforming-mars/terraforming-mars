import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {Shuttles} from '../../../src/cards/base/Shuttles';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Shuttles', function() {
  let card : Shuttles; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new Shuttles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if oxygen level too low', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 5;
    player.addProduction(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);

    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
  });
});
