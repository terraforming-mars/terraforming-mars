import {CardFinder} from '../src/server/CardFinder';
import {CardName} from '../src/common/cards/CardName';
import {cast, finishGeneration} from './TestingUtils';
// import {Dealer} from '../src/server/Dealer';
import {expect} from 'chai';
import {Game} from '../src/server/Game';
import {getTestPlayer, newTestGame} from './TestGame';
import {ICard} from '../src/server/cards/ICard';
import {IProjectCard} from '../src/server/cards/IProjectCard';
import {Player} from '../src/server/Player';
import {SelectCard} from '../src/server/inputs/SelectCard';
import {SelectInitialCards} from '../src/server/inputs/SelectInitialCards';
import {TestPlayer} from './TestPlayer';
import {Deck} from '../src/server/cards/Deck';

// Tests for drafting
describe('drafting', () => {
  it('2 player - project draft', () => {
    const game = newTestGame(2, {draftVariant: true});
    const player = getTestPlayer(game, 0);
    const otherPlayer = getTestPlayer(game, 1);
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    selectCard(player, CardName.BIOFERTILIZER_FACILITY);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.GENE_REPAIR);

    expect(cardNames(player.draftedCards)).deep.eq([CardName.BIOFERTILIZER_FACILITY]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([CardName.GENE_REPAIR]);

    // Second card

    expect(draftSelection(player)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.HACKERS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);


    selectCard(player, CardName.FISH);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.ACQUIRED_COMPANY);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.BIOFERTILIZER_FACILITY,
      CardName.FISH,
    ]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.ACQUIRED_COMPANY,
    ]);

    // Third round

    expect(draftSelection(player)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.HACKERS]);

    selectCard(player, CardName.DECOMPOSERS);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.EARTH_OFFICE);

    // No longer drafted cards, they're just cards to buy.
    expect(player.draftedCards).is.empty;
    expect(otherPlayer.draftedCards).is.empty;

    expect(draftSelection(player)).deep.eq([
      CardName.BIOFERTILIZER_FACILITY,
      CardName.FISH,
      CardName.DECOMPOSERS,
      CardName.HACKERS,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.ACQUIRED_COMPANY,
      CardName.EARTH_OFFICE,
      CardName.CAPITAL,
    ]);

    // A nice next step would be to show that those cards above are for purchase, and acquiring them puts them in cardsInHand
    // and that the rest of them are discarded.
  });

  it('2 player - initial draft', () => {
    const shuffle = Deck.shuffle;
    let game: Game;
    try {
      Deck.shuffle = function() {};
      game = newTestGame(2, {draftVariant: true, initialDraftVariant: true});
    } finally {
      Deck.shuffle = shuffle;
    }
    const player = getTestPlayer(game, 0);
    const otherPlayer = getTestPlayer(game, 1);

    // First round

    expect(draftSelection(player)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ADAPTED_LICHEN,
      CardName.ADVANCED_ECOSYSTEMS,
      CardName.AEROBRAKED_AMMONIA_ASTEROID,
      CardName.ANTS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.AQUIFER_PUMPING,
      CardName.ALGAE,
      CardName.ARCHAEBACTERIA,
      CardName.ARCTIC_ALGAE,
      CardName.ARTIFICIAL_LAKE]);

    selectCard(player, CardName.ADAPTATION_TECHNOLOGY);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.ALGAE);

    expect(cardNames(player.draftedCards)).deep.eq([CardName.ADAPTATION_TECHNOLOGY]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([CardName.ALGAE]);

    // Second card

    expect(draftSelection(player)).deep.eq([
      CardName.AQUIFER_PUMPING,
      CardName.ARCHAEBACTERIA,
      CardName.ARCTIC_ALGAE,
      CardName.ARTIFICIAL_LAKE]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ADAPTED_LICHEN,
      CardName.ADVANCED_ECOSYSTEMS,
      CardName.AEROBRAKED_AMMONIA_ASTEROID,
      CardName.ANTS]);

    selectCard(player, CardName.ARCTIC_ALGAE);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.ANTS);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ARCTIC_ALGAE]);

    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ALGAE,
      CardName.ANTS]);

    // Third round

    expect(draftSelection(player)).deep.eq([
      CardName.ADAPTED_LICHEN,
      CardName.ADVANCED_ECOSYSTEMS,
      CardName.AEROBRAKED_AMMONIA_ASTEROID]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.AQUIFER_PUMPING,
      CardName.ARCHAEBACTERIA,
      CardName.ARTIFICIAL_LAKE]);

    selectCard(player, CardName.AEROBRAKED_AMMONIA_ASTEROID);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.AQUIFER_PUMPING);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ARCTIC_ALGAE,
      CardName.AEROBRAKED_AMMONIA_ASTEROID]);

    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ALGAE,
      CardName.ANTS,
      CardName.AQUIFER_PUMPING]);

    // Fourth round

    expect(draftSelection(player)).deep.eq([
      CardName.ARCHAEBACTERIA,
      CardName.ARTIFICIAL_LAKE]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ADAPTED_LICHEN,
      CardName.ADVANCED_ECOSYSTEMS]);

    selectCard(player, CardName.ARCHAEBACTERIA);
    selectCard(otherPlayer, CardName.ADAPTED_LICHEN);

    // Selecting the fourth card automatically gives you the fifth card that was passed.
    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ARCTIC_ALGAE,
      CardName.AEROBRAKED_AMMONIA_ASTEROID,
      CardName.ARCHAEBACTERIA,
      CardName.ADVANCED_ECOSYSTEMS]);

    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ALGAE,
      CardName.ANTS,
      CardName.AQUIFER_PUMPING,
      CardName.ADAPTED_LICHEN,
      CardName.ARTIFICIAL_LAKE]);

    // And now starts the second draft.

    // Sixth card

    expect(draftSelection(player)).deep.eq([
      CardName.ARTIFICIAL_PHOTOSYNTHESIS,
      CardName.ASTEROID,
      CardName.ASTEROID_MINING,
      CardName.BEAM_FROM_A_THORIUM_ASTEROID,
      CardName.BIG_ASTEROID,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.BIOMASS_COMBUSTORS,
      CardName.BIRDS,
      CardName.BLACK_POLAR_DUST,
      CardName.BREATHING_FILTERS,
      CardName.BUSHES,
    ]);

    selectCard(player, CardName.ASTEROID_MINING);
    selectCard(otherPlayer, CardName.BUSHES);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ARCTIC_ALGAE,
      CardName.AEROBRAKED_AMMONIA_ASTEROID,
      CardName.ARCHAEBACTERIA,
      CardName.ADVANCED_ECOSYSTEMS,
      CardName.ASTEROID_MINING]);

    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ALGAE,
      CardName.ANTS,
      CardName.AQUIFER_PUMPING,
      CardName.ADAPTED_LICHEN,
      CardName.ARTIFICIAL_LAKE,
      CardName.BUSHES]);

    // Seventh card

    expect(draftSelection(player)).deep.eq([
      CardName.BIOMASS_COMBUSTORS,
      CardName.BIRDS,
      CardName.BLACK_POLAR_DUST,
      CardName.BREATHING_FILTERS,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ARTIFICIAL_PHOTOSYNTHESIS,
      CardName.ASTEROID,
      CardName.BEAM_FROM_A_THORIUM_ASTEROID,
      CardName.BIG_ASTEROID,
    ]);

    selectCard(player, CardName.BLACK_POLAR_DUST);
    selectCard(otherPlayer, CardName.ARTIFICIAL_PHOTOSYNTHESIS);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ARCTIC_ALGAE,
      CardName.AEROBRAKED_AMMONIA_ASTEROID,
      CardName.ARCHAEBACTERIA,
      CardName.ADVANCED_ECOSYSTEMS,
      CardName.ASTEROID_MINING,
      CardName.BLACK_POLAR_DUST]);

    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ALGAE,
      CardName.ANTS,
      CardName.AQUIFER_PUMPING,
      CardName.ADAPTED_LICHEN,
      CardName.ARTIFICIAL_LAKE,
      CardName.BUSHES,
      CardName.ARTIFICIAL_PHOTOSYNTHESIS]);

    // Eighth card

    expect(draftSelection(player)).deep.eq([
      CardName.ASTEROID,
      CardName.BEAM_FROM_A_THORIUM_ASTEROID,
      CardName.BIG_ASTEROID,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.BIOMASS_COMBUSTORS,
      CardName.BIRDS,
      CardName.BREATHING_FILTERS,
    ]);

    selectCard(player, CardName.ASTEROID);
    selectCard(otherPlayer, CardName.BREATHING_FILTERS);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.ADAPTATION_TECHNOLOGY,
      CardName.ARCTIC_ALGAE,
      CardName.AEROBRAKED_AMMONIA_ASTEROID,
      CardName.ARCHAEBACTERIA,
      CardName.ADVANCED_ECOSYSTEMS,
      CardName.ASTEROID_MINING,
      CardName.BLACK_POLAR_DUST,
      CardName.ASTEROID]);

    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ALGAE,
      CardName.ANTS,
      CardName.AQUIFER_PUMPING,
      CardName.ADAPTED_LICHEN,
      CardName.ARTIFICIAL_LAKE,
      CardName.BUSHES,
      CardName.ARTIFICIAL_PHOTOSYNTHESIS,
      CardName.BREATHING_FILTERS]);

    // Ninth card

    expect(draftSelection(player)).deep.eq([
      CardName.BIOMASS_COMBUSTORS,
      CardName.BIRDS,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.BEAM_FROM_A_THORIUM_ASTEROID,
      CardName.BIG_ASTEROID,
    ]);

    selectCard(player, CardName.BIRDS);
    selectCard(otherPlayer, CardName.BEAM_FROM_A_THORIUM_ASTEROID);

    // No longer drafted cards, they're just cards to buy.
    expect(player.draftedCards).is.empty;
    expect(otherPlayer.draftedCards).is.empty;

    expect(initialCardSelection(player)).deep.eq({
      'projectCards': [
        CardName.ADAPTATION_TECHNOLOGY,
        CardName.ARCTIC_ALGAE,
        CardName.AEROBRAKED_AMMONIA_ASTEROID,
        CardName.ARCHAEBACTERIA,
        CardName.ADVANCED_ECOSYSTEMS,
        CardName.ASTEROID_MINING,
        CardName.BLACK_POLAR_DUST,
        CardName.ASTEROID,
        CardName.BIRDS,
        CardName.BIG_ASTEROID,
      ],
      'corporationCards': [
        CardName.TERACTOR,
        CardName.SATURN_SYSTEMS,
      ],
      'preludeCards': [],
    });

    expect(initialCardSelection(otherPlayer)).deep.eq({
      'projectCards': [
        CardName.ALGAE,
        CardName.ANTS,
        CardName.AQUIFER_PUMPING,
        CardName.ADAPTED_LICHEN,
        CardName.ARTIFICIAL_LAKE,
        CardName.BUSHES,
        CardName.ARTIFICIAL_PHOTOSYNTHESIS,
        CardName.BREATHING_FILTERS,
        CardName.BEAM_FROM_A_THORIUM_ASTEROID,
        CardName.BIOMASS_COMBUSTORS,
      ],
      'corporationCards': [
        CardName.UNITED_NATIONS_MARS_INITIATIVE,
        CardName.THORGATE,
      ],
      'preludeCards': [],
    });
  });
});

function getWaitingFor(player: Player): SelectCard<IProjectCard> {
  return cast(player.getWaitingFor(), SelectCard<IProjectCard>);
}

function unshiftCards(deck: Array<IProjectCard>, cards: Array<CardName>) {
  const cardFinder = new CardFinder();
  deck.unshift(...cardFinder.cardsFromJSON(cards));
}

function cardNames(cards: Array<ICard>): Array<CardName> {
  return cards.map((card) => card.name);
}

function initialCardSelection(player: Player) {
  const selectInitialCards = cast(player.getWaitingFor(), SelectInitialCards);
  const corporationCards = cast(selectInitialCards.options[0], SelectCard);
  const preludeCards = selectInitialCards.options.length === 3 ? cast(selectInitialCards.options[1], SelectCard) : undefined;
  const projectCards = cast(selectInitialCards.options.length === 3 ? selectInitialCards.options[2] : selectInitialCards.options[1], SelectCard);
  return {
    corporationCards: cardNames(corporationCards.cards),
    preludeCards: cardNames(preludeCards?.cards ?? []),
    projectCards: cardNames(projectCards.cards),
  };
}

function draftSelection(player: Player) {
  return getWaitingFor(player).cards.map((card) => card.name);
}

function selectCard(player: TestPlayer, cardName: CardName) {
  const selectCard = cast(player.popWaitingFor(), SelectCard);
  const cards = selectCard.cards;
  const card = cards.find((c) => c.name === cardName);
  if (card === undefined) throw new Error(`${cardName} isn't in list`);
  selectCard.cb([card]);
}
