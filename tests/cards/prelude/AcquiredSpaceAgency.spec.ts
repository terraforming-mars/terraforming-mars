import {expect} from 'chai';
import {AcquiredSpaceAgency} from '../../../src/cards/prelude/AcquiredSpaceAgency';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('AcquiredSpaceAgency', function() {
  it('Should play', function() {
    const card = new AcquiredSpaceAgency();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    card.play(player);

    expect(player.titanium).to.eq(6);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.indexOf(Tags.SPACE) !== -1)).has.lengthOf(2);
  });
});
