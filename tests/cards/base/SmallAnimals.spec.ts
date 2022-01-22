import {expect} from 'chai';
import {SmallAnimals} from '../../../src/cards/base/SmallAnimals';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SmallAnimals', function() {
  let card : SmallAnimals; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new SmallAnimals();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play if oxygen level too low', function() {
    player2.addProduction(Resources.PLANTS, 1);
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if no one has plant production', function() {
    (game as any).oxygenLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    player2.addProduction(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playedCards.push(card);
    card.play(player);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 3);
    expect(card.getVictoryPoints()).to.eq(1);

    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
