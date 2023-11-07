import {expect} from 'chai';
import {StemFieldSubsidies} from '../../../src/server/cards/underworld/StemFieldSubsidies';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {CardResource} from '../../../src/common/CardResource';

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
    card.onCardPlayed(player, fakeCard({}));

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
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(1);
  });

  it('onCardPlayed, two tags, one card', () => {
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(2);
  });

  it('onCardPlayed, one tag, two cards', () => {
    const otherCard = fakeCard({resourceType: CardResource.DATA});

    player.playedCards.push(otherCard);
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE]}));
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsAddResourceToCard(player.popWaitingFor(), 1, [card, otherCard], card);
    cast(player.popWaitingFor(), undefined);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });
});
