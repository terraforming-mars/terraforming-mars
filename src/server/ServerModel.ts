import {AndOptions} from '../inputs/AndOptions';
import {CardModel} from '../models/CardModel';
import {ColonyModel} from '../models/ColonyModel';
import {Color} from '../Color';
import {Game} from '../Game';
import {GameHomeModel} from '../models/GameHomeModel';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {ISpace} from '../ISpace';
import {OrOptions} from '../inputs/OrOptions';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerModel} from '../models/PlayerModel';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectHowToPayForCard} from '../inputs/SelectHowToPayForCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceModel} from '../models/SpaceModel';
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
  PartyModel,
  DelegatesModel,
  TurmoilModel,
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
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(game),
      coloniesCount: player.getColoniesCount(game),
      noTagsCount: player.getNoTagsCount(),
      influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
      coloniesExtension: game.gameOptions.coloniesExtension,
      players: getPlayers(game.getPlayers(), game),
      spaces: getSpaces(game.board.spaces),
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(),
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
      dealtCorporationCards: player.dealtCorporationCards,
      dealtPreludeCards: player.dealtPreludeCards,
      dealtProjectCards: player.dealtProjectCards,
      initialDraft: game.gameOptions.initialDraftVariant,
      needsToDraft: player.needsToDraft,
      deckSize: game.dealer.getDeckSize(),
      randomMA: game.gameOptions.randomMA,
      actionsTakenThisRound: player.actionsTakenThisRound,
      passedPlayers: game.getPassedPlayers(),
      aresExtension: game.gameOptions.aresExtension,
      aresData: game.aresData,
      preludeExtension: game.gameOptions.preludeExtension,
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
          playerScore: milestone.getScore(player, game),
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
          playerScore: award.getScore(player, game),
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
  } as CardModel;
}

function getCardsAsCardModel(
  cards: Array<ICard>,
  showResouces: boolean = true,
): Array<CardModel> {
  const result: Array<CardModel> = [];
  cards.forEach((card) => {
    result.push({
      name: card.name,
      resources:
        card.resourceCount !== undefined && showResouces ?
          card.resourceCount :
          undefined,
      resourceType: card.resourceType,
      calculatedCost: 0,
      cardType: CardType.AUTOMATED,
      isDisabled: false,
    });
  });

  return result;
}

function getWaitingFor(
  waitingFor: PlayerInput | undefined,
): PlayerInputModel | undefined {
  if (waitingFor === undefined) {
    return undefined;
  }
  const result: PlayerInputModel = {
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
    result.options = [];
    for (const option of (waitingFor as AndOptions | OrOptions)
      .options) {
      const subOption = getWaitingFor(option);
      if (subOption !== undefined) {
        result.options.push(subOption);
      }
    }
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_CARD:
    result.cards = getCardsAsCardModel(
      (waitingFor as SelectHowToPayForCard).cards,
      false,
    );
    result.microbes = (waitingFor as SelectHowToPayForCard).microbes;
    result.floaters = (waitingFor as SelectHowToPayForCard).floaters;
    result.canUseHeat = (waitingFor as SelectHowToPayForCard).canUseHeat;
    break;
  case PlayerInputTypes.SELECT_CARD:
    result.cards = getCardsAsCardModel(
      (waitingFor as SelectCard<ICard>).cards,
    );
    result.maxCardsToSelect = (waitingFor as SelectCard<
        ICard
      >).maxCardsToSelect;
    result.minCardsToSelect = (waitingFor as SelectCard<
        ICard
      >).minCardsToSelect;
    break;
  case PlayerInputTypes.SELECT_COLONY:
    result.coloniesModel = (waitingFor as SelectColony).coloniesModel;
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY:
    result.amount = (waitingFor as SelectHowToPay).amount;
    result.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
    result.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
    result.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
    break;
  case PlayerInputTypes.SELECT_PLAYER:
    result.players = (waitingFor as SelectPlayer).players.map(
      (player) => player.color,
    );
    break;
  case PlayerInputTypes.SELECT_SPACE:
    result.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map(
      (space) => space.id,
    );
    break;
  case PlayerInputTypes.SELECT_AMOUNT:
    result.min = (waitingFor as SelectAmount).min;
    result.max = (waitingFor as SelectAmount).max;
    break;
  case PlayerInputTypes.SELECT_DELEGATE:
    result.players = (waitingFor as SelectDelegate).players.map(
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
    result.payProduction = {
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
    result.aresData = (waitingFor as ShiftAresGlobalParameters).aresData;
    break;
  }
  return result;
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
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(game),
      coloniesCount: player.getColoniesCount(game),
      noTagsCount: player.getNoTagsCount(),
      influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
      coloniesExtension: game.gameOptions.coloniesExtension,
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(),
      terraformRating: player.getTerraformRating(),
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.getTitaniumValue(game),
      victoryPointsBreakdown: player.getVictoryPoints(game),
      isActive: player.id === game.activePlayer,
      venusNextExtension: game.gameOptions.venusNextExtension,
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

function getTurmoil(game: Game): TurmoilModel | undefined {
  if (game.gameOptions.turmoilExtension && game.turmoil) {
    const parties = getParties(game);
    let chairman; let dominant; let ruling;
    if (game.turmoil.chairman) {
      if (game.turmoil.chairman === 'NEUTRAL') {
        chairman = Color.NEUTRAL;
      } else {
        chairman = game.getPlayerById(game.turmoil.chairman).color;
      }
    }
    if (game.turmoil.dominantParty) {
      dominant = game.turmoil.dominantParty.name;
    }
    if (game.turmoil.rulingParty) {
      ruling = game.turmoil.rulingParty.name;
    }

    const lobby = Array.from(
      game.turmoil.lobby,
      (player) => game.getPlayerById(player).color,
    );

    const reserve = game.turmoil.getPresentPlayers().map((player) => {
      const number = game.turmoil!.getDelegates(player);
      if (player !== 'NEUTRAL') {
        return {
          color: game.getPlayerById(player).color,
          number: number,
        };
      } else {
        return {color: Color.NEUTRAL, number: number};
      }
    });

    let distant;
    if (game.turmoil.distantGlobalEvent) {
      distant = {
        name: game.turmoil.distantGlobalEvent.name,
        description: game.turmoil.distantGlobalEvent.description,
        revealed: game.turmoil.distantGlobalEvent.revealedDelegate,
        current: game.turmoil.distantGlobalEvent.currentDelegate,
      };
    }

    let coming;
    if (game.turmoil.comingGlobalEvent) {
      coming = {
        name: game.turmoil.comingGlobalEvent.name,
        description: game.turmoil.comingGlobalEvent.description,
        revealed: game.turmoil.comingGlobalEvent.revealedDelegate,
        current: game.turmoil.comingGlobalEvent.currentDelegate,
      };
    }

    let current;
    if (game.turmoil.currentGlobalEvent) {
      current = {
        name: game.turmoil.currentGlobalEvent.name,
        description: game.turmoil.currentGlobalEvent.description,
        revealed: game.turmoil.currentGlobalEvent.revealedDelegate,
        current: game.turmoil.currentGlobalEvent.currentDelegate,
      };
    }

    return {
      chairman: chairman,
      ruling: ruling,
      dominant: dominant,
      parties: parties,
      lobby: lobby,
      reserve: reserve,
      distant: distant,
      comming: coming,
      current: current,
    };
  } else {
    return undefined;
  }
}

function getParties(game: Game): Array<PartyModel> {
  if (game.gameOptions.turmoilExtension && game.turmoil) {
    return game.turmoil.parties.map(function(party) {
      const delegates: Array<DelegatesModel> = [];
      party.getPresentPlayers().forEach((player) => {
        const number = party.getDelegates(player);
        if (player !== 'NEUTRAL') {
          delegates.push({
            color: game.getPlayerById(player).color,
            number: number,
          });
        } else {
          delegates.push({color: Color.NEUTRAL, number: number});
        }
      });
      let partyLeader;
      if (party.partyLeader) {
        if (party.partyLeader === 'NEUTRAL') {
          partyLeader = Color.NEUTRAL;
        } else {
          partyLeader = game.getPlayerById(party.partyLeader).color;
        }
      }
      return {
        name: party.name,
        description: party.description,
        partyLeader: partyLeader,
        delegates: delegates,
      };
    });
  }
  return [];
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

function getSpaces(spaces: Array<ISpace>): Array<SpaceModel> {
  return spaces.map((space) => {
    return {
      x: space.x,
      y: space.y,
      id: space.id,
      bonus: space.bonus,
      spaceType: space.spaceType,
      tileType: space.tile && space.tile.tileType,
      color: getColor(space),
    };
  });
}
