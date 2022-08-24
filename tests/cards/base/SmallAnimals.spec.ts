import {expect} from 'chai';
import {SmallAnimals} from '../../../src/server/cards/base/SmallAnimals';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SmallAnimals', function() {
  let card: SmallAnimals;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new SmallAnimals();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can not play if oxygen level too low', function() {
    player2.production.add(Resources.PLANTS, 1);
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if no one has plant production', function() {
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
    player2.production.add(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playedCards.push(card);
    card.play(player);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.production.plants).to.eq(0);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 3);
    expect(card.getVictoryPoints()).to.eq(1);

    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
