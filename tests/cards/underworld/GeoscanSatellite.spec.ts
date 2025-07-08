import {expect} from 'chai';
import {GeoscanSatellite} from '../../../src/server/cards/underworld/GeoscanSatellite';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('GeoscanSatellite', () => {
  it('play', () => {
    const card = new GeoscanSatellite();

    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(game.board.spaces.filter((space) => space.undergroundResources)).is.empty;
    // Arbitrary space, closer to the middle, so has more selected.
    // I could do better than this. :D
    const space = selectSpace.spaces[10];
    selectSpace.cb(space);

    const expected = [space, ...game.board.getAdjacentSpaces(space)];
    expect(game.board.spaces.filter((space) => space.undergroundResources)).to.have.members(expected);

    runAllActions(game);

    const selectSpaceToExcavate = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpaceToExcavate.spaces).to.have.members(expected);

    space.undergroundResources = 'card1';

    selectSpaceToExcavate.cb(space);

    expect(player.cardsInHand).has.length(1);
  });
});
