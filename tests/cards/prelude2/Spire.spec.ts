import {expect} from 'chai';
import {Spire} from '@/server/cards/prelude2/Spire';
import {CardName} from '@/common/cards/CardName';
import {newCard} from '@/server/createCard';
import {ICard} from '@/server/cards/ICard';
import {IGame} from '@/server/IGame';
import {SelectCard} from '@/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {cast} from '@/common/utils/utils';

describe('Spire', () => {
  let card: Spire;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Spire();
    [game, player] = testGame(2);
  });

  it('play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.megaCredits).to.eq(50);
    // Spire has 2 tags (CITY, EARTH), so it triggers its own onCardPlayed effect.
    expect(card.resourceCount).to.eq(1);
  });

  it('initialAction', () => {
    const selectCard = cast(card.initialAction(player), SelectCard<ICard>);
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player.cardsInHand).deep.eq(selectCard.cards);

    const kept = selectCard.cards[2];
    const discarded = selectCard.cards.filter((c) => c !== kept);
    selectCard.cb(discarded);

    expect(player.cardsInHand).deep.eq([kept]);
    expect(game.projectDeck.discardPile).deep.eq(discarded);
  });

  for (const run of [
    {cardName: CardName.TESLARACT, expected: 1}, // 2 tags, not an EVENT
    {cardName: CardName.SF_MEMORIAL, expected: 0}, // 1 tag, not an EVENT
    {cardName: CardName.ISHTAR_EXPEDITION, expected: 1}, // EVENT with 1 tag; EVENT counts as +1
  ] as const) {
    it('onCardPlayed ' + JSON.stringify(run), () => {
      const playedCard = newCard(run.cardName);
      card.onCardPlayed(player, playedCard);
      expect(card.resourceCount).to.eq(run.expected);
    });
  }
});
