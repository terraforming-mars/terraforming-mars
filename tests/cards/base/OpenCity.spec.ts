import {expect} from 'chai';
import {OpenCity} from '../../../src/cards/base/OpenCity';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('OpenCity', function() {
  let card : OpenCity; let player : Player; let game : Game;

  beforeEach(function() {
    card = new OpenCity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if oxygen level too low', function() {
    player.addProduction(Resources.ENERGY);
    (game as any).oxygenLevel = 11;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    (game as any).oxygenLevel = 12;
    expect(card.canPlay(player, game)).is.true;

    const action = card.play(player, game);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesInPlayOnMars()).to.eq(1);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    expect(player.plants).to.eq(2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
