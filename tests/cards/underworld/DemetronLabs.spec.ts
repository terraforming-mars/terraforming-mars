import {expect} from 'chai';
import {DemetronLabs} from '../../../src/server/cards/underworld/DemetronLabs';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('DemetronLabs', () => {
  it('play', () => {
    const card = new DemetronLabs();
    const [game, player] = testGame(2, {underworldExpansion: true});
    card.play(player);
    runAllActions(game);

    expect(card.resourceCount).eq(2);
  });

  it('onCardPlayed', () => {
    const card = new DemetronLabs();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
    card.onCardPlayedForCorps(player, fakeCard({tags: [Tag.SCIENCE]}));
    expect(card.resourceCount).eq(2);
  });

  it('canAct', () => {
    const card = new DemetronLabs();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    card.resourceCount = 2;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new DemetronLabs();
    const [game, player] = testGame(2, {underworldExpansion: true});
    card.resourceCount = 3;

    expect(player.underworldData.tokens).has.length(0);

    cast(card.action(player), undefined);
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    runAllActions(game);
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    expect(player.underworldData.tokens).has.length(1);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
