import {expect} from 'chai';
import {Neutrinograph} from '../../../src/server/cards/underworld/Neutrinograph';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {IdentifySpacesDeferred} from '../../../src/server/underworld/IdentifySpacesDeferred';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {TileType} from '../../../src/common/TileType';

describe('Neutrinograph', () => {
  it('canPlay', () => {
    const card = new Neutrinograph();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.true;
  });

  it('canPlay while some spaces are excavatable', () => {
    const card = new Neutrinograph();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.tagsForTest = {science: 4};
    const spaces = UnderworldExpansion.identifiableSpaces(player);
    spaces.forEach((space) => space.undergroundResources = 'nothing');
    spaces.slice(1).forEach((space) => space.excavator = player);
    cast(card.play(player), undefined);
    expect(card.canPlay(player)).is.true;

    spaces[0].excavator = player;
    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    const card = new Neutrinograph();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
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

it('effect does not apply to adding tiles', () => {
  const card = new Neutrinograph();
  const fake = fakeCard({
    onIdentification() {
      throw new Error('Unexpected identification');
    },
  });

  const [game, player] = testGame(2, {underworldExpansion: true});

  const space = UnderworldExpansion.identifiableSpaces(player)[0];
  UnderworldExpansion.identify(game, space);

  player.playedCards.push(card);
  player.playedCards.push(fake);

  game.addTile(player, space, {tileType: TileType.CITY});

  // Not throwing an error is success
});
