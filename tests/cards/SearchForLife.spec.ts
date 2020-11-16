import {expect} from 'chai';
import {SearchForLife} from '../../src/cards/SearchForLife';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Tags} from '../../src/cards/Tags';

describe('SearchForLife', function() {
  let card : SearchForLife; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SearchForLife();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t act if no MC', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Can\'t play if oxygen level too high', function() {
    (game as any).oxygenLevel = 7;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player, game)).is.true;
    player.playedCards.push(card);
    card.play();

    expect(card.getVictoryPoints()).to.eq(0);
    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(3);
  });


  it('Should act', function() {
    player.playedCards.push(card);

    while (game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] === Tags.MICROBES) === undefined ||
               game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] !== Tags.MICROBES) === undefined) {
      player.megaCredits = 1;
      card.action(player, game);
      game.deferredActions.runNext();
      expect(player.megaCredits).to.eq(0);
    }

    expect(card.resourceCount >= 1).is.true;
  });
});
