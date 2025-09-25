import {expect} from 'chai';
import {ExperimentalForest} from '../../../src/server/cards/prelude/ExperimentalForest';
import {Tag} from '../../../src/common/cards/Tag';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ExperimentalForest', () => {
  it('Should play', () => {
    const card = new ExperimentalForest();
    const [game, player] = testGame(1);
    card.play(player);

    // Select Greenery space
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);

    expect(selectSpace.cb(selectSpace.spaces[0])).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.PLANT))).has.lengthOf(2);
  });
});
