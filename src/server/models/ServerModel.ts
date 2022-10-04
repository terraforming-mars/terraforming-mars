import {CardModel} from '../../common/models/CardModel';
import {ColonyModel} from '../../common/models/ColonyModel';
import {Color} from '../../common/Color';
import {Game} from '../Game';
import {GameOptions} from '../GameOptions';
import {SimpleGameModel} from '../../common/models/SimpleGameModel';
import {GameOptionsModel} from '../../common/models/GameOptionsModel';
import {ICard} from '../cards/ICard';
import {isIProjectCard} from '../cards/IProjectCard';
import {isICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {PlayerViewModel, Protection, PublicPlayerModel} from '../../common/models/PlayerModel';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectPayment} from '../inputs/SelectPayment';
import {SelectProjectCardToPlay} from '../inputs/SelectProjectCardToPlay';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceHighlight, SpaceModel} from '../../common/models/SpaceModel';
import {TileType} from '../../common/TileType';
import {Phase} from '../../common/Phase';
import {Resources} from '../../common/Resources';
import {CardType} from '../../common/cards/CardType';
import {
  ClaimedMilestoneModel,
  MilestoneScore,
} from '../../common/models/ClaimedMilestoneModel';
import {FundedAwardModel, AwardScore} from '../../common/models/FundedAwardModel';
import {getTurmoilModel} from '../models/TurmoilModel';
import {SelectDelegate} from '../inputs/SelectDelegate';
import {SelectColony} from '../inputs/SelectColony';
import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {ShiftAresGlobalParameters} from '../inputs/ShiftAresGlobalParameters';
import {SpectatorModel} from '../../common/models/SpectatorModel';
import {Units} from '../../common/Units';
import {SelectPartyToSendDelegate} from '../inputs/SelectPartyToSendDelegate';
import {GameModel} from '../../common/models/GameModel';
import {Turmoil} from '../turmoil/Turmoil';
import {createPathfindersModel} from './PathfindersModel';
import {MoonExpansion} from '../moon/MoonExpansion';
import {MoonModel} from '../../common/models/MoonModel';
import {IColony} from '../colonies/IColony';
import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';

export class Server {
  public static getSimpleGameModel(game: Game): SimpleGameModel {
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
    };
  }

  public static getGameModel(game: Game): GameModel {
    const turmoil = getTurmoilModel(game);

    return {
      aresData: game.aresData,
      awards: this.getAwards(game),
      colonies: this.getColonies(game, game.colonies),
      deckSize: game.projectDeck.drawPile.length,
      discardedColonies: this.getColonies(game, game.discardedColonies, /* showTrackPosition */ false),
      gameAge: game.gameAge,
      gameOptions: this.getGameOptionsAsModel(game.gameOptions),
      generation: game.getGeneration(),
      isSoloModeWin: game.isSoloModeWin(),
      lastSoloGeneration: game.lastSoloGeneration(),
      milestones: this.getMilestones(game),
      moon: this.getMoonModel(game),
      oceans: game.board.getOceanCount(),
      oxygenLevel: game.getOxygenLevel(),
      passedPlayers: game.getPassedPlayers(),
      pathfinders: createPathfindersModel(game),
      phase: game.phase,
      spaces: this.getSpaces(game.board),
      spectatorId: game.spectatorId,
      temperature: game.getTemperature(),
      isTerraformed: game.marsIsTerraformed(),
      turmoil: turmoil,
      undoCount: game.undoCount,
      venusScaleLevel: game.getVenusScaleLevel(),
      step: game.lastSaveId,
      corporationsToDraft: this.getCards(game.getPlayers()[0], game.corporationsToDraft),
    };
  }

  public static getPlayerModel(player: Player): PlayerViewModel {
    const game = player.game;

    const players: Array<PublicPlayerModel> = game.getPlayersInGenerationOrder().map(this.getPlayer);
    const thisPlayerIndex = players.findIndex((p) => p.color === player.color);
    const thisPlayer: PublicPlayerModel = players[thisPlayerIndex];

    return {
      cardsInHand: this.getCards(player, player.cardsInHand, {showCalculatedCost: true}),
      dealtCorporationCards: this.getCards(player, player.dealtCorporationCards),
      dealtPreludeCards: this.getCards(player, player.dealtPreludeCards),
      dealtProjectCards: this.getCards(player, player.dealtProjectCards),
      draftedCorporations: this.getCards(player, player.draftedCorporations),
      draftedCards: this.getCards(player, player.draftedCards, {showCalculatedCost: true}),
      game: this.getGameModel(player.game),
      id: player.id,
      pickedCorporationCard: player.pickedCorporationCard ? this.getCards(player, [player.pickedCorporationCard]) : [],
      preludeCardsInHand: this.getCards(player, player.preludeCardsInHand),
      thisPlayer: thisPlayer,
      waitingFor: this.getWaitingFor(player, player.getWaitingFor()),
      players: players,
    };
  }

  public static getSpectatorModel(game: Game): SpectatorModel {
    return {
      color: Color.NEUTRAL,
      id: game.spectatorId,
      game: this.getGameModel(game),
      players: game.getPlayersInGenerationOrder().map(this.getPlayer),
      thisPlayer: undefined,
    };
  }

  public static getSelfReplicatingRobotsTargetCards(player: Player): Array<CardModel> {
    return player.getSelfReplicatingRobotsTargetCards().map((targetCard) => {
      const model: CardModel = {
        resources: targetCard.resourceCount,
        name: targetCard.card.name,
        calculatedCost: player.getCardCost(targetCard.card),
        cardType: CardType.ACTIVE,
        isDisabled: false,
        reserveUnits: Units.EMPTY, // I wonder if this could just be removed.
        isSelfReplicatingRobotsCard: true,
      };
      return model;
    });
  }

  public static getMilestones(game: Game): Array<ClaimedMilestoneModel> {
    const allMilestones = game.milestones;
    const claimedMilestones = game.claimedMilestones;
    const milestoneModels: Array<ClaimedMilestoneModel> = [];

    for (const milestone of allMilestones) {
      const claimed = claimedMilestones.find(
        (m) => m.milestone.name === milestone.name,
      );
      let scores: Array<MilestoneScore> = [];
      if (claimed === undefined && claimedMilestones.length < 3) {
        scores = game.getPlayers().map((player) => ({
          playerColor: player.color,
          playerScore: milestone.getScore(player),
        }));
      }

      milestoneModels.push({
        player_name: claimed === undefined ? '' : claimed.player.name,
        player_color: claimed === undefined ? '' : claimed.player.color,
        name: milestone.name,
        description: milestone.description,
        scores,
      });
    }

    return milestoneModels;
  }

  public static getAwards(game: Game): Array<FundedAwardModel> {
    const allAwards = game.awards;
    const fundedAwards = game.fundedAwards;
    const awardModels: Array<FundedAwardModel> = [];

    for (const award of allAwards) {
      const funded = fundedAwards.find(
        (a) => a.award.name === award.name,
      );
      let scores: Array<AwardScore> = [];
      if (fundedAwards.length < 3 || funded !== undefined) {
        scores = game.getPlayers().map((player) => ({
          playerColor: player.color,
          playerScore: award.getScore(player),
        }));
      }

      awardModels.push({
        player_name: funded === undefined ? '' : funded.player.name,
        player_color: funded === undefined ? '' : funded.player.color,
        name: award.name,
        description: award.description,
        scores: scores,
      });
    }

    return awardModels;
  }

  public static getWaitingFor(
    player: Player,
    waitingFor: PlayerInput | undefined,
  ): PlayerInputModel | undefined {
    if (waitingFor === undefined) {
      return undefined;
    }
    const playerInputModel: PlayerInputModel = {
      title: waitingFor.title,
      buttonLabel: waitingFor.buttonLabel,
      inputType: waitingFor.inputType,
      amount: undefined,
      options: undefined,
      cards: undefined,
      max: undefined,
      min: undefined,
      canUseSteel: undefined,
      canUseTitanium: undefined,
      canUseLunaTradeFederationTitanium: undefined,
      canUseHeat: undefined,
      canUseSeeds: undefined,
      canUseData: undefined,
      players: undefined,
      availableSpaces: undefined,
      maxByDefault: undefined,
      microbes: undefined,
      floaters: undefined,
      science: undefined,
      seeds: undefined,
      data: undefined,
      coloniesModel: undefined,
      payProduction: undefined,
      aresData: undefined,
      selectBlueCardAction: false,
      availableParties: undefined,
      turmoil: undefined,
    };
    switch (waitingFor.inputType) {
    case PlayerInputType.AND_OPTIONS:
    case PlayerInputType.OR_OPTIONS:
    case PlayerInputType.SELECT_INITIAL_CARDS:
      playerInputModel.options = [];
      if (waitingFor.options !== undefined) {
        for (const option of waitingFor.options) {
          const subOption = this.getWaitingFor(player, option);
          if (subOption !== undefined) {
            playerInputModel.options.push(subOption);
          }
        }
      } else {
        throw new Error('required options not defined');
      }
      break;
    case PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY:
      const spctp: SelectProjectCardToPlay = waitingFor as SelectProjectCardToPlay;
      playerInputModel.cards = this.getCards(player, spctp.cards, {showCalculatedCost: true, reserveUnits: spctp.reserveUnits});
      playerInputModel.microbes = player.getSpendableMicrobes();
      playerInputModel.floaters = player.getSpendableFloaters();
      playerInputModel.canUseHeat = player.canUseHeatAsMegaCredits;
      playerInputModel.canUseLunaTradeFederationTitanium = player.canUseTitaniumAsMegacredits;
      playerInputModel.science = player.getSpendableScienceResources();
      playerInputModel.seeds = player.getSpendableSeedResources();
      break;
    case PlayerInputType.SELECT_CARD:
      const selectCard = waitingFor as SelectCard<ICard>;
      playerInputModel.cards = this.getCards(player, selectCard.cards, {
        showCalculatedCost: selectCard.config.played === false || selectCard.config.played === CardName.SELF_REPLICATING_ROBOTS,
        showResources: selectCard.config.played === true || selectCard.config.played === CardName.SELF_REPLICATING_ROBOTS,
        enabled: selectCard.config.enabled,
      });
      playerInputModel.max = selectCard.config.max;
      playerInputModel.min = selectCard.config.min;
      playerInputModel.showOnlyInLearnerMode = selectCard.config.enabled?.every((p: boolean) => p === false);
      playerInputModel.selectBlueCardAction = selectCard.config.selectBlueCardAction;
      playerInputModel.showOwner = selectCard.config.showOwner === true;
      break;
    case PlayerInputType.SELECT_COLONY:
      playerInputModel.coloniesModel = this.getColonyModel(player.game, (waitingFor as SelectColony).colonies);
      break;
    case PlayerInputType.SELECT_PAYMENT:
      const sp = waitingFor as SelectPayment;
      playerInputModel.amount = sp.amount;
      playerInputModel.canUseSteel = sp.canUseSteel;
      playerInputModel.canUseTitanium = sp.canUseTitanium;
      playerInputModel.canUseHeat = sp.canUseHeat;
      playerInputModel.canUseLunaTradeFederationTitanium = sp.canUseLunaTradeFederationTitanium;
      playerInputModel.canUseSeeds = sp.canUseSeeds;
      playerInputModel.seeds = player.getSpendableSeedResources();
      playerInputModel.canUseData = sp.canUseData;
      playerInputModel.data = player.getSpendableData();
      break;
    case PlayerInputType.SELECT_PLAYER:
      playerInputModel.players = (waitingFor as SelectPlayer).players.map(
        (player) => player.color,
      );
      break;
    case PlayerInputType.SELECT_SPACE:
      playerInputModel.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map(
        (space) => space.id,
      );
      break;
    case PlayerInputType.SELECT_AMOUNT:
      playerInputModel.min = (waitingFor as SelectAmount).min;
      playerInputModel.max = (waitingFor as SelectAmount).max;
      playerInputModel.maxByDefault = (waitingFor as SelectAmount).maxByDefault;
      break;
    case PlayerInputType.SELECT_DELEGATE:
      playerInputModel.players = (waitingFor as SelectDelegate).players.map(
        (player) => {
          if (player === 'NEUTRAL') {
            return 'NEUTRAL';
          } else {
            return player.color;
          }
        },
      );
      break;
    case PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE:
      playerInputModel.availableParties = (waitingFor as SelectPartyToSendDelegate).availableParties;
      if (player.game !== undefined) {
        playerInputModel.turmoil = getTurmoilModel(player.game);
      }
      break;
    case PlayerInputType.SELECT_PRODUCTION_TO_LOSE:
      const _player = (waitingFor as SelectProductionToLose).player;
      playerInputModel.payProduction = {
        cost: (waitingFor as SelectProductionToLose).unitsToLose,
        units: {
          megacredits: _player.production.megacredits,
          steel: _player.production.steel,
          titanium: _player.production.titanium,
          plants: _player.production.plants,
          energy: _player.production.energy,
          heat: _player.production.heat,
        },
      };
      break;
    case PlayerInputType.SHIFT_ARES_GLOBAL_PARAMETERS:
      playerInputModel.aresData = (waitingFor as ShiftAresGlobalParameters).aresData;
      break;
    }
    return playerInputModel;
  }

  public static getCards(
    player: Player,
    cards: Array<ICard>,
    options: {
      showResources?: boolean,
      showCalculatedCost?: boolean,
      reserveUnits?: Array<Units>,
      enabled?: Array<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
    } = {},
  ): Array<CardModel> {
    return cards.map((card, index) => {
      let discount = card.cardDiscount === undefined ? undefined : (Array.isArray(card.cardDiscount) ? card.cardDiscount : [card.cardDiscount]);

      // Too bad this is hard-coded
      if (card.name === CardName.CRESCENT_RESEARCH_ASSOCIATION) {
        discount = [{tag: Tag.MOON, amount: player.tags.count(Tag.MOON)}];
      }
      if (card.name === CardName.MARS_DIRECT) {
        discount = [{tag: Tag.MARS, amount: player.tags.count(Tag.MARS)}];
      }

      const isDisabled = isICorporationCard(card) ? (card.isDisabled || false) : (options.enabled?.[index] === false);

      const model: CardModel = {
        resources: options.showResources ? card.resourceCount : undefined,
        name: card.name,
        calculatedCost: options.showCalculatedCost ? (isIProjectCard(card) && card.cost !== undefined ? player.getCardCost(card) : undefined) : card.cost,
        cardType: card.cardType,
        isDisabled: isDisabled,
        warning: card.warning,
        reserveUnits: options.reserveUnits ? options.reserveUnits[index] : Units.EMPTY,
        bonusResource: isIProjectCard(card) ? card.bonusResource : undefined,
        discount: discount,
        cloneTag: isICloneTagCard(card) ? card.cloneTag : undefined,
      };
      return model;
    });
  }

  public static getPlayer(player: Player): PublicPlayerModel {
    const game = player.game;
    return {
      actionsTakenThisRound: player.actionsTakenThisRound,
      actionsTakenThisGame: player.actionsTakenThisGame,
      actionsThisGeneration: Array.from(player.getActionsThisGeneration()),
      availableBlueCardActionCount: player.getPlayableActionCards().length,
      cardCost: player.cardCost,
      cardDiscount: player.colonies.cardDiscount,
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.game.getCitiesCount(player),
      coloniesCount: player.getColoniesCount(),
      color: player.color,
      energy: player.energy,
      energyProduction: player.production.energy,
      fleetSize: player.colonies.getFleetSize(),
      heat: player.heat,
      heatProduction: player.production.heat,
      id: game.phase === Phase.END ? player.id : player.color,
      influence: Turmoil.ifTurmoilElse(game, (turmoil) => turmoil.getPlayerInfluence(player), () => 0),
      isActive: player.id === game.activePlayer,
      lastCardPlayed: player.lastCardPlayed,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.production.megacredits,
      name: player.name,
      needsToDraft: player.needsToDraft,
      needsToResearch: !game.hasResearched(player),
      noTagsCount: player.getNoTagsCount(),
      plants: player.plants,
      plantProduction: player.production.plants,
      protectedResources: Server.getResourceProtections(player),
      protectedProduction: Server.getProductionProtections(player),
      tableau: Server.getCards(player, player.tableau, {showResources: true}),
      selfReplicatingRobotsCards: Server.getSelfReplicatingRobotsTargetCards(player),
      steel: player.steel,
      steelProduction: player.production.steel,
      steelValue: player.getSteelValue(),
      tags: player.tags.getAllTags(),
      terraformRating: player.getTerraformRating(),
      timer: player.timer.serialize(),
      titanium: player.titanium,
      titaniumProduction: player.production.titanium,
      titaniumValue: player.getTitaniumValue(),
      tradesThisGeneration: player.colonies.tradesThisGeneration,
      victoryPointsBreakdown: player.getVictoryPoints(),
      victoryPointsByGeneration: player.victoryPointsByGeneration,
    };
  }

  private static getResourceProtections(player: Player) {
    const protection: Record<Resources, Protection> = {
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

  private static getProductionProtections(player: Player) {
    const defaultProteection = player.cardIsInEffect(CardName.PRIVATE_SECURITY) ? 'on' : 'off';
    const protection: Record<Resources, Protection> = {
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

  public static getColonies(game: Game, colonies: Array<IColony>, isActive: boolean = true): Array<ColonyModel> {
    return colonies.map(
      (colony): ColonyModel => ({
        colonies: colony.colonies.map(
          (playerId): Color => game.getPlayerById(playerId).color,
        ),
        isActive: isActive && colony.isActive,
        name: colony.name,
        trackPosition: colony.trackPosition,
        visitor:
          colony.visitor === undefined ?
            undefined :
            game.getPlayerById(colony.visitor).color,
      }),
    );
  }

  // Oceans can't be owned so they shouldn't have a color associated with them
  // Land claim can have a color on a space without a tile
  private static getColor(space: ISpace): Color | undefined {
    if (
      (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined
    ) {
      return space.player.color;
    }
    if (space.tile?.protectedHazard === true) {
      return Color.BRONZE;
    }
    return undefined;
  }

  private static getSpaces(board: Board): Array<SpaceModel> {
    const volcanicSpaceIds = board.getVolcanicSpaceIds();
    const noctisCitySpaceIds = board.getNoctisCitySpaceId();

    return board.spaces.map((space) => {
      let highlight: SpaceHighlight = undefined;
      if (volcanicSpaceIds.includes(space.id)) {
        highlight = 'volcanic';
      } else if (noctisCitySpaceIds === space.id) {
        highlight = 'noctis';
      }
      return {
        x: space.x,
        y: space.y,
        id: space.id,
        bonus: space.bonus,
        spaceType: space.spaceType,
        tileType: space.tile && space.tile.tileType,
        color: this.getColor(space),
        highlight: highlight,
      };
    });
  }

  public static getGameOptionsAsModel(options: GameOptions): GameOptionsModel {
    return {
      altVenusBoard: options.altVenusBoard,
      aresExtension: options.aresExtension,
      boardName: options.boardName,
      bannedCards: options.bannedCards,
      coloniesExtension: options.coloniesExtension,
      communityCardsOption: options.communityCardsOption,
      corporateEra: options.corporateEra,
      draftVariant: options.draftVariant,
      corporationsDraft: options.corporationsDraft,
      escapeVelocityMode: options.escapeVelocityMode,
      escapeVelocityThreshold: options.escapeVelocityThreshold,
      escapeVelocityPeriod: options.escapeVelocityPeriod,
      escapeVelocityPenalty: options.escapeVelocityPenalty,
      fastModeOption: options.fastModeOption,
      includeVenusMA: options.includeVenusMA,
      initialDraftVariant: options.initialDraftVariant,
      moonExpansion: options.moonExpansion,
      pathfindersExpansion: options.pathfindersExpansion,
      preludeExtension: options.preludeExtension,
      promoCardsOption: options.promoCardsOption,
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
      turmoilExtension: options.turmoilExtension,
      venusNextExtension: options.venusNextExtension,
      undoOption: options.undoOption,
    };
  }

  private static getColonyModel(game: Game, colonies: Array<IColony>) : Array<ColonyModel> {
    return colonies.map(
      (colony): ColonyModel => ({
        colonies: colony.colonies.map(
          (playerId): Color => game.getPlayerById(playerId).color,
        ),
        isActive: colony.isActive,
        name: colony.name,
        trackPosition: colony.trackPosition,
        visitor:
                colony.visitor === undefined ?
                  undefined :
                  game.getPlayerById(colony.visitor).color,
      }),
    );
  }
  private static getMoonModel(game: Game): MoonModel | undefined {
    return MoonExpansion.ifElseMoon(game, (moonData) => {
      return {
        logisticsRate: moonData.logisticRate,
        miningRate: moonData.miningRate,
        colonyRate: moonData.colonyRate,
        spaces: this.getSpaces(moonData.moon),
      };
    }, () => undefined);
  }
}
