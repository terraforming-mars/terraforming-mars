import {expect} from 'chai';
import {Neutrinograph} from '../../../src/server/cards/underworld/Neutrinograph';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {IdentifySpacesDeferred} from '../../../src/server/underworld/IdentifySpacesDeferred';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('Neutrinograph', () => {
  it('canPlay', () => {
    const card = new Neutrinograph();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
  });

  it('play', () => {
    const card = new Neutrinograph();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('effect behavior without Neutrinograph', () => {
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.game.defer(new IdentifySpacesDeferred(player, 1));
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(UnderworldExpansion.identifiedSpaces(game)).includes(space);
    expect(UnderworldExpansion.identifiableSpaces(player)).does.not.include(space);

    space.excavator = player;

    expect(UnderworldExpansion.identifiedSpaces(game)).includes(space);
    expect(UnderworldExpansion.identifiableSpaces(player)).does.not.include(space);
  });

  it('effect', () => {
    const card = new Neutrinograph();
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(card);

    player.game.defer(new IdentifySpacesDeferred(player, 1));
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(UnderworldExpansion.identifiedSpaces(game)).includes(space);
    expect(UnderworldExpansion.identifiableSpaces(player)).includes(space);

    space.excavator = player;

    expect(UnderworldExpansion.identifiedSpaces(game)).includes(space);
    expect(UnderworldExpansion.identifiableSpaces(player)).does.not.include(space);
  });
});
