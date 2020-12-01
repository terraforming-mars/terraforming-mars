import {expect} from 'chai';
import {Biolab} from '../../../src/cards/prelude/Biolab';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Biolab', function() {
  it('Should play', function() {
    const card = new Biolab();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player], player);
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    // Draw cards
    game.deferredActions.runNext();

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
