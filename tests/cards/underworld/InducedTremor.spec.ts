import {expect} from 'chai';
import {InducedTremor} from '../../../src/server/cards/underworld/InducedTremor';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('InducedTremor', () => {
  it('cannot play', () => {
    const card = new InducedTremor();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    expect(card.canPlay(player)).is.false;
  });

  it('can play', () => {
    const card = new InducedTremor();
    const [game, player] = testGame(2, {underworldExpansion: true});
    const spaces = UnderworldExpansion.identifiableSpaces(player);
    UnderworldExpansion.identify(game, spaces[0], player);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new InducedTremor();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const spaces = UnderworldExpansion.identifiableSpaces(player);
    UnderworldExpansion.identify(game, spaces[0], player);
    UnderworldExpansion.identify(game, spaces[1], player);
    UnderworldExpansion.identify(game, spaces[2], player);

    expect(spaces[0].undergroundResources).is.not.undefined;
    expect(spaces[1].undergroundResources).is.not.undefined;
    expect(spaces[2].undergroundResources).is.not.undefined;
    expect(game.underworldData.tokens).has.length(88);

    cast(card.play(player), undefined);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.spaces).to.have.members(spaces.slice(0, 3));
    const nextSelectSpace = selectSpace.cb(spaces[1]);

    expect(spaces[0].undergroundResources).is.not.undefined;
    expect(spaces[1].undergroundResources).is.undefined;
    expect(spaces[2].undergroundResources).is.not.undefined;
    expect(game.underworldData.tokens).has.length(89);

    runAllActions(game);
    assertIsExcavationAction(player, nextSelectSpace);
  });
});
