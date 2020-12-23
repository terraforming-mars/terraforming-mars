import {expect} from 'chai';
import {EnergyMarket} from '../../../src/cards/promo/EnergyMarket';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectAmount} from '../../../src/inputs/SelectAmount';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('EnergyMarket', function() {
  let card : EnergyMarket; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EnergyMarket();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t act', function() {
    player.setResource(Resources.MEGACREDITS, 1);
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act when sufficient MC resources available', function() {
    player.setResource(Resources.MEGACREDITS, 2);
    expect(card.canAct(player)).is.true;
  });

  it('Can act when sufficient MC (using heat) resources available', function() {
    player.canUseHeatAsMegaCredits = true;
    player.setResource(Resources.MEGACREDITS, 1);
    player.setResource(Resources.HEAT, 3);
    expect(card.canAct(player)).is.true;
  });

  it('Can act when energy production available', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;
  });

  it('Should act and provide options when enough MC resources and energy production available', function() {
    player.setResource(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    const result = card.action(player, game);
    expect(result instanceof OrOptions).is.true;
  });

  it('Should act when sufficient MC resources available', function() {
    player.setResource(Resources.MEGACREDITS, 2);
    const result = card.action(player, game);
    expect(result instanceof SelectAmount).is.true;
  });

  it('Should act when energy production available', function() {
    player.addProduction(Resources.ENERGY, 1);
    const result = card.action(player, game);
    expect(result).is.undefined;

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(8);
  });
});
