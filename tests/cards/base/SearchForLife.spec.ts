import {expect} from 'chai';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('SearchForLife', function() {
  let card : SearchForLife; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SearchForLife();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act if no MC', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Can\'t play if oxygen level too high', function() {
    (game as any).oxygenLevel = 7;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.true;
    player.playedCards.push(card);
    card.play();

    expect(card.getVictoryPoints()).to.eq(0);
    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(3);
  });


  it('Should act', function() {
    player.playedCards.push(card);

    while (game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] === Tags.MICROBE) === undefined ||
               game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] !== Tags.MICROBE) === undefined) {
      player.megaCredits = 1;
      card.action(player);
      game.deferredActions.runNext();
      expect(player.megaCredits).to.eq(0);
    }

    expect(card.resourceCount >= 1).is.true;
  });
});
