import {expect} from 'chai';
import {InducedTremor} from '../../../src/server/cards/underworld/InducedTremor';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {cast} from '../../../src/common/utils/utils';

describe('InducedTremor', () => {
  it('cannot play', () => {
    const card = new InducedTremor();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});
    for (const space of game.board.spaces) {
      space.excavator = player2;
    }
    expect(card.canPlay(player)).is.false;
  });

  it('can play', () => {
    const card = new InducedTremor();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play, discard', () => {
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

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectSpace = cast(orOptions.options[0], SelectSpace);
    expect(selectSpace.spaces).to.have.members(spaces.slice(0, 3));
    const nextSelectSpace = selectSpace.cb(spaces[1]);

    expect(spaces[0].undergroundResources).is.not.undefined;
    expect(spaces[1].undergroundResources).is.undefined;
    expect(spaces[2].undergroundResources).is.not.undefined;
    expect(game.underworldData.tokens).has.length(89);

    runAllActions(game);
    assertIsExcavationAction(player, nextSelectSpace);
  });

  it('Should play, do not discard', () => {
    const card = new InducedTremor();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const spaces = UnderworldExpansion.identifiableSpaces(player);
    UnderworldExpansion.identify(game, spaces[0], player);
    expect(game.underworldData.tokens).has.length(90);

    cast(card.play(player), undefined);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const nextSelectSpace = cast(orOptions.options[1], SelectOption).cb(undefined);

    expect(spaces[0].undergroundResources).is.not.undefined;
    expect(game.underworldData.tokens).has.length(90);

    runAllActions(game);
    assertIsExcavationAction(player, nextSelectSpace);
  });

  it('Should play, nothing to discard', () => {
    const card = new InducedTremor();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());
  });
});
