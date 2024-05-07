import {expect} from 'chai';
import {SpacePrivateers} from '../../../src/server/cards/underworld/SpacePrivateers';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';

describe('SpacePrivateers', () => {
  it('canPlay', () => {
    const card = new SpacePrivateers();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.underworldData.corruption = 2;
    expect(card.canPlay(player)).is.false;
    player.underworldData.corruption = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new SpacePrivateers();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);
    expect(card.resourceCount).eq(3);
  });

  it('canAct', () => {
    const card = new SpacePrivateers();

    card.resourceCount = 0;
    expect(card.canAct()).is.false;
    card.resourceCount = 1;
    expect(card.canAct()).is.true;
  });

  it('action, no blocking', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3] = testGame(3, {underworldExpansion: true});

    player.megaCredits = 0;
    player2.megaCredits = 4;
    player2.underworldData.corruption = 1;
    player3.megaCredits = 4;
    player3.underworldData.corruption = 1;

    card.resourceCount = 2;
    cast(card.action(player), undefined);
    runAllActions(game);
    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'do not block');
    runAllActions(game);
    assertIsMaybeBlock(player3, player3.popWaitingFor(), 'do not block');
    runAllActions(game);

    expect(player.megaCredits).eq(4);
    expect(card.resourceCount).eq(2);
    expect(player2.megaCredits).eq(2);
    expect(player2.underworldData.corruption).eq(1);
    expect(player3.megaCredits).eq(2);
    expect(player3.underworldData.corruption).eq(1);
  });

  it('action, 1 blocking', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3] = testGame(3, {underworldExpansion: true});

    player.megaCredits = 0;
    player2.megaCredits = 4;
    player2.underworldData.corruption = 1;
    player3.megaCredits = 4;
    player3.underworldData.corruption = 1;

    card.resourceCount = 2;
    cast(card.action(player), undefined);
    runAllActions(game);
    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'corruption');
    runAllActions(game);
    assertIsMaybeBlock(player3, player3.popWaitingFor(), 'do not block');
    runAllActions(game);

    expect(player.megaCredits).eq(2);
    expect(card.resourceCount).eq(1);
    expect(player2.megaCredits).eq(4);
    expect(player2.underworldData.corruption).eq(0);
    expect(player3.megaCredits).eq(2);
    expect(player3.underworldData.corruption).eq(1);
  });

  it('action, 2 blocking', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3] = testGame(3, {underworldExpansion: true});

    player.megaCredits = 0;
    player2.megaCredits = 4;
    player2.underworldData.corruption = 1;
    player3.megaCredits = 4;
    player3.underworldData.corruption = 1;

    card.resourceCount = 2;
    cast(card.action(player), undefined);
    runAllActions(game);
    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'corruption');
    runAllActions(game);
    assertIsMaybeBlock(player3, player3.popWaitingFor(), 'corruption');
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(card.resourceCount).eq(1);
    expect(player2.megaCredits).eq(4);
    expect(player2.underworldData.corruption).eq(0);
    expect(player3.megaCredits).eq(4);
    expect(player3.underworldData.corruption).eq(0);
  });
});
