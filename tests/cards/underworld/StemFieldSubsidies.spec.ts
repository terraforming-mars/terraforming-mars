import {expect} from 'chai';
import {StemFieldSubsidies} from '../../../src/server/cards/underworld/StemFieldSubsidies';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {CardResource} from '../../../src/common/CardResource';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';

describe('StemFieldSubsidies', () => {
  let card: StemFieldSubsidies;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new StemFieldSubsidies();
    [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
  });

  it('onCardPlayed, no tags', () => {
    card.onCardPlayed(player, fakeCard());

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });

  it('onCardPlayed, wrong tag', () => {
    card.onCardPlayed(player, fakeCard({tags: [Tag.EARTH]}));
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });

  it('onCardPlayed, one tag, one card', () => {
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE]}));
    expect(card.resourceCount).eq(1);
  });

  it('onCardPlayed, two tags, one card', () => {
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));
    expect(card.resourceCount).eq(2);
  });

  it('onCardPlayed, one tag, two cards', () => {
    const otherCard = fakeCard({resourceType: CardResource.DATA});

    player.playedCards.push(otherCard);
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE]}));
    expect(card.resourceCount).eq(1);
  });

  it('Compatible with Leavitt #6349', () => {
    const leavitt = new Leavitt();
    leavitt.addColony(player);
    expect(card.resourceCount).eq(1);
  });

  it('Test action', () => {
    card.resourceCount = 1;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 2;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(card.resourceCount).eq(0);
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    expect(player.popWaitingFor()).to.be.undefined;
  });
});
