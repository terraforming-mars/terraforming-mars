import {expect} from 'chai';
import {Neutrinograph} from '../../../src/server/cards/underworld/Neutrinograph';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('Neutrinograph', () => {
  it('canPlay', () => {
    const card = new Neutrinograph();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 5};
    expect(card.canPlay(player)).is.true;
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
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
