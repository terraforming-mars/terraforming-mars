import {expect} from 'chai';
import {Biolab} from '../../../src/server/cards/prelude/Biolab';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Biolab', function() {
  it('Should play', function() {
    const card = new Biolab();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    Game.newInstance('gameid', [player], player);
    card.play(player);

    expect(player.production.plants).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
