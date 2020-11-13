import {expect} from 'chai';
import {ExperimentalForest} from '../../../src/cards/prelude/ExperimentalForest';
import {Color} from '../../../src/Color';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Tags} from '../../../src/cards/Tags';

describe('ExperimentalForest', function() {
  it('Should play', function() {
    const card = new ExperimentalForest();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player], player);
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(2);

    // Draw cards
    game.deferredActions.runNext();

    // Select Greenery space
    const selectSpace = game.deferredActions.next()!.execute() as SelectSpace;

    expect(selectSpace).is.not.undefined;
    expect(selectSpace instanceof SelectSpace).is.true;
    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.indexOf(Tags.PLANT) !== -1)).has.lengthOf(2);
  });
});
