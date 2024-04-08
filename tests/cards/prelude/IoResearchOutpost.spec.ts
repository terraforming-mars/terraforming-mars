import {expect} from 'chai';
import {IoResearchOutpost} from '../../../src/server/cards/prelude/IoResearchOutpost';
import {Game} from '../../../src/server/Game';
import {testGame} from '../../TestGame';

describe('IoResearchOutpost', function() {
  it('Should play', function() {
    const card = new IoResearchOutpost();
    const [/* game */, player] = testGame(1);
    Game.newInstance('gameid', [player], player);
    card.play(player);

    expect(player.production.titanium).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
