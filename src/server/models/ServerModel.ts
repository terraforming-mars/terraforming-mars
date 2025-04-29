import {CardModel} from '../../common/models/CardModel';
import {Color} from '../../common/Color';
import {IGame} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {SimpleGameModel} from '../../common/models/SimpleGameModel';
import {GameOptionsModel} from '../../common/models/GameOptionsModel';
import {Board} from '../boards/Board';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';
import {PlayerViewModel, Protection, PublicPlayerModel} from '../../common/models/PlayerModel';
import {SpaceHighlight, SpaceModel} from '../../common/models/SpaceModel';
import {TileType} from '../../common/TileType';
import {Phase} from '../../common/Phase';
import {Resource} from '../../common/Resource';
import {ClaimedMilestoneModel, MilestoneScore} from '../../common/models/ClaimedMilestoneModel';
import {FundedAwardModel, AwardScore} from '../../common/models/FundedAwardModel';
import {getTurmoilModel} from '../models/TurmoilModel';
import {SpectatorModel} from '../../common/models/SpectatorModel';
import {GameModel} from '../../common/models/GameModel';
import {Turmoil} from '../turmoil/Turmoil';
import {createPathfindersModel} from './PathfindersModel';
import {MoonExpansion} from '../moon/MoonExpansion';
import {MoonModel} from '../../common/models/MoonModel';
import {CardName} from '../../common/cards/CardName';
import {AwardScorer} from '../awards/AwardScorer';
import {SpaceId} from '../../common/Types';
import {cardsToModel, coloniesToModel} from './ModelUtils';
import {runId} from '../utils/server-ids';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';
import {toName} from '../../common/utils/utils';
import {MAX_AWARDS, MAX_MILESTONES} from '../../common/constants';

export class Server {
  public static getSimpleGameModel(game: IGame): SimpleGameModel {
    return {
      activePlayer: game.getPlayerById(game.activePlayer).color,
      id: game.id,
      phase: game.phase,
      players: game.getPlayersInGenerationOrder().map((player) => ({
        color: player.color,
        id: player.id,
        name: player.name,
      })),
      spectatorId: game.spectatorId,
      gameOptions: this.getGameOptionsAsModel(game.gameOptions),
      lastSoloGeneration: game.lastSoloGeneration(),
      expectedPurgeTimeMs: game.expectedPurgeTimeMs(),
    };
  }

  public static getGameModel(game: IGame): GameModel {
    const turmoil = getTurmoilModel(game);

    return {
      aresData: game.aresData,
      awards: this.getAwards(game),
      colonies: coloniesToModel(game, game.colonies, false, true),
      deckSize: game.projectDeck.drawPile.length,
      discardedColonies: game.discardedColonies.map(toName),
      expectedPurgeTimeMs: game.expectedPurgeTimeMs(),
      gameAge: game.gameAge,
      gameOptions: this.getGameOptionsAsModel(game.gameOptions),
      generation: game.getGeneration(),
      globalsPerGeneration: game.gameIsOver() ? game.globalsPerGeneration : [],
      isSoloModeWin: game.isSoloModeWin(),
      isTerraformed: game.marsIsTerraformed(),
      lastSoloGeneration: game.lastSoloGeneration(),
      milestones: this.getMilestones(game),
      moon: this.getMoonModel(game),
      oceans: game.board.getOceanSpaces().length,
      oxygenLevel: game.getOxygenLevel(),
      passedPlayers: game.getPassedPlayers(),
      pathfinders: createPathfindersModel(game),
      phase: game.phase,
      spaces: this.getSpaces(game.board, game.gagarinBase, game.stJosephCathedrals, game.nomadSpace),
      spectatorId: game.spectatorId,
      step: game.lastSaveId,
      temperature: game.getTemperature(),
      tags: game.tags,
      turmoil: turmoil,
      undoCount: game.undoCount,
      venusScaleLevel: game.getVenusScaleLevel(),
    };
  }

  public static getPlayerModel(player: IPlayer): PlayerViewModel {
    const game = player.game;

    const players: Array<PublicPlayerModel> = game.getPlayersInGenerationOrder().map(this.getPlayer);

    const thisPlayerIndex = players.findIndex((p) => p.color === player.color);
    const thisPlayer: PublicPlayerModel = players[thisPlayerIndex];

    const rv: PlayerViewModel = {
      cardsInHand: cardsToModel(player, player.cardsInHand, {showCalculatedCost: true}),
      ceoCardsInHand: cardsToModel(player, player.ceoCardsInHand),
      dealtCorporationCards: cardsToModel(player, player.dealtCorporationCards),
      dealtPreludeCards: cardsToModel(player, player.dealtPreludeCards),
      dealtCeoCards: cardsToModel(player, player.dealtCeoCards),
      dealtProjectCards: cardsToModel(player, player.dealtProjectCards),
      draftedCards: cardsToModel(player, player.draftedCards, {showCalculatedCost: true}),
      game: this.getGameModel(player.game),
      id: player.id,
      runId: runId,
      pickedCorporationCard: player.pickedCorporationCard ? cardsToModel(player, [player.pickedCorporationCard]) : [],
      preludeCardsInHand: cardsToModel(player, player.preludeCardsInHand),
      thisPlayer: thisPlayer,
      waitingFor: this.getWaitingFor(player, player.getWaitingFor()),
      players: players,
      autopass: player.autopass,
    };
    return rv;
  }

  public static getSpectatorModel(game: IGame): SpectatorModel {
    return {
      color: 'neutral',
      id: game.spectatorId,
      game: this.getGameModel(game),
      players: game.getPlayersInGenerationOrder().map(this.getPlayer),
      thisPlayer: undefined,
      runId: runId,
    };
  }

  public static getSelfReplicatingRobotsTargetCards(player: IPlayer): Array<CardModel> {
    return player.getSelfReplicatingRobotsTargetCards().map((targetCard) => {
      const model: CardModel = {
        resources: targetCard.resourceCount,
        name: targetCard.name,
        calculatedCost: player.getCardCost(targetCard),
        isSelfReplicatingRobotsCard: true,
      };
      return model;
    });
  }

  public static getMilestones(game: IGame): Array<ClaimedMilestoneModel> {
    const allMilestones = game.milestones;
    const claimedMilestones = game.claimedMilestones;
    const milestoneModels: Array<ClaimedMilestoneModel> = [];

    for (const milestone of allMilestones) {
      const claimed = claimedMilestones.find(
        (m) => m.milestone.name === milestone.name,
      );
      let scores: Array<MilestoneScore> = [];
      if (claimed === undefined && claimedMilestones.length < MAX_MILESTONES) {
        scores = game.getPlayers().map((player) => ({
          playerColor: player.color,
          playerScore: milestone.getScore(player),
        }));
      }

      milestoneModels.push({
        playerName: claimed?.player.name,
        playerColor: claimed?.player.color,
        name: milestone.name,
        scores,
      });
    }

    return milestoneModels;
  }

  public static getAwards(game: IGame): Array<FundedAwardModel> {
    const fundedAwards = game.fundedAwards;
    const awardModels: Array<FundedAwardModel> = [];

    for (const award of game.awards) {
      const funded = fundedAwards.find((a) => a.award.name === award.name);
      const scorer = new AwardScorer(game, award);
      let scores: Array<AwardScore> = [];
      if (fundedAwards.length < MAX_AWARDS || funded !== undefined) {
        scores = game.getPlayers().map((player) => ({
          playerColor: player.color,
          playerScore: scorer.get(player),
        }));
      }

      awardModels.push({
        playerName: funded?.player.name,
        playerColor: funded?.player.color,
        name: award.name,
        scores: scores,
      });
    }

    return awardModels;
  }

  public static getWaitingFor(
    player: IPlayer,
    waitingFor: PlayerInput | undefined,
  ): PlayerInputModel | undefined {
    if (waitingFor === undefined) {
      return undefined;
    }
    // TODO(kberg): in theory this should be in all the other toModel calls.
    const model = waitingFor.toModel(player);
    model.warning = waitingFor.warning;
    return model;
    // showReset: player.game.inputsThisRound > 0 && player.game.resettable === true && player.game.phase === Phase.ACTION,
  }

  public static getPlayer(player: IPlayer): PublicPlayerModel {
    const game = player.game;
    const useHandicap = game.getPlayers().some((p) => p.handicap !== 0);
    const model: PublicPlayerModel = {
      actionsTakenThisRound: player.actionsTakenThisRound,
      actionsTakenThisGame: player.actionsTakenThisGame,
      actionsThisGeneration: Array.from(player.actionsThisGeneration),
      availableBlueCardActionCount: player.getAvailableBlueActionCount(),
      cardCost: player.cardCost,
      cardDiscount: player.colonies.cardDiscount,
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: game.board.getCities(player).length,
      coloniesCount: player.getColoniesCount(),
      color: player.color,
      energy: player.energy,
      energyProduction: player.production.energy,
      fleetSize: player.colonies.getFleetSize(),
      handicap: useHandicap ? player.handicap : undefined,
      heat: player.heat,
      heatProduction: player.production.heat,
      id: game.phase === Phase.END ? player.id : undefined,
      influence: Turmoil.ifTurmoilElse(game, (turmoil) => turmoil.getPlayerInfluence(player), () => 0),
      isActive: player.id === game.activePlayer,
      lastCardPlayed: player.lastCardPlayed,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.production.megacredits,
      name: player.name,
      needsToDraft: player.needsToDraft,
      needsToResearch: !game.hasResearched(player),
      noTagsCount: player.tags.numberOfCardsWithNoTags(),
      plants: player.plants,
      plantProduction: player.production.plants,
      protectedResources: Server.getResourceProtections(player),
      protectedProduction: Server.getProductionProtections(player),
      tableau: cardsToModel(player, player.tableau, {showResources: true}),
      selfReplicatingRobotsCards: Server.getSelfReplicatingRobotsTargetCards(player),
      steel: player.steel,
      steelProduction: player.production.steel,
      steelValue: player.getSteelValue(),
      tags: player.tags.countAllTags(),
      terraformRating: player.getTerraformRating(),
      timer: player.timer.serialize(),
      titanium: player.titanium,
      titaniumProduction: player.production.titanium,
      titaniumValue: player.getTitaniumValue(),
      tradesThisGeneration: player.colonies.tradesThisGeneration,
      corruption: player.underworldData.corruption,
      victoryPointsBreakdown: {
        terraformRating: 0,
        milestones: 0,
        awards: 0,
        greenery: 0,
        city: 0,
        escapeVelocity: 0,
        moonHabitats: 0,
        moonMines: 0,
        moonRoads: 0,
        planetaryTracks: 0,
        victoryPoints: 0,
        total: 0,
        detailsCards: [],
        detailsMilestones: [],
        detailsAwards: [],
        detailsPlanetaryTracks: [],
        negativeVP: 0,
      },
      victoryPointsByGeneration: [],
      excavations: UnderworldExpansion.excavationMarkerCount(player),
      alliedParty: player.alliedParty,
    };

    if (game.phase === Phase.END || game.isSoloMode() || game.gameOptions.showOtherPlayersVP === true) {
      model.victoryPointsBreakdown = player.getVictoryPoints();
      model.victoryPointsByGeneration = player.victoryPointsByGeneration;
    }

    return model;
  }

  private static getResourceProtections(player: IPlayer) {
    const protection: Record<Resource, Protection> = {
      megacredits: 'off',
      steel: 'off',
      titanium: 'off',
      plants: 'off',
      energy: 'off',
      heat: 'off',
    };

    if (player.alloysAreProtected()) {
      protection.steel = 'on';
      protection.titanium = 'on';
    }

    if (player.plantsAreProtected()) {
      protection.plants = 'on';
    } else if (player.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
      protection.plants = 'half';
    }

    return protection;
  }

  private static getProductionProtections(player: IPlayer) {
    const defaultProteection = player.cardIsInEffect(CardName.PRIVATE_SECURITY) ? 'on' : 'off';
    const protection: Record<Resource, Protection> = {
      megacredits: defaultProteection,
      steel: defaultProteection,
      titanium: defaultProteection,
      plants: defaultProteection,
      energy: defaultProteection,
      heat: defaultProteection,
    };

    if (player.alloysAreProtected()) {
      protection.steel = 'on';
      protection.titanium = 'on';
    }

    return protection;
  }

  // Oceans can't be owned so they shouldn't have a color associated with them
  // Land claim can have a color on a space without a tile
  private static getColor(space: Space): Color | undefined {
    if (
      (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined
    ) {
      return space.player.color;
    }
    if (space.tile?.protectedHazard === true) {
      return 'bronze';
    }
    return undefined;
  }

  private static getSpaces(
    board: Board,
    gagarin: ReadonlyArray<SpaceId> = [],
    cathedrals: ReadonlyArray<SpaceId> = [],
    nomads: SpaceId | undefined = undefined): Array<SpaceModel> {
    const volcanicSpaceIds = board.volcanicSpaceIds;
    const noctisCitySpaceId = board.noctisCitySpaceId;

    return board.spaces.map((space) => {
      let highlight: SpaceHighlight = undefined;
      if (volcanicSpaceIds.includes(space.id)) {
        highlight = 'volcanic';
      } else if (noctisCitySpaceId === space.id) {
        highlight = 'noctis';
      }

      const model: SpaceModel = {
        x: space.x,
        y: space.y,
        id: space.id,
        spaceType: space.spaceType,
        bonus: space.bonus,
      };
      const tileType = space.tile?.tileType;
      if (tileType !== undefined) {
        model.tileType = tileType;
      }
      const color = this.getColor(space);
      if (color !== undefined) {
        model.color = color;
      }
      if (highlight === undefined) {
        model.highlight = highlight;
      }
      if (space.tile?.rotated === true) {
        model.rotated = true;
      }
      const gagarinIndex = gagarin.indexOf(space.id);
      if (gagarinIndex > -1) {
        model.gagarin = gagarinIndex;
      }
      if (cathedrals.includes(space.id)) {
        model.cathedral = true;
      }
      if (space.id === nomads) {
        model.nomads = true;
      }
      if (space.undergroundResources !== undefined) {
        model.undergroundResources = space.undergroundResources;
      }
      if (space.excavator !== undefined) {
        model.excavator = space.excavator.color;
      }
      if (space.coOwner !== undefined) {
        model.coOwner = space.coOwner.color;
      }

      return model;
    });
  }

  public static getGameOptionsAsModel(options: GameOptions): GameOptionsModel {
    return {
      altVenusBoard: options.altVenusBoard,
      aresExtremeVariant: options.aresExtremeVariant,
      boardName: options.boardName,
      bannedCards: options.bannedCards,
      draftVariant: options.draftVariant,
      escapeVelocityMode: options.escapeVelocityMode,
      escapeVelocityThreshold: options.escapeVelocityThreshold,
      escapeVelocityBonusSeconds: options.escapeVelocityBonusSeconds,
      escapeVelocityPeriod: options.escapeVelocityPeriod,
      escapeVelocityPenalty: options.escapeVelocityPenalty,
      expansions: {
        corpera: options.corporateEra,
        promo: options.promoCardsOption,
        venus: options.venusNextExtension,
        colonies: options.coloniesExtension,
        prelude: options.preludeExtension,
        prelude2: options.prelude2Expansion,
        turmoil: options.turmoilExtension,
        community: options.communityCardsOption,
        ares: options.aresExtension,
        moon: options.moonExpansion,
        pathfinders: options.pathfindersExpansion,
        ceo: options.ceoExtension,
        starwars: options.starWarsExpansion,
        underworld: options.underworldExpansion,
      },
      fastModeOption: options.fastModeOption,
      includedCards: options.includedCards,
      includeFanMA: options.includeFanMA,
      initialDraftVariant: options.initialDraftVariant,
      preludeDraftVariant: options.preludeDraftVariant,
      politicalAgendasExtension: options.politicalAgendasExtension,
      removeNegativeGlobalEvents: options.removeNegativeGlobalEventsOption,
      showOtherPlayersVP: options.showOtherPlayersVP,
      showTimers: options.showTimers,
      shuffleMapOption: options.shuffleMapOption,
      solarPhaseOption: options.solarPhaseOption,
      soloTR: options.soloTR,
      randomMA: options.randomMA,
      requiresMoonTrackCompletion: options.requiresMoonTrackCompletion,
      requiresVenusTrackCompletion: options.requiresVenusTrackCompletion,
      twoCorpsVariant: options.twoCorpsVariant,
      undoOption: options.undoOption,
    };
  }

  private static getMoonModel(game: IGame): MoonModel | undefined {
    return MoonExpansion.ifElseMoon(game, (moonData) => {
      return {
        logisticsRate: moonData.logisticRate,
        miningRate: moonData.miningRate,
        habitatRate: moonData.habitatRate,
        spaces: this.getSpaces(moonData.moon),
      };
    }, () => undefined);
  }
}
