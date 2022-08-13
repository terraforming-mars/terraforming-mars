import {expect} from 'chai';
import {IoResearchOutpost} from '../../../src/server/cards/prelude/IoResearchOutpost';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('IoResearchOutpost', function() {
  it('Should play', function() {
    const card = new IoResearchOutpost();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    card.play(player);

    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
