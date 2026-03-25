import {expect} from 'chai';
import {SpacePrivateers} from '../../../src/server/cards/underworld/SpacePrivateers';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';
import {Tag} from '../../../src/common/cards/Tag';

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
    expect(card.resourceCount).eq(0);
  });

  it('effect', () => {
    const card = new SpacePrivateers();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(card);
    player.playCard(fakeCard({tags: [Tag.CRIME]}));
    expect(card.resourceCount).eq(1);
    player.playCard(fakeCard({tags: [Tag.CRIME, Tag.CRIME]}));
    expect(card.resourceCount).eq(3);
    player.playCard(fakeCard({tags: [Tag.BUILDING]}));
    expect(card.resourceCount).eq(3);
  });


  it('canAct', () => {
    const card = new SpacePrivateers();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    card.resourceCount = 0;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 1;
    expect(card.canAct(player)).is.true;
  });

  for (const run of [
    {player2: 'do not block', player3: 'do not block', mc: [6, 1, 1], corruption: [0, 1, 1], fighters: 3},
    {player2: 'corruption', player3: 'do not block', mc: [3, 4, 1], corruption: [0, 0, 1], fighters: 2},
    {player2: 'corruption', player3: 'corruption', mc: [0, 4, 4], corruption: [0, 0, 0], fighters: 1},
  ] as const) {
    it('action ' + JSON.stringify(run), () => {
      const card = new SpacePrivateers();
      const [game, player, player2, player3] = testGame(3, {underworldExpansion: true});

      player.megaCredits = 0;
      player2.megaCredits = 4;
      player2.underworldData.corruption = 1;
      player3.megaCredits = 4;
      player3.underworldData.corruption = 1;

      card.resourceCount = 3;
      cast(card.action(player), undefined);
      runAllActions(game);
      assertIsMaybeBlock(player2, player2.popWaitingFor(), run.player2);
      runAllActions(game);
      assertIsMaybeBlock(player3, player3.popWaitingFor(), run.player3);
      runAllActions(game);

      expect(player.megaCredits).eq(run.mc[0]);
      expect(player2.megaCredits).eq(run.mc[1]);
      expect(player3.megaCredits).eq(run.mc[2]);
      expect(player2.underworldData.corruption).eq(run.corruption[1]);
      expect(player3.underworldData.corruption).eq(run.corruption[2]);
      expect(card.resourceCount).eq(run.fighters);
    });
  }
});
