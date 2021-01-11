import {AndOptions} from '../inputs/AndOptions';
import {CardModel} from '../models/CardModel';
import {ColonyModel} from '../models/ColonyModel';
import {Color} from '../Color';
import {Game} from '../Game';
import {GameHomeModel} from '../models/GameHomeModel';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {OrOptions} from '../inputs/OrOptions';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerModel} from '../models/PlayerModel';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectHowToPayForProjectCard} from '../inputs/SelectHowToPayForProjectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceHighlight, SpaceModel} from '../models/SpaceModel';
import {TileType} from '../TileType';
import {Phase} from '../Phase';
import {Resources} from '../Resources';
import {CardType} from '../cards/CardType';
import {
  ClaimedMilestoneModel,
  IMilestoneScore,
} from '../models/ClaimedMilestoneModel';
import {FundedAwardModel, IAwardScore} from '../models/FundedAwardModel';
import {
  getTurmoil,
} from '../models/TurmoilModel';
import {SelectDelegate} from '../inputs/SelectDelegate';
import {SelectColony} from '../inputs/SelectColony';
import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {ShiftAresGlobalParameters} from '../inputs/ShiftAresGlobalParameters';

export class Server {
  public static getGameModel(game: Game): GameHomeModel {
    return {
      activePlayer: game.getPlayerById(game.activePlayer).color,
      id: game.id,
      phase: game.phase,
      players: game.getPlayers().map((player) => ({
        color: player.color,
        id: player.id,
        name: player.name,
      })),
    };
  }

  public static getPlayerModel(player: Player, game: Game): PlayerModel {
    const turmoil = getTurmoil(game);

    return {
      cardsInHand: getCards(player, player.cardsInHand, game, false),
      draftedCards: getCards(player, player.draftedCards, game, false),
      milestones: getMilestones(game),
      awards: getAwards(game),
      cardCost: player.cardCost,
      color: player.color,
      corporationCard: getCorporationCard(player),
      energy: player.energy,
      energyProduction: player.getProduction(Resources.ENERGY),
      generation: game.getGeneration(),
      heat: player.heat,
      heatProduction: player.getProduction(Resources.HEAT),
      id: player.id,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
      name: player.name,
      oceans: game.board.getOceansOnBoard(),
      oxygenLevel: game.getOxygenLevel(),
      phase: game.phase,
      plants: player.plants,
      plantProduction: player.getProduction(Resources.PLANTS),
      plantsAreProtected: player.plantsAreProtected(),
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(game),
      coloniesCount: player.getColoniesCount(game),
      noTagsCount: player.getNoTagsCount(),
      influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
      coloniesExtension: game.gameOptions.coloniesExtension,
      players: getPlayers(game.getPlayers(), game),
      spaces: getSpaces(game.board),
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(game),
      temperature: game.getTemperature(),
      terraformRating: player.getTerraformRating(),
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.getTitaniumValue(game),
      victoryPointsBreakdown: player.getVictoryPoints(game),
      waitingFor: getWaitingFor(player.getWaitingFor()),
      isSoloModeWin: game.isSoloModeWin(),
      gameAge: game.gameAge,
      isActive: player.id === game.activePlayer,
      corporateEra: game.gameOptions.corporateEra,
      venusNextExtension: game.gameOptions.venusNextExtension,
      turmoilExtension: game.gameOptions.turmoilExtension,
      venusScaleLevel: game.getVenusScaleLevel(),
      boardName: game.gameOptions.boardName,
      colonies: getColonies(game),
      tags: player.getAllTags(),
      showOtherPlayersVP: game.gameOptions.showOtherPlayersVP,
      showTimers: game.gameOptions.showTimers,
      actionsThisGeneration: Array.from(player.getActionsThisGeneration()),
      fleetSize: player.getFleetSize(),
      tradesThisTurn: player.tradesThisTurn,
      turmoil: turmoil,
      selfReplicatingRobotsCards: player.getSelfReplicatingRobotsCards(game),
      dealtCorporationCards: getCardsAsCardModel(player.dealtCorporationCards, false),
      dealtPreludeCards: getCardsAsCardModel(player.dealtPreludeCards, false),
      dealtProjectCards: getCardsAsCardModel(player.dealtProjectCards, false),
      initialDraft: game.gameOptions.initialDraftVariant,
      needsToDraft: player.needsToDraft,
      deckSize: game.dealer.getDeckSize(),
      randomMA: game.gameOptions.randomMA,
      actionsTakenThisRound: player.actionsTakenThisRound,
      passedPlayers: game.getPassedPlayers(),
      aresExtension: game.gameOptions.aresExtension,
      aresData: game.aresData,
      preludeExtension: game.gameOptions.preludeExtension,
      politicalAgendasExtension: game.gameOptions.politicalAgendasExtension,
      timer: player.timer.serialize(),
    };
  }
}

function getMilestones(game: Game): Array<ClaimedMilestoneModel> {
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

function getAwards(game: Game): Array<FundedAwardModel> {
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

function getCorporationCard(player: Player): CardModel | undefined {
  if (player.corporationCard === undefined) return undefined;
  return {
    name: player.corporationCard.name,
    resources: player.getResourcesOnCard(player.corporationCard),
    calculatedCost: 0,
    cardType: CardType.CORPORATION,
    isDisabled: player.corporationCard.isDisabled,
    warning: player.corporationCard.warning,
  } as CardModel;
}

function getCardsAsCardModel(
  cards: Array<ICard>,
  showResouces: boolean = true,
): Array<CardModel> {
  const cardModel: Array<CardModel> = [];
  cards.forEach((card) => {
    cardModel.push({
      name: card.name,
      resources:
        card.resourceCount !== undefined && showResouces ?
          card.resourceCount :
          undefined,
      resourceType: card.resourceType,
      calculatedCost: 0,
      cardType: CardType.AUTOMATED,
      isDisabled: false,
      warning: card.warning,
    });
  });

  return cardModel;
}

function getWaitingFor(
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
    players: undefined,
    availableSpaces: undefined,
    min: undefined,
    max: undefined,
    microbes: undefined,
    floaters: undefined,
    coloniesModel: undefined,
    payProduction: undefined,
    aresData: undefined,
  };
  switch (waitingFor.inputType) {
  case PlayerInputTypes.AND_OPTIONS:
  case PlayerInputTypes.OR_OPTIONS:
    playerInputModel.options = [];
    for (const option of (waitingFor as AndOptions | OrOptions)
      .options) {
      const subOption = getWaitingFor(option);
      if (subOption !== undefined) {
        playerInputModel.options.push(subOption);
      }
    }
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD:
    playerInputModel.cards = getCardsAsCardModel(
      (waitingFor as SelectHowToPayForProjectCard).cards,
      false,
    );
    playerInputModel.microbes = (waitingFor as SelectHowToPayForProjectCard).microbes;
    playerInputModel.floaters = (waitingFor as SelectHowToPayForProjectCard).floaters;
    playerInputModel.canUseHeat = (waitingFor as SelectHowToPayForProjectCard).canUseHeat;
    break;
  case PlayerInputTypes.SELECT_CARD:
    playerInputModel.cards = getCardsAsCardModel(
      (waitingFor as SelectCard<ICard>).cards,
    );
    playerInputModel.maxCardsToSelect = (waitingFor as SelectCard<
        ICard
      >).maxCardsToSelect;
    playerInputModel.minCardsToSelect = (waitingFor as SelectCard<
        ICard
      >).minCardsToSelect;
    break;
  case PlayerInputTypes.SELECT_COLONY:
    playerInputModel.coloniesModel = (waitingFor as SelectColony).coloniesModel;
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY:
    playerInputModel.amount = (waitingFor as SelectHowToPay).amount;
    playerInputModel.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
    playerInputModel.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
    playerInputModel.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
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
  }
  return playerInputModel;
}

function getCards(
  player: Player,
  cards: Array<IProjectCard>,
  game: Game,
  showResouces: boolean = true,
): Array<CardModel> {
  return cards.map((card) => ({
    resources: showResouces ? player.getResourcesOnCard(card) : undefined,
    resourceType: card.resourceType,
    name: card.name,
    calculatedCost: player.getCardCost(game, card),
    cardType: card.cardType,
    isDisabled: false,
    warning: card.warning,
  }));
}

function getPlayers(players: Array<Player>, game: Game): Array<PlayerModel> {
  const turmoil = getTurmoil(game);

  return players.map((player) => {
    return {
      color: player.color,
      corporationCard: getCorporationCard(player),
      energy: player.energy,
      energyProduction: player.getProduction(Resources.ENERGY),
      heat: player.heat,
      heatProduction: player.getProduction(Resources.HEAT),
      id: game.phase === Phase.END ? player.id : player.color,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
      name: player.name,
      plants: player.plants,
      plantProduction: player.getProduction(Resources.PLANTS),
      plantsAreProtected: player.plantsAreProtected(),
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(game),
      coloniesCount: player.getColoniesCount(game),
      noTagsCount: player.getNoTagsCount(),
      influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
      coloniesExtension: game.gameOptions.coloniesExtension,
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(game),
      terraformRating: player.getTerraformRating(),
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.getTitaniumValue(game),
      victoryPointsBreakdown: player.getVictoryPoints(game),
      isActive: player.id === game.activePlayer,
      venusNextExtension: game.gameOptions.venusNextExtension,
      turmoilExtension: game.gameOptions.turmoilExtension,
      venusScaleLevel: game.getVenusScaleLevel(),
      boardName: game.gameOptions.boardName,
      colonies: getColonies(game),
      tags: player.getAllTags(),
      showOtherPlayersVP: game.gameOptions.showOtherPlayersVP,
      showTimers: game.gameOptions.showTimers,
      actionsThisGeneration: Array.from(
        player.getActionsThisGeneration(),
      ),
      fleetSize: player.getFleetSize(),
      tradesThisTurn: player.tradesThisTurn,
      turmoil: turmoil,
      selfReplicatingRobotsCards: player.getSelfReplicatingRobotsCards(
        game,
      ),
      needsToDraft: player.needsToDraft,
      deckSize: game.dealer.getDeckSize(),
      actionsTakenThisRound: player.actionsTakenThisRound,
      preludeExtension: game.gameOptions.preludeExtension,
      politicalAgendasExtension: game.gameOptions.politicalAgendasExtension,
      timer: player.timer.serialize(),
    } as PlayerModel;
  });
}

function getColonies(game: Game): Array<ColonyModel> {
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
function getColor(space: ISpace): Color | undefined {
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

function getSpaces(board: Board): Array<SpaceModel> {
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
      color: getColor(space),
      highlight: highlight,
    };
  });
}
