import {expect} from 'chai';
import {Livestock} from '../../../src/cards/base/Livestock';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Livestock', function() {
  let card : Livestock; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Livestock();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without plant production', function() {
    (game as any).oxygenLevel = 9;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if oxygen level too low', function() {
    (game as any).oxygenLevel = 8;
    player.addProduction(Resources.PLANTS);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.PLANTS);
    (game as any).oxygenLevel = 9;
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    player.playedCards.push(card);
    expect(player.getProduction(Resources.PLANTS)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints()).to.eq(4);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
