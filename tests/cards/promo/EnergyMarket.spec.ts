import {expect} from 'chai';
import {EnergyMarket} from '../../../src/server/cards/promo/EnergyMarket';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('EnergyMarket', function() {
  let card: EnergyMarket;
  let player: Player;

  beforeEach(function() {
    card = new EnergyMarket();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Can not act', function() {
    player.addResource(Resources.MEGACREDITS, 1);
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act when sufficient MC resources available', function() {
    player.addResource(Resources.MEGACREDITS, 2);
    expect(card.canAct(player)).is.true;
  });

  it('Can act when sufficient MC (using heat) resources available', function() {
    player.canUseHeatAsMegaCredits = true;
    player.addResource(Resources.MEGACREDITS, 1);
    player.addResource(Resources.HEAT, 3);
    expect(card.canAct(player)).is.true;
  });

  it('Can act when energy production available', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;
  });

  it('Should act and provide options when enough MC resources and energy production available', function() {
    player.addResource(Resources.MEGACREDITS, 2);
    player.production.add(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    const result = card.action(player);
    expect(result instanceof OrOptions).is.true;
  });

  it('Should act when sufficient MC resources available', function() {
    player.addResource(Resources.MEGACREDITS, 2);
    const result = card.action(player);
    expect(result instanceof SelectAmount).is.true;
  });

  it('Should act when energy production available', function() {
    player.production.add(Resources.ENERGY, 1);
    const result = card.action(player);
    expect(result).is.undefined;

    expect(player.production.energy).to.eq(0);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(8);
  });
});
