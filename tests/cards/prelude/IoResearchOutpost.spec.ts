import {expect} from 'chai';
import {IoResearchOutpost} from '../../../src/cards/prelude/IoResearchOutpost';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('IoResearchOutpost', function() {
  it('Should play', function() {
    const card = new IoResearchOutpost();
    const player = TestPlayers.BLUE.newPlayer();
    card.play(player);

    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
