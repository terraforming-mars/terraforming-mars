import {expect} from 'chai';
import {ExperimentalForest} from '../../../src/cards/prelude/ExperimentalForest';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayers} from '../../TestPlayers';

describe('ExperimentalForest', function() {
  it('Should play', function() {
    const card = new ExperimentalForest();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
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
