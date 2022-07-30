import {expect} from 'chai';
import {AcquiredSpaceAgency} from '../../../src/cards/prelude/AcquiredSpaceAgency';
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AcquiredSpaceAgency', function() {
  it('Should play', function() {
    const card = new AcquiredSpaceAgency();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    card.play(player);

    expect(player.titanium).to.eq(6);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tags.SPACE))).has.lengthOf(2);
  });
});
