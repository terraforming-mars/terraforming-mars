import {expect} from 'chai';
import {IoResearchOutpost} from '../../../src/cards/prelude/IoResearchOutpost';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('IoResearchOutpost', function() {
  it('Should play', function() {
    const card = new IoResearchOutpost();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    card.play(player);

    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
