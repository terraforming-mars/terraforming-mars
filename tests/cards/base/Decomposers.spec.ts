import {expect} from 'chai';
import {Algae} from '../../../src/cards/base/Algae';
import {Birds} from '../../../src/cards/base/Birds';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Decomposers', function() {
  let card : Decomposers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Decomposers();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 3;
    expect(card.canPlay(player, game)).is.true;
    card.play();

    card.onCardPlayed(player, game, new Birds());
    expect(card.resourceCount).to.eq(1);
    card.onCardPlayed(player, game, card);
    expect(card.resourceCount).to.eq(2);
    card.onCardPlayed(player, game, new Algae());

    expect(card.resourceCount).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
