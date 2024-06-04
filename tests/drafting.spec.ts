import {cardsFromJSON} from '../src/server/createCard';
import {CardName} from '../src/common/cards/CardName';
import {cast, finishGeneration} from './TestingUtils';
import {expect} from 'chai';
import {testGame} from './TestGame';
import {ICard} from '../src/server/cards/ICard';
import {IProjectCard} from '../src/server/cards/IProjectCard';
import {IPlayer} from '../src/server/IPlayer';
import {SelectCard} from '../src/server/inputs/SelectCard';
import {SelectInitialCards} from '../src/server/inputs/SelectInitialCards';
import {TestPlayer} from './TestPlayer';
import {Deck} from '../src/server/cards/Deck';
// import {Game} from '../src/server/Game';
// import {Database} from '../src/server/database/Database';

// Tests for drafting
describe('drafting', () => {
  it('2 player - project draft', () => {
    const [game, player, otherPlayer] = testGame(2, {draftVariant: true});
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
    cast(player.getWaitingFor(), undefined);
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
    cast(player.getWaitingFor(), undefined);
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
    cast(player.getWaitingFor(), undefined);
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

  it('3 player - project draft - even generation', () => {
    const [game, player1, player2, player3] = testGame(3, {draftVariant: true});
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
      CardName.IMPORTED_GHG,
      CardName.JOVIAN_EMBASSY,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.JOVIAN_EMBASSY,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    selectCard(player1, CardName.ACQUIRED_COMPANY);
    selectCard(player2, CardName.EARTH_OFFICE);
    selectCard(player3, CardName.IMPORTED_GHG);

    expect(cardNames(player1.draftedCards)).deep.eq([CardName.ACQUIRED_COMPANY]);
    expect(cardNames(player2.draftedCards)).deep.eq([CardName.EARTH_OFFICE]);
    expect(cardNames(player3.draftedCards)).deep.eq([CardName.IMPORTED_GHG]);

    // Second card

    expect(draftSelection(player1)).deep.eq([
      CardName.JOVIAN_EMBASSY,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    expect(draftSelection(player2)).deep.eq([
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(player3)).deep.eq([
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    selectCard(player1, CardName.JOVIAN_EMBASSY);
    selectCard(player2, CardName.BIOFERTILIZER_FACILITY);
    selectCard(player3, CardName.FISH);

    expect(cardNames(player1.draftedCards)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.JOVIAN_EMBASSY,
    ]);
    expect(cardNames(player2.draftedCards)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.BIOFERTILIZER_FACILITY,
    ]);
    expect(cardNames(player3.draftedCards)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.FISH,
    ]);

    // Third round

    expect(draftSelection(player1)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    expect(draftSelection(player2)).deep.eq([
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    expect(draftSelection(player3)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    selectCard(player1, CardName.GENE_REPAIR);
    selectCard(player2, CardName.KELP_FARMING);
    selectCard(player3, CardName.CAPITAL);

    // No longer drafted cards, they're just cards to buy.
    expect(player1.draftedCards).is.empty;
    expect(player2.draftedCards).is.empty;
    expect(player3.draftedCards).is.empty;

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.JOVIAN_EMBASSY,
      CardName.GENE_REPAIR,
      CardName.DECOMPOSERS,
    ]);
    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.KELP_FARMING,
      CardName.HACKERS,
    ]);
    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.FISH,
      CardName.CAPITAL,
      CardName.LAND_CLAIM,
    ]);
  });

  it('3 player - project draft - odd generation', () => {
    const [game, player1, player2, player3] = testGame(3, {draftVariant: true});
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
      CardName.IMPORTED_GHG,
      CardName.JOVIAN_EMBASSY,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    game.generation = 2;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.JOVIAN_EMBASSY,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    selectCard(player1, CardName.ACQUIRED_COMPANY);
    selectCard(player2, CardName.EARTH_OFFICE);
    selectCard(player3, CardName.IMPORTED_GHG);

    expect(cardNames(player1.draftedCards)).deep.eq([CardName.ACQUIRED_COMPANY]);
    expect(cardNames(player2.draftedCards)).deep.eq([CardName.EARTH_OFFICE]);
    expect(cardNames(player3.draftedCards)).deep.eq([CardName.IMPORTED_GHG]);

    // Second card

    expect(draftSelection(player1)).deep.eq([
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    expect(draftSelection(player2)).deep.eq([
      CardName.JOVIAN_EMBASSY,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    expect(draftSelection(player3)).deep.eq([
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    selectCard(player1, CardName.FISH);
    selectCard(player2, CardName.JOVIAN_EMBASSY);
    selectCard(player3, CardName.BIOFERTILIZER_FACILITY);

    expect(cardNames(player1.draftedCards)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.FISH,
    ]);
    expect(cardNames(player2.draftedCards)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.JOVIAN_EMBASSY,
    ]);
    expect(cardNames(player3.draftedCards)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.BIOFERTILIZER_FACILITY,
    ]);

    // Third round

    expect(draftSelection(player1)).deep.eq([
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM]);

    expect(draftSelection(player2)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(player3)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    selectCard(player1, CardName.KELP_FARMING);
    selectCard(player2, CardName.CAPITAL);
    selectCard(player3, CardName.GENE_REPAIR);

    // No longer drafted cards, they're just cards to buy.
    expect(player1.draftedCards).is.empty;
    expect(player2.draftedCards).is.empty;
    expect(player3.draftedCards).is.empty;

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.FISH,
      CardName.KELP_FARMING,
      CardName.DECOMPOSERS,
    ]);
    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.JOVIAN_EMBASSY,
      CardName.CAPITAL,
      CardName.HACKERS,
    ]);
    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.GENE_REPAIR,
      CardName.LAND_CLAIM,
    ]);
  });

  it('2 player - initial draft', () => {
    const shuffle = Deck.shuffle;
    let player: TestPlayer;
    let otherPlayer: TestPlayer;
    try {
      Deck.shuffle = function() {};
      [/* game */, player, otherPlayer] = testGame(2, {draftVariant: true, initialDraftVariant: true});
    } finally {
      Deck.shuffle = shuffle;
    }

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
    cast(player.getWaitingFor(), undefined);
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
    cast(player.getWaitingFor(), undefined);
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
    cast(player.getWaitingFor(), undefined);
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

  it('2 player - initial draft + prelude - prelude draft', () => {
    const shuffle = Deck.shuffle;
    let player: TestPlayer;
    let otherPlayer: TestPlayer;
    try {
      Deck.shuffle = function() {};
      [/* game */, player, otherPlayer] = testGame(2, {draftVariant: true, initialDraftVariant: true, preludeExtension: true, preludeDraftVariant: false});
    } finally {
      Deck.shuffle = shuffle;
    }

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
    selectCard(otherPlayer, CardName.ALGAE);

    selectCard(player, CardName.ARCTIC_ALGAE);
    selectCard(otherPlayer, CardName.ANTS);

    selectCard(player, CardName.AEROBRAKED_AMMONIA_ASTEROID);
    selectCard(otherPlayer, CardName.AQUIFER_PUMPING);

    selectCard(player, CardName.ARCHAEBACTERIA);
    selectCard(otherPlayer, CardName.ADAPTED_LICHEN);

    // And now starts the second draft.

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

    selectCard(player, CardName.BLACK_POLAR_DUST);
    selectCard(otherPlayer, CardName.ARTIFICIAL_PHOTOSYNTHESIS);

    selectCard(player, CardName.ASTEROID);
    selectCard(otherPlayer, CardName.BREATHING_FILTERS);

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
        CardName.VITOR,
        CardName.VALLEY_TRUST,
      ],
      'preludeCards': [
        CardName.EXPERIMENTAL_FOREST,
        CardName.ECOLOGY_EXPERTS,
        CardName.ECCENTRIC_SPONSOR,
        CardName.RESEARCH_NETWORK,
      ],
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
        CardName.ROBINSON_INDUSTRIES,
        CardName.POINT_LUNA,
      ],
      'preludeCards': [
        CardName.ACQUIRED_SPACE_AGENCY,
        CardName.ORBITAL_CONSTRUCTION_YARD,
        CardName.METAL_RICH_ASTEROID,
        CardName.MOHOLE,
      ],
    });
  });


  it('2 player - initial draft + prelude draft', () => {
    const shuffle = Deck.shuffle;
    let player: TestPlayer;
    let otherPlayer: TestPlayer;
    try {
      Deck.shuffle = function() {};
      [/* game */, player, otherPlayer] = testGame(2, {draftVariant: true, initialDraftVariant: true, preludeExtension: true, preludeDraftVariant: true});
    } finally {
      Deck.shuffle = shuffle;
    }

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
    selectCard(otherPlayer, CardName.ALGAE);

    selectCard(player, CardName.ARCTIC_ALGAE);
    selectCard(otherPlayer, CardName.ANTS);

    selectCard(player, CardName.AEROBRAKED_AMMONIA_ASTEROID);
    selectCard(otherPlayer, CardName.AQUIFER_PUMPING);

    selectCard(player, CardName.ARCHAEBACTERIA);
    selectCard(otherPlayer, CardName.ADAPTED_LICHEN);

    // And now starts the second draft.

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

    selectCard(player, CardName.BLACK_POLAR_DUST);
    selectCard(otherPlayer, CardName.ARTIFICIAL_PHOTOSYNTHESIS);

    selectCard(player, CardName.ASTEROID);
    selectCard(otherPlayer, CardName.BREATHING_FILTERS);

    selectCard(player, CardName.BIRDS);
    selectCard(otherPlayer, CardName.BEAM_FROM_A_THORIUM_ASTEROID);

    // Start of the prelude draft

    expect(cardNames(player.draftedCards)).deep.eq([]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([]);

    expect(draftSelection(player)).deep.eq([
      CardName.EXPERIMENTAL_FOREST,
      CardName.ECOLOGY_EXPERTS,
      CardName.ECCENTRIC_SPONSOR,
      CardName.RESEARCH_NETWORK]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ACQUIRED_SPACE_AGENCY,
      CardName.ORBITAL_CONSTRUCTION_YARD,
      CardName.METAL_RICH_ASTEROID,
      CardName.MOHOLE]);

    selectCard(player, CardName.EXPERIMENTAL_FOREST);
    selectCard(otherPlayer, CardName.ACQUIRED_SPACE_AGENCY);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.EXPERIMENTAL_FOREST,
    ]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ACQUIRED_SPACE_AGENCY,
    ]);

    // Second prelude card

    expect(draftSelection(player)).deep.eq([
      CardName.ORBITAL_CONSTRUCTION_YARD,
      CardName.METAL_RICH_ASTEROID,
      CardName.MOHOLE]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ECOLOGY_EXPERTS,
      CardName.ECCENTRIC_SPONSOR,
      CardName.RESEARCH_NETWORK]);

    selectCard(player, CardName.ORBITAL_CONSTRUCTION_YARD);
    selectCard(otherPlayer, CardName.ECOLOGY_EXPERTS);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.EXPERIMENTAL_FOREST,
      CardName.ORBITAL_CONSTRUCTION_YARD,
    ]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.ACQUIRED_SPACE_AGENCY,
      CardName.ECOLOGY_EXPERTS,
    ]);

    // Third prelude card

    expect(draftSelection(player)).deep.eq([
      CardName.ECCENTRIC_SPONSOR,
      CardName.RESEARCH_NETWORK]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.METAL_RICH_ASTEROID,
      CardName.MOHOLE]);

    selectCard(player, CardName.RESEARCH_NETWORK);
    selectCard(otherPlayer, CardName.MOHOLE);

    expect(cardNames(player.draftedCards)).deep.eq([]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([]);

    // End of draft

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
        CardName.VITOR,
        CardName.VALLEY_TRUST,
      ],
      'preludeCards': [
        CardName.EXPERIMENTAL_FOREST,
        CardName.ORBITAL_CONSTRUCTION_YARD,
        CardName.RESEARCH_NETWORK,
        CardName.METAL_RICH_ASTEROID,
      ],
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
        CardName.ROBINSON_INDUSTRIES,
        CardName.POINT_LUNA,
      ],
      'preludeCards': [
        CardName.ACQUIRED_SPACE_AGENCY,
        CardName.ECOLOGY_EXPERTS,
        CardName.MOHOLE,
        CardName.ECCENTRIC_SPONSOR,
      ],
    });
  });
});

function getWaitingFor(player: IPlayer): SelectCard<IProjectCard> {
  return cast(player.getWaitingFor(), SelectCard<IProjectCard>);
}

function unshiftCards(deck: Array<IProjectCard>, cards: Array<CardName>) {
  deck.unshift(...cardsFromJSON(cards));
}

function cardNames(cards: ReadonlyArray<ICard>): Array<CardName> {
  return cards.map((card) => card.name);
}

function initialCardSelection(player: IPlayer) {
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

function draftSelection(player: IPlayer) {
  return getWaitingFor(player).cards.map((card) => card.name);
}

function selectCard(player: TestPlayer, cardName: CardName) {
  const selectCard = cast(player.popWaitingFor(), SelectCard);
  const cards = selectCard.cards;
  const card = cards.find((c) => c.name === cardName);
  if (card === undefined) {
    throw new Error(`${cardName} isn't in list`);
  }
  selectCard.process({type: 'card', cards: [card.name]});

  // await validateState(player);
}

// // This is a helper function to validate the state of the game after each action.
// // In ensures that after serializing and deserializing the game,
// // the state is the same, including the deferred actions.
// async function validateState(player: TestPlayer) {
//   const game = player.game;

//   const serialized = await Database.getInstance().getGameVersion(game.id, game.lastSaveId);
//   const restored = Game.deserialize(serialized);

//   expect(game.deferredActions.length).eq(0);
//   expect(restored.deferredActions.length).eq(0);

//   for (const id of game.getPlayers().map((p) => p.id)) {
//     const livePlayer = game.getPlayerById(id);
//     const restoredPlayer = restored.getPlayerById(id);

//     expect(livePlayer.needsToDraft).eq(restoredPlayer.needsToDraft);
//     expect(livePlayer.getWaitingFor()?.type).eq(restoredPlayer.getWaitingFor()?.type);

//     if (livePlayer.getWaitingFor() instanceof SelectCard) {
//       const liveCards = cast(livePlayer.getWaitingFor(), SelectCard).cards;
//       const restoredCards = cast(restoredPlayer.getWaitingFor(), SelectCard).cards;
//       expect(liveCards.map((c) => c.name)).deep.eq(restoredCards.map((c) => c.name));
//     }
//   }
// }
