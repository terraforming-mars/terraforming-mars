import {expect} from 'chai';
import {ExperimentalForest} from '../../../src/server/cards/prelude/ExperimentalForest';
import {Tag} from '../../../src/common/cards/Tag';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('ExperimentalForest', function() {
  it('Should play', function() {
    const card = new ExperimentalForest();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    card.play(player);

    // Select Greenery space
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);

    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.PLANT))).has.lengthOf(2);
  });
});
