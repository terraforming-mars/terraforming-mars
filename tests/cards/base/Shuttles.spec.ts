import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {Shuttles} from '../../../src/server/cards/base/Shuttles';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('Shuttles', function() {
  let card: Shuttles;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Shuttles();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without energy production', function() {
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if oxygen level too low', function() {
    player.production.add(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 5;
    player.production.add(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);

    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
  });
});
