import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {Color} from '../Color';
import {Game, GameOptions} from '../Game';
import {SimpleGameModel} from './SimpleGameModel';
import {GameOptionsModel} from './GameOptionsModel';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {isICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from './PlayerInputModel';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerViewModel, PublicPlayerModel} from './PlayerModel';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectHowToPayForProjectCard} from '../inputs/SelectHowToPayForProjectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceHighlight, SpaceModel} from './SpaceModel';
import {TileType} from '../TileType';
import {Phase} from '../Phase';
import {Resources} from '../Resources';
import {CardType} from '../cards/CardType';
import {
  ClaimedMilestoneModel,
  IMilestoneScore,
} from './ClaimedMilestoneModel';
import {FundedAwardModel, IAwardScore} from './FundedAwardModel';
import {
  getTurmoilModel,
} from './TurmoilModel';
import {SelectDelegate} from '../inputs/SelectDelegate';
import {SelectColony} from '../inputs/SelectColony';
import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {ShiftAresGlobalParameters} from '../inputs/ShiftAresGlobalParameters';
import {SpectatorModel} from './SpectatorModel';
import {MoonModel} from './MoonModel';
import {Units} from '../Units';
import {SelectPartyToSendDelegate} from '../inputs/SelectPartyToSendDelegate';
import {GameModel} from './GameModel';
import {Turmoil} from '../turmoil/Turmoil';
import {PathfindersModel} from './PathfindersModel';

export class Server {
  public static getSimpleGameModel(game: Game): SimpleGameModel {
    return {
      activePlayer: game.getPlayerById(game.activePlayer).color,
      id: game.id,
      phase: game.phase,
      players: game.getPlayers().map((player) => ({
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
      colonies: this.getColonies(game),
      deckSize: game.dealer.getDeckSize(),
      gameAge: game.gameAge,
      gameOptions: this.getGameOptionsAsModel(game.gameOptions),
      generation: game.getGeneration(),
      isSoloModeWin: game.isSoloModeWin(),
      lastSoloGeneration: game.lastSoloGeneration(),
      milestones: this.getMilestones(game),
      moon: MoonModel.serialize(game),
      oceans: game.board.getOceansOnBoard(),
      oxygenLevel: game.getOxygenLevel(),
      passedPlayers: game.getPassedPlayers(),
      pathfinders: PathfindersModel.serialize(game),
      phase: game.phase,
      spaces: this.getSpaces(game.board),
      spectatorId: game.spectatorId,
      temperature: game.getTemperature(),
      isTerraformed: game.marsIsTerraformed(),
      turmoil: turmoil,
      undoCount: game.undoCount,
      venusScaleLevel: game.getVenusScaleLevel(),
      step: game.lastSaveId,
    };
  }

  public static getPlayerModel(player: Player): PlayerViewModel {
    const game = player.game;

    const players: Array<PublicPlayerModel> = game.getPlayers().map(this.getPlayer);
    const thisPlayerIndex: number = players.findIndex((p) => p.color === player.color);
    const thisPlayer: PublicPlayerModel = players[thisPlayerIndex];

    return {
      cardsInHand: this.getCards(player, player.cardsInHand, {showNewCost: true}),
      dealtCorporationCards: this.getCards(player, player.dealtCorporationCards),
      dealtPreludeCards: this.getCards(player, player.dealtPreludeCards),
      dealtProjectCards: this.getCards(player, player.dealtProjectCards),
      draftedCards: this.getCards(player, player.draftedCards, {showNewCost: true}),
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
      id: game.spectatorId ?? '',
      game: this.getGameModel(game),
      players: game.getPlayers().map(this.getPlayer),
      thisPlayer: undefined,
    };
  }

  public static getSelfReplicatingRobotsTargetCards(player: Player): Array<CardModel> {
    return player.getSelfReplicatingRobotsTargetCards().map((targetCard) => ({
      resources: targetCard.resourceCount,
      resourceType: undefined, // Card on SRR cannot gather its own resources (if any)
      name: targetCard.card.name,
      calculatedCost: player.getCardCost(targetCard.card),
      cardType: CardType.ACTIVE,
      isDisabled: false,
      reserveUnits: Units.EMPTY, // I wonder if this could just be removed.
    }));
  }

  public static getMilestones(game: Game): Array<ClaimedMilestoneModel> {
    const allMilestones = game.milestones;
    const claimedMilestones = game.claimedMilestones;
    const milestoneModels: Array<ClaimedMilestoneModel> = [];

    for (const milestone of allMilestones) {
      const claimed = claimedMilestones.find(
        (m) => m.milestone.name === milestone.name,
      );
      const scores: Array<IMilestoneScore> = [];
      if (claimed === undefined && claimedMilestones.length < 3) {
        game.getPlayers().forEach((player) => {
          scores.push({
            playerColor: player.color,
            playerScore: milestone.getScore(player),
          });
        });
      }

      milestoneModels.push({
        player_name: claimed === undefined ? '' : claimed.player.name,
        player_color: claimed === undefined ? '' : claimed.player.color,
        milestone,
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
      const scores: Array<IAwardScore> = [];
      if (fundedAwards.length < 3 || funded !== undefined) {
        game.getPlayers().forEach((player) => {
          scores.push({
            playerColor: player.color,
            playerScore: award.getScore(player),
          });
        });
      }

      awardModels.push({
        player_name: funded === undefined ? '' : funded.player.name,
        player_color: funded === undefined ? '' : funded.player.color,
        award,
        scores: scores,
      });
    }

    return awardModels;
  }

  public static getCorporationCard(player: Player): CardModel | undefined {
    if (player.corporationCard === undefined) return undefined;
    return {
      name: player.corporationCard.name,
      resources: player.getResourcesOnCard(player.corporationCard),
      cardType: CardType.CORPORATION,
      isDisabled: player.corporationCard.isDisabled,
      warning: player.corporationCard.warning,
      discount: player.corporationCard.cardDiscount,
    } as CardModel;
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
      maxCardsToSelect: undefined,
      minCardsToSelect: undefined,
      canUseSteel: undefined,
      canUseTitanium: undefined,
      canUseHeat: undefined,
      canUseSeeds: undefined,
      players: undefined,
      availableSpaces: undefined,
      min: undefined,
      max: undefined,
      maxByDefault: undefined,
      microbes: undefined,
      floaters: undefined,
      science: undefined,
      seeds: undefined,
      coloniesModel: undefined,
      payProduction: undefined,
      aresData: undefined,
      selectBlueCardAction: false,
      availableParties: undefined,
      turmoil: undefined,
    };
    switch (waitingFor.inputType) {
    case PlayerInputTypes.AND_OPTIONS:
    case PlayerInputTypes.OR_OPTIONS:
    case PlayerInputTypes.SELECT_INITIAL_CARDS:
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
    case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD:
      const shtpfpc: SelectHowToPayForProjectCard = waitingFor as SelectHowToPayForProjectCard;
      playerInputModel.cards = this.getCards(player, shtpfpc.cards, {showNewCost: true, reserveUnits: shtpfpc.reserveUnits});
      playerInputModel.microbes = shtpfpc.microbes;
      playerInputModel.floaters = shtpfpc.floaters;
      playerInputModel.canUseHeat = shtpfpc.canUseHeat;
      playerInputModel.science = shtpfpc.scienceResources;
      playerInputModel.seeds = shtpfpc.seedResources;
      break;
    case PlayerInputTypes.SELECT_CARD:
      const selectCard = waitingFor as SelectCard<ICard>;
      playerInputModel.cards = this.getCards(player, selectCard.cards, {
        showNewCost: !selectCard.played,
        showResources: selectCard.played,
        enabled: selectCard.enabled,
      });
      playerInputModel.maxCardsToSelect = selectCard.maxCardsToSelect;
      playerInputModel.minCardsToSelect = selectCard.minCardsToSelect;
      playerInputModel.showOnlyInLearnerMode = selectCard.enabled?.every((p: boolean) => p === false);
      playerInputModel.selectBlueCardAction = selectCard.selectBlueCardAction;
      if (selectCard.showOwner) {
        playerInputModel.showOwner = true;
      }
      break;
    case PlayerInputTypes.SELECT_COLONY:
      playerInputModel.coloniesModel = ColonyModel.getColonyModel(player.game, (waitingFor as SelectColony).colonies);
      break;
    case PlayerInputTypes.SELECT_HOW_TO_PAY:
      playerInputModel.amount = (waitingFor as SelectHowToPay).amount;
      playerInputModel.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
      playerInputModel.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
      playerInputModel.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
      playerInputModel.canUseSeeds = (waitingFor as SelectHowToPay).canUseSeeds;
      playerInputModel.seeds = player.getSpendableSeedResources();
      break;
    case PlayerInputTypes.SELECT_PLAYER:
      playerInputModel.players = (waitingFor as SelectPlayer).players.map(
        (player) => player.color,
      );
      break;
    case PlayerInputTypes.SELECT_SPACE:
      playerInputModel.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map(
        (space) => space.id,
      );
      break;
    case PlayerInputTypes.SELECT_AMOUNT:
      playerInputModel.min = (waitingFor as SelectAmount).min;
      playerInputModel.max = (waitingFor as SelectAmount).max;
      playerInputModel.maxByDefault = (waitingFor as SelectAmount).maxByDefault;
      break;
    case PlayerInputTypes.SELECT_DELEGATE:
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
    case PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE:
      playerInputModel.availableParties = (waitingFor as SelectPartyToSendDelegate).availableParties;
      if (player.game !== undefined) {
        playerInputModel.turmoil = getTurmoilModel(player.game);
      }
      break;
    case PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE:
      const _player = (waitingFor as SelectProductionToLose).player;
      playerInputModel.payProduction = {
        cost: (waitingFor as SelectProductionToLose).unitsToLose,
        units: {
          megacredits: _player.getProduction(Resources.MEGACREDITS),
          steel: _player.getProduction(Resources.STEEL),
          titanium: _player.getProduction(Resources.TITANIUM),
          plants: _player.getProduction(Resources.PLANTS),
          energy: _player.getProduction(Resources.ENERGY),
          heat: _player.getProduction(Resources.HEAT),
        },
      };
      break;
    case PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS:
      playerInputModel.aresData = (waitingFor as ShiftAresGlobalParameters).aresData;
      break;
    };
    return playerInputModel;
  }

  public static getCards(
    player: Player,
    cards: Array<ICard>,
    options: {
    showResources?: boolean,
    showNewCost?: boolean,
    reserveUnits?: Array<Units>,
    enabled?: Array<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
  } = {},
  ): Array<CardModel> {
    return cards.map((card, index) => ({
      resources: options.showResources ? player.getResourcesOnCard(card) : undefined,
      resourceType: card.resourceType,
      name: card.name,
      calculatedCost: options.showNewCost ? (card.cost === undefined ? undefined : player.getCardCost(card as IProjectCard)) : card.cost,
      cardType: card.cardType,
      isDisabled: options.enabled?.[index] === false,
      warning: card.warning,
      reserveUnits: options.reserveUnits ? options.reserveUnits[index] : Units.EMPTY,
      bonusResource: (card as IProjectCard).bonusResource,
      discount: card.cardDiscount,
      cloneTag: isICloneTagCard(card) ? card.cloneTag : undefined,
    }));
  }

  public static getPlayer(player: Player): PublicPlayerModel {
    const game = player.game;
    return {
      actionsTakenThisRound: player.actionsTakenThisRound,
      actionsTakenThisGame: player.actionsTakenThisGame,
      actionsThisGeneration: Array.from(player.getActionsThisGeneration()),
      availableBlueCardActionCount: player.getAvailableBlueActionCount(),
      cardCost: player.cardCost,
      cardDiscount: player.cardDiscount,
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(),
      coloniesCount: player.getColoniesCount(),
      color: player.color,
      corporationCard: Server.getCorporationCard(player),
      energy: player.energy,
      energyProduction: player.getProduction(Resources.ENERGY),
      fleetSize: player.getFleetSize(),
      heat: player.heat,
      heatProduction: player.getProduction(Resources.HEAT),
      id: game.phase === Phase.END ? player.id : player.color,
      influence: Turmoil.ifTurmoilElse(game, (turmoil) => turmoil.getPlayerInfluence(player), () => 0),
      isActive: player.id === game.activePlayer,
      lastCardPlayed: player.lastCardPlayed,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
      name: player.name,
      needsToDraft: player.needsToDraft,
      needsToResearch: !game.hasResearched(player),
      noTagsCount: player.getNoTagsCount(),
      plants: player.plants,
      plantProduction: player.getProduction(Resources.PLANTS),
      plantsAreProtected: player.plantsAreProtected(),
      playedCards: Server.getCards(player, player.playedCards, {showResources: true}),
      selfReplicatingRobotsCards: Server.getSelfReplicatingRobotsTargetCards(player),
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(),
      tags: player.getAllTags(),
      terraformRating: player.getTerraformRating(),
      timer: player.timer.serialize(),
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.getTitaniumValue(),
      tradesThisGeneration: player.tradesThisGeneration,
      victoryPointsBreakdown: player.getVictoryPoints(),
    };
  }

  public static getColonies(game: Game): Array<ColonyModel> {
    return game.colonies.map(
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

  // Oceans can't be owned so they shouldn't have a color associated with them
  // Land claim can have a color on a space without a tile
  public static getColor(space: ISpace): Color | undefined {
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

  public static getSpaces(board: Board): Array<SpaceModel> {
    const volcanicSpaceIds = board.getVolcanicSpaceIds();
    const noctisCitySpaceIds = board.getNoctisCitySpaceIds();

    return board.spaces.map((space) => {
      let highlight: SpaceHighlight = undefined;
      if (volcanicSpaceIds.includes(space.id)) {
        highlight = 'volcanic';
      } else if (noctisCitySpaceIds.includes(space.id)) {
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
      cardsBlackList: options.cardsBlackList,
      coloniesExtension: options.coloniesExtension,
      communityCardsOption: options.communityCardsOption,
      corporateEra: options.corporateEra,
      draftVariant: options.draftVariant,
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
}
