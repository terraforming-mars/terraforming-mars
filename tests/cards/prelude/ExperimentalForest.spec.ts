import {expect} from 'chai';
import {ExperimentalForest} from '../../../src/server/cards/prelude/ExperimentalForest';
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';

describe('ExperimentalForest', function() {
  it('Should play', function() {
    const card = new ExperimentalForest();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    card.play(player);

    // Select Greenery space
    const selectSpace = game.deferredActions.peek()!.execute() as SelectSpace;

    expect(selectSpace).is.not.undefined;
    expect(selectSpace instanceof SelectSpace).is.true;
    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tags.PLANT))).has.lengthOf(2);
  });
});
