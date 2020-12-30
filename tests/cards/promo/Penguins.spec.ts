import {expect} from 'chai';
import {Penguins} from '../../../src/cards/promo/Penguins';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayers} from '../../TestingUtils';

describe('Penguins', function() {
  let card : Penguins; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Penguins();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    maxOutOceans(player, game, 7);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, game, 8);
    expect(card.canPlay(player, game)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    card.action(player);
    card.action(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
