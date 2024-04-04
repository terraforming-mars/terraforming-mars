import {expect} from 'chai';
import {InducedTremor} from '../../../src/server/cards/underworld/InducedTremor';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('InducedTremor', () => {
  it('Should play', () => {
    const card = new InducedTremor();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);
    const space = game.board.getSpaceOrThrow('30');
    const neighbor = game.board.getSpaceOrThrow('21');

    expect(space.undergroundResources).is.undefined;
    expect(neighbor.undergroundResources).is.undefined;

    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor(), /* ignorePlacementRestrictions=*/false, space);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.spaces).includes(neighbor);
    expect(neighbor.undergroundResources).is.not.undefined;
    selectSpace.cb(neighbor);
    expect(neighbor.undergroundResources).is.undefined;
    // TODO(kberg): test that the underground resource is back in the pool
  });
  // TODO(kberg): test that the card isn't playable if there aren't spaces that meet the requirement.
  // TODO(kberg): test that a space is excluded if there's no neighbor space with a token to remove.
  // TODO(kberg): test that it's valid to choose a space if its only available neighbor doesn't have an underground token
});
