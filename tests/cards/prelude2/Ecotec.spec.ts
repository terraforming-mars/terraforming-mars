import {expect} from 'chai';
import {Ecotec} from '@/server/cards/prelude2/Ecotec';
import {Tardigrades} from '@/server/cards/base/Tardigrades';
import {Ants} from '@/server/cards/base/Ants';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {newCard} from '@/server/createCard';
import {ICard} from '@/server/cards/ICard';
import {IGame} from '@/server/IGame';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectCard} from '@/server/inputs/SelectCard';
import {SelectOption} from '@/server/inputs/SelectOption';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {cast} from '@/common/utils/utils';
import {ProtectedGrowth} from '@/server/cards/promo/ProtectedGrowth';

describe('Ecotec', () => {
  let card: Ecotec;
  let player: TestPlayer;
  let game: IGame;
  let tardigrades: Tardigrades;

  beforeEach(() => {
    card = new Ecotec();
    [game, player] = testGame(2);
    tardigrades = new Tardigrades();
  });

  it('play', () => {
    player.playCorporationCard(card);
    expect(player.megaCredits).to.eq(42);
    expect(player.production.plants).to.eq(1);
  });

  for (const run of [
    {cardName: CardName.SF_MEMORIAL, expected: 0}, // no ANIMAL/PLANT/MICROBE tags
    {cardName: CardName.PROTECTED_GROWTH, expected: 1}, // 1 relevant tag (PLANT)
    {cardName: CardName.ECOLOGICAL_ZONE, expected: 2}, // 2 relevant tags (ANIMAL, PLANT)
  ] as const) {
    it('onCardPlayed ' + JSON.stringify(run), () => {
      const playedCard = newCard(run.cardName);
      card.onCardPlayed(player, playedCard);
      expect(player.plants).to.eq(run.expected);
    });
  }

  function setupForMicrobeChoice() {
    player.playedCards.push(tardigrades);

    card.onCardPlayed(player, new ProtectedGrowth());
    runAllActions(game);
  }

  it('offers a choice between a plant and a microbe when a microbe-resource card is in play', () => {
    setupForMicrobeChoice();

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.lengthOf(2);
  });

  it('choosing to gain a plant grants 1 plant', () => {
    setupForMicrobeChoice();

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // Second option gains the plant.

    expect(player.plants).to.eq(1);
    expect(tardigrades.resourceCount).to.eq(0);
  });

  it('offers the only microbe card directly', () => {
    setupForMicrobeChoice();

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectOption = cast(orOptions.options[0], SelectOption);
    selectOption.cb(undefined);

    expect(tardigrades.resourceCount).to.eq(1);
    expect(player.plants).to.eq(0);
  });

  it('choosing to add a microbe selects from multiple cards', () => {
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);
    card.onCardPlayed(player, new ProtectedGrowth());
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard<ICard>);
    expect(selectCard.cards).deep.eq([tardigrades, ants]);
    selectCard.cb([ants]);

    expect(tardigrades.resourceCount).eq(0);
    expect(ants.resourceCount).eq(1);
    expect(player.plants).to.eq(0);
  });

  it('onNonCardTagAdded gains 1 plant for a PLANT tag', () => {
    card.onNonCardTagAdded(player, Tag.PLANT);
    expect(player.plants).to.eq(1);
  });

  it('onNonCardTagAdded ignores tags other than PLANT', () => {
    card.onNonCardTagAdded(player, Tag.SCIENCE);
    expect(player.plants).to.eq(0);
  });
});
