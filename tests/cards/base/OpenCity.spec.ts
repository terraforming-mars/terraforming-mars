import {expect} from 'chai';
import {OpenCity} from '../../../src/cards/base/OpenCity';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('OpenCity', function() {
  let card : OpenCity; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new OpenCity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if oxygen level too low', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 11;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesOnMarsCount()).to.eq(1);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
