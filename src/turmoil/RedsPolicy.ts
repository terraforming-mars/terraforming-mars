import * as constants from '../constants';
import {Board} from '../boards/Board';
import {CardName} from '../CardName';
import {Game} from '../Game';
import {IProjectCard} from '../cards/IProjectCard';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {ResourceType} from '../ResourceType';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceName} from '../SpaceName';
import {StandardProjectType} from '../StandardProjectType';
import {Tags} from '../cards/Tags';
import {TileType} from '../TileType';

/*
 * TODO(Lynesth): Most of the members of that class could be inferred from card metadata once it's usable
 * Constructor is expecting an object with properties from the class and will defaults the others
 * Usage: new ActionDetails({ card: new LavaFlows(), temperatureIncrease: 2, nonOceanToPlace: TileType.LAVA_FLOWS, nonOceanAvailableSpaces: LavaFlows.getVolcanicSpaces(player, game) });
 */
export class ActionDetails {
  public card?: IProjectCard;
  public standardProject?: StandardProjectType;
  public isPlantsConversion: boolean = false;
  public cost: number = 0; // Cost of the action in MC
  public TRIncrease: number = 0; // If action increases TR
  public oxygenIncrease: number = 0; // If action increases oxygen
  public temperatureIncrease: number = 0; // If action increases temperature
  public venusIncrease: number = 0; // If action increases Venus scale
  public oceansToPlace: number = 0; // If action places an ocean tile
  public oceansAvailableSpaces: Array<ISpace> = []; // Default spaces where the ocean tile can be placed
  public nonOceanToPlace?: TileType; // If action places a non ocean tile (City, Greenery, Special, etc)
  public nonOceanAvailableSpaces: Array<ISpace> = []; // Default spaces where non ocean tile can be placed
  public animals: number = 0; // If action adds animals to a card
  public microbes: number = 0; // If action adds microbes to a card
  public megaCreditsProduction: number = 0; // If action increases MC production - for Manutech
  public reservedHeat: number = 0; // If action requires heat - for Helion

  constructor(action: Partial<ActionDetails>) {
    Object.assign(this, action);
  }
}

type ISpaceTree = Map<ISpace, ISpaceBranch>;
type ISpaceBranch = ISpaceTree | undefined;

export interface HowToAffordRedsPolicy {
  canAfford: boolean, // true if the player can afford everything, false if not
  mustSpendAtMost?: number, // if set, how much the player can spend on the card/action itself in MC
  spaces?: ISpaceTree // A tree limiting available spaces for tile placements, if needed
}

export class RedsPolicy {
  /*
   * Check if the player will be able to afford all Reds taxes after playing the card
   * by checking every possible tile placement, etc
   *
   * Returns true if the card is playable no matter what
   * Returns false if the card is not playable
   * Otherwise, returns an array of ISpace where tiles must be placed in order to afford the taxes
   */
  public static canAffordRedsPolicy(
    player: Player,
    game: Game,
    action: ActionDetails,
    canUseSteel: boolean = false,
    canUseTitanium: boolean = false,
    canUseFloaters: boolean = false,
    canUseMicrobes: boolean = false,
  ): HowToAffordRedsPolicy {
    // If oxygen increase will increase temperature
    if (game.getOxygenLevel() < 8 && game.getOxygenLevel() + action.oxygenIncrease >= 8) {
      action.temperatureIncrease++;
    }

    // If temperature increase will place an ocean
    if (game.getTemperature() < 0 && game.getTemperature() + action.temperatureIncrease * 2 >= 0) {
      if (action.oceansToPlace === 0 && action.oceansAvailableSpaces.length === 0) {
        action.oceansAvailableSpaces = game.board.getAvailableSpacesForOcean(player);
      }
      action.oceansToPlace++;
    }

    // If venus increase will increase TR
    if (game.getVenusScaleLevel() < 16 && game.getVenusScaleLevel() + action.venusIncrease * 2 >= 16) {
      action.TRIncrease++;
    }

    action.oxygenIncrease = Math.min(action.oxygenIncrease, constants.MAX_OXYGEN_LEVEL - game.getOxygenLevel());
    action.temperatureIncrease = Math.min(action.temperatureIncrease, (constants.MAX_TEMPERATURE - game.getTemperature()) / 2);
    action.venusIncrease = Math.min(action.venusIncrease, (constants.MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2);
    action.oceansToPlace = Math.min(action.oceansToPlace, constants.MAX_OCEAN_TILES - game.board.getOceansOnBoard());

    const totalTRGain = action.TRIncrease + action.oxygenIncrease + action.temperatureIncrease + action.oceansToPlace;

    // This is how much the player will have to pay Reds
    const redTaxes = totalTRGain * constants.REDS_RULING_POLICY_COST;


    /*
     * This could probably be saved on the player directly when said card is played
     * Also one loop would be faster but then they wouldn't be consts and it'll be a bigger chunk.
     * Anyway, this is a list of cards that can make the player get money from playing a TR-increasing card/action
     */
    // Animals
    const hasEcologicalZone = player.playedCards.filter((c) => c.name === CardName.ECOLOGICAL_ZONE).length > 0;
    const hasHerbivores = player.playedCards.filter((c) => c.name === CardName.HERBIVORES).length > 0;
    const hasMartianZoo = player.playedCards.filter((c) => c.name === CardName.MARTIAN_ZOO).length > 0;
    const hasMeatIndustries = player.playedCards.filter((c) => c.name === CardName.MEAT_INDUSTRY).length > 0;
    // Microbes
    const hasDecomposers = player.playedCards.filter((c) => c.name === CardName.DECOMPOSERS).length > 0;
    const hasTopsoilContract = player.playedCards.filter((c) => c.name === CardName.TOPSOIL_CONTRACT).length > 0;
    // Events
    const hasMediaGroup = player.playedCards.filter((c) => c.name === CardName.MEDIA_GROUP).length > 0;
    const hasOptimalAerobraking = player.playedCards.filter((c) => c.name === CardName.OPTIMAL_AEROBRAKING).length > 0;
    // Others
    const hasAdvertising = player.playedCards.filter((c) => c.name === CardName.ADVERTISING).length > 0;
    const hasGMOContracts = player.playedCards.filter((c) => c.name === CardName.GMO_CONTRACT).length > 0;
    const hasStandardTechnology = player.playedCards.filter((c) => c.name === CardName.STANDARD_TECHNOLOGY).length > 0;
    // Corporations
    const isAphrodite = player.isCorporation(CardName.APHRODITE);
    const isArklight = player.isCorporation(CardName.ARKLIGHT);
    const isCredicor = player.isCorporation(CardName.CREDICOR);
    const isHelion = player.isCorporation(CardName.HELION);
    const isInterplanetary = player.isCorporation(CardName.INTERPLANETARY_CINEMATICS);
    const isManutech = player.isCorporation(CardName.MANUTECH);
    const isRecyclon = player.isCorporation(CardName.RECYCLON);
    const isVitor = player.isCorporation(CardName.VITOR);


    let bonusMCFromPlay: number = 0;

    // Plants conversion
    if (action.isPlantsConversion === true) {
      if (hasHerbivores && hasMeatIndustries) {
        bonusMCFromPlay += 2;
      }
    }

    // Standard projects
    if (action.standardProject !== undefined) {
      if (action.standardProject !== StandardProjectType.SELLING_PATENTS && hasStandardTechnology) {
        bonusMCFromPlay += 3;
      }
      if (action.standardProject === StandardProjectType.GREENERY) {
        if (isCredicor) {
          bonusMCFromPlay += 4;
        }
        if (hasHerbivores && hasMeatIndustries) {
          bonusMCFromPlay += 2;
        }
      }
    }

    // Card play
    if (action.card !== undefined) {
      if (hasGMOContracts) {
        bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length * 2;
      }
      if (hasTopsoilContract) {
        if (action.card.resourceType === ResourceType.MICROBE || player.getResourceCards(ResourceType.MICROBE).length > 0) {
          bonusMCFromPlay += action.microbes;
        }
        if (hasDecomposers) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length;
        }
        if (isRecyclon) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.STEEL).length;
        }
      }
      if (hasMeatIndustries) {
        if (action.card.resourceType === ResourceType.ANIMAL || player.getResourceCards(ResourceType.ANIMAL).length > 0) {
          bonusMCFromPlay += action.animals;
        }
        if (hasEcologicalZone) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT).length * 2;
        }
        if (hasMartianZoo) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.EARTH).length * 2;
        }
        if (isArklight) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT).length * 2;
        }
        if (hasHerbivores && action.nonOceanToPlace === TileType.GREENERY) {
          bonusMCFromPlay += 2;
        }
      }
      if (hasAdvertising && isManutech && action.card.cost >= 20) {
        bonusMCFromPlay += 1;
      }
      if (action.card.tags.filter((tag) => tag === Tags.EVENT).length > 0) {
        if (isInterplanetary) {
          bonusMCFromPlay += 2;
        }
        if (hasMediaGroup) {
          bonusMCFromPlay += 3;
        }
        if (hasOptimalAerobraking) {
          bonusMCFromPlay += 3;
          if (isHelion) {
            bonusMCFromPlay += 3;
          }
        }
      }
      if (isVitor && action.card.getVictoryPoints !== undefined && action.card.getVictoryPoints(player, game) >= 0) {
        bonusMCFromPlay += 3;
      }

      // Get how much the player will actually pay for the card after discounts
      action.cost = player.getCardCost(game, action.card);
    }

    // Corporation specifics
    if (isAphrodite) {
      bonusMCFromPlay += action.venusIncrease * 2;
    }

    if (isHelion) {
      bonusMCFromPlay -= action.reservedHeat;
    }

    if (isManutech) {
      bonusMCFromPlay += action.megaCreditsProduction;
    }


    const totalToPay = redTaxes + action.cost - bonusMCFromPlay;

    // Player has enough MC to cover for everything
    if (player.canAfford(totalToPay)) {
      return {canAfford: true};
    }

    const mustSpendAtMost = player.megaCredits - (redTaxes - bonusMCFromPlay) + (isHelion ? player.heat : 0);

    let missingMC: number = totalToPay - (player.megaCredits + (isHelion ? player.heat : 0));
    if (canUseSteel) {
      missingMC -= Math.min(player.steel, Math.ceil(missingMC / player.getSteelValue())) * player.getSteelValue();
    }
    if (canUseTitanium) {
      missingMC -= Math.min(player.titanium, Math.ceil(missingMC / player.getTitaniumValue(game))) * player.getTitaniumValue(game);
    }
    if (canUseMicrobes) {
      missingMC -= Math.min(player.getMicrobesCanSpend(), Math.ceil(missingMC / 2)) * 2;
    }
    if (canUseFloaters) {
      missingMC -= Math.min(player.getFloatersCanSpend(), Math.ceil(missingMC / 3)) * 3;
    }

    // If player uses steel/titanium/etc it can pay for everything but must not spend more than |mustSpendAtMost| MC on the action/card itself
    if (missingMC <= 0) {
      return {canAfford: true, mustSpendAtMost: mustSpendAtMost};
    }


    // If we still can't pay, and there's no tile to place, there's no way to get more cash, so player can't pay Reds
    if (action.oceansToPlace === 0 && action.nonOceanToPlace === undefined) {
      return {canAfford: false};
    }


    /*
     * Ok so if we arrived here that means we have tiles to place
     * Let's see if we can manage to pay Reds using the bonus placement from those tiles
     *
     * TODO: Include Ares adjacency bonus/malus/hazards
     * TODO: Improve calculation for placement on HELIAS special ocean tile
     */

    // Let's compute bonus MC from each board space
    const spacesBonusMC = RedsPolicy.getBoardSpacesBonusMC(player, game, isHelion);

    // And generate a tree of tile placements that provide at least |missingMC|
    const spacesTree: ISpaceTree = RedsPolicy.makeISpaceTree(
      player,
      game,
      spacesBonusMC,
      action.oceansToPlace,
      action.oceansAvailableSpaces,
      action.nonOceanToPlace !== undefined ? 1 : 0,
      action.nonOceanAvailableSpaces,
      missingMC,
    );


    // If our tree has at least one branch, we can afford to pay Reds !
    if (spacesTree.size > 0) {
      return {canAfford: true, mustSpendAtMost: mustSpendAtMost, spaces: spacesTree};
    }


    // We did all we could, still can't pay
    return {canAfford: false};
  }


  public static getBoardSpacesBonusMC(player: Player, game: Game, isHelion: boolean = false): Array<number> {
    return game.board.spaces.map((space) => {
      let bonus = game.board.getAdjacentSpaces(space).filter(
        (adjacentSpace) => Board.isOceanSpace(adjacentSpace)).length * player.oceanBonus;

      if (space.id === SpaceName.HELLAS_OCEAN_TILE) {
        bonus -= 6;
      }

      if (isHelion) {
        bonus += space.bonus.filter((b) => b === SpaceBonus.HEAT).length;
      }

      return bonus;
    });
  }


  public static makeISpaceTree(player: Player, game: Game, spacesBonusMC: Array<number>, oceans: number, oceansSpaces: Array<ISpace>, nonOcean: number, nonOceanSpaces: Array<ISpace>, target: number, iteration: number = 1, totalBonus: number = 0): ISpaceTree {
    const spacesTree = new Map();
    if (iteration < oceans + nonOcean) {
      oceansSpaces.forEach((space) => {
        const tempBonusMC = Array.from(spacesBonusMC);
        game.board.getAdjacentSpaces(space).forEach((s) => {
          tempBonusMC[game.board.spaces.indexOf(s)] += player.oceanBonus;
        });
        const tree = RedsPolicy.makeISpaceTree(
          player,
          game,
          tempBonusMC,
          oceans,
          oceansSpaces.filter((s) => s.id !== space.id),
          nonOcean,
          nonOceanSpaces.filter((s) => s.id !== space.id),
          target,
          iteration + 1,
          totalBonus + tempBonusMC[game.board.spaces.indexOf(space)],
        );
        if (tree.size > 0) {
          spacesTree.set(space, tree);
        }
      });
    } else {
      const spaces = nonOcean === 0 ? oceansSpaces : nonOceanSpaces;
      spaces.forEach((space) => {
        const bonus = totalBonus + spacesBonusMC[game.board.spaces.indexOf(space)];
        if (bonus >= target) {
          spacesTree.set(space, undefined);
        }
      });
    }
    return spacesTree;
  }
}
