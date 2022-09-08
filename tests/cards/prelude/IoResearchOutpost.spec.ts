import {expect} from 'chai';
import {IoResearchOutpost} from '../../../src/server/cards/prelude/IoResearchOutpost';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('IoResearchOutpost', function() {
  it('Should play', function() {
    const card = new IoResearchOutpost();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    Game.newInstance('gameid', [player], player);
    card.play(player);

    expect(player.production.titanium).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
