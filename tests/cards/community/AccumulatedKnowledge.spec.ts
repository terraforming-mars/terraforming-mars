import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {AccumulatedKnowledge} from '../../../src/cards/community/AccumulatedKnowledge';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('AccumulatedKnowledge', function() {
  let card : AccumulatedKnowledge; let player : Player; let game: Game;

  beforeEach(function() {
    card = new AccumulatedKnowledge();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    card.play(player, game);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(4);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[0].cb(player.cardsInHand[0]);
    expect(player.cardsInHand).has.lengthOf(4);
  });
});
