import {expect} from 'chai';
import {SpacePrivateers} from '../../../src/server/cards/underworld/SpacePrivateers';
import {testGame} from '../../TestGame';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';
import {Tag} from '../../../src/common/cards/Tag';
import {cast} from '../../../src/common/utils/utils';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {SelectPlayer} from '@/server/inputs/SelectPlayer';

describe('SpacePrivateers', () => {
  it('canPlay', () => {
    const card = new SpacePrivateers();
    const [/* game */, player] = testGame(2, {expansions: {underworld: true}});

    player.underworldData.corruption = 2;
    expect(card.canPlay(player)).is.false;
    player.underworldData.corruption = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new SpacePrivateers();
    const [game, player] = testGame(2, {expansions: {underworld: true}});

    cast(card.play(player), undefined);
    runAllActions(game);
    expect(card.resourceCount).eq(0);
  });

  it('effect', () => {
    const card = new SpacePrivateers();
    const [/* game */, player] = testGame(2, {expansions: {underworld: true}});

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
    const [/* game */, player] = testGame(2, {expansions: {underworld: true}});

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
      const [game, player, player2, player3] = testGame(3, {expansions: {underworld: true}});

      player.megaCredits = 0;
      player2.megaCredits = 4;
      player2.underworldData.corruption = 1;
      player3.megaCredits = 4;
      player3.underworldData.corruption = 1;

      card.resourceCount = 3;
      const orOptions = cast(card.action(player), OrOptions);
      const selectPlayer = cast(orOptions.options[0], SelectPlayer);
      expect(selectPlayer.players).to.have.members([player2, player3]);
      cast(selectPlayer.cb(player2), undefined);
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

  it('attacker chooses attack order', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3] = testGame(3, {expansions: {underworld: true}});

    player2.megaCredits = 4;
    player2.underworldData.corruption = 1;
    player3.megaCredits = 4;
    player3.underworldData.corruption = 1;
    card.resourceCount = 2;

    const orOptions = cast(card.action(player), OrOptions);
    cast(orOptions.options[0], SelectPlayer).cb(player3);
    runAllActions(game);

    assertIsMaybeBlock(player3, player3.popWaitingFor(), 'do not block');
    runAllActions(game);
    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'do not block');
  });

  it('action, 2 players, no order prompt', () => {
    const card = new SpacePrivateers();
    const [game, player, player2] = testGame(2, {expansions: {underworld: true}});

    player.megaCredits = 0;
    player2.megaCredits = 4;
    card.resourceCount = 2;

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(player.megaCredits).eq(2);
    expect(player2.megaCredits).eq(2);
  });

  it('attack remaining players in any order', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3, player4] = testGame(4, {expansions: {underworld: true}});

    player.megaCredits = 0;
    player2.megaCredits = 4;
    player3.megaCredits = 4;
    player4.megaCredits = 4;
    card.resourceCount = 2;

    const orOptions = cast(card.action(player), OrOptions);
    cast(cast(orOptions.options[0], SelectPlayer).cb(player4), undefined);
    runAllActions(game);

    expect(player4.megaCredits).eq(2);
    expect(player2.megaCredits).eq(4);

    const next = cast(player.popWaitingFor(), OrOptions);
    expect(cast(next.options[0], SelectPlayer).players).to.have.members([player2, player3]);
    cast(next.options[1], SelectOption).cb(undefined);
    runAllActions(game);

    expect(player.megaCredits).eq(6);
    expect(player2.megaCredits).eq(2);
    expect(player3.megaCredits).eq(2);
    expect(player4.megaCredits).eq(2);
  });

  it('players with no M€ are not attacked', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3, player4] = testGame(4, {expansions: {underworld: true}});

    player.megaCredits = 0;
    player2.megaCredits = 0;
    player3.megaCredits = 4;
    player4.megaCredits = 4;
    card.resourceCount = 2;

    const orOptions = cast(card.action(player), OrOptions);
    expect(cast(orOptions.options[0], SelectPlayer).players).to.have.members([player3, player4]);
    cast(orOptions.options[1], SelectOption).cb(undefined);
    runAllActions(game);

    expect(player.megaCredits).eq(4);
    expect(player3.megaCredits).eq(2);
    expect(player4.megaCredits).eq(2);
  });

  it('attacks stop when out of fighters', () => {
    const card = new SpacePrivateers();
    const [game, player, player2, player3, player4] = testGame(4, {expansions: {underworld: true}});

    player.megaCredits = 0;
    player2.megaCredits = 4;
    player2.underworldData.corruption = 1;
    player3.megaCredits = 4;
    player4.megaCredits = 4;
    card.resourceCount = 1;

    const orOptions = cast(card.action(player), OrOptions);
    cast(orOptions.options[0], SelectPlayer).cb(player2);
    runAllActions(game);
    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'corruption');
    runAllActions(game);

    expect(card.resourceCount).eq(0);
    expect(player.popWaitingFor()).is.undefined;
    expect(player.megaCredits).eq(0);
    expect(player3.megaCredits).eq(4);
    expect(player4.megaCredits).eq(4);
  });
});
