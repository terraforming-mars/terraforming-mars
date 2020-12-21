import {CardName} from '../CardName';
import {ICard} from '../cards/ICard';
import {LogHelper} from '../components/LogHelper';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {ISpace} from '../ISpace';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {ResourceType} from '../ResourceType';
import {SpaceBonus} from '../SpaceBonus';
import {TileType} from '../TileType';
import {ITile} from '../ITile';
import {IAresData, IHazardConstraint, IMilestoneCount} from './IAresData';
import {IAdjacencyCost} from './IAdjacencyCost';
import {ARES_MILESTONES} from '../milestones/Milestones';
import {ARES_AWARDS} from '../awards/Awards';
import {Multiset} from '../utils/Multiset';
import {Phase} from '../Phase';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {SelectProductionToLoseDeferred} from '../deferredActions/SelectProductionToLoseDeferred';
import {IDrawnMilestonesAndAwards} from '../MilestoneAwardSelector';

export const OCEAN_UPGRADE_TILES = [TileType.OCEAN_CITY, TileType.OCEAN_FARM, TileType.OCEAN_SANCTUARY];
export const HAZARD_TILES = [TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE, TileType.EROSION_MILD, TileType.EROSION_SEVERE];

export enum HazardSeverity {
    NONE,
    MILD,
    SEVERE
};

export class AresHandler {
  private constructor() {}

  public static initialData(active: boolean, includeHazards: boolean, players: Player[]): IAresData {
    return {
      active: active,
      includeHazards: includeHazards,
      hazardData: {
        erosionOceanCount: {threshold: 3, available: true}, // oceans: add erosion tiles
        removeDustStormsOceanCount: {threshold: 6, available: true}, // oceans: remove dust storms
        severeErosionTemperature: {threshold: -4, available: true}, // temperatore: severe erosion
        severeDustStormOxygen: {threshold: 5, available: true}, // oxygen: severe dust storms
      },
      milestoneResults: players.map((p) => {
        return {id: p.id, count: 0};
      }),
    };
  }

  public static setupMilestonesAwards(drawnMilestonesAndAwards: IDrawnMilestonesAndAwards) {
    drawnMilestonesAndAwards.milestones.push(...ARES_MILESTONES);
    drawnMilestonesAndAwards.awards.push(...ARES_AWARDS);
  }

  public static ifAres(game: Game, cb: (aresData: IAresData) => void) {
    if (game.gameOptions.aresExtension) {
      if (game.aresData === undefined) {
        console.log('Assertion failure: game.aresData is undefined');
        // TODO(kberg): switch to throw.
        return;
      }
      cb(game.aresData);
    }
  }

  public static earnAdjacencyBonuses(game: Game, aresData: IAresData, player: Player, space: ISpace) {
    let incrementMilestone = false;

    game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (this.earnAdacencyBonus(game, adjacentSpace, player)) {
        incrementMilestone = true;
      }
    });
    if (incrementMilestone) {
      const milestoneResults = aresData.milestoneResults;
      const entry : IMilestoneCount | undefined = milestoneResults.find((e) => e.id === player.id);
      if (entry === undefined) {
        throw new Error('Player ID not in the Ares milestone results map: ' + player.id);
      }
      entry.count++;
    }
  }

  // |player| placed a tile next to |adjacentSpace|.
  // Returns true if the adjacent space contains a bonus for adjacency.
  private static earnAdacencyBonus(game: Game, adjacentSpace: ISpace, player: Player): boolean {
    if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
      return false;
    }
    const adjacentPlayer = adjacentSpace.player;
    if (adjacentPlayer === undefined) {
      throw new Error(`A tile with an adjacency bonus must have an owner (${adjacentSpace.x}, ${adjacentSpace.y}, ${adjacentSpace.adjacency.bonus}`);
    }

    const addResourceToCard = function(game: Game, player: Player, resourceType: ResourceType, resourceAsText: string) {
      const availableCards = player.getResourceCards(resourceType);
      if (availableCards.length === 0) {
      } else if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0]);
      } else if (availableCards.length > 1) {
        game.defer(new DeferredAction(
          player,
          () => new SelectCard(
            'Select a card to add an ' + resourceAsText,
            'Add ' + resourceAsText + 's',
            availableCards,
            (selected: ICard[]) => {
              player.addResourceTo(selected[0]);
              LogHelper.logAddResource(game, player, selected[0], 1);
              return undefined;
            },
          ),
        ));
      }
    };

    const bonuses = new Multiset<SpaceBonus>();

    adjacentSpace.adjacency.bonus.forEach((bonus) => {
      bonuses.add(bonus);
      switch (bonus) {
      case SpaceBonus.ANIMAL:
        addResourceToCard(game, player, ResourceType.ANIMAL, 'animal');
        break;

      case SpaceBonus.MEGACREDITS:
        player.megaCredits++;
        break;

      case SpaceBonus.POWER:
        player.energy++;
        break;

      case SpaceBonus.MICROBE:
        addResourceToCard(game, player, ResourceType.MICROBE, 'microbe');
        break;

      default:
        game.grantSpaceBonus(player, bonus);
        break;
      }
    });

    const bonusText = bonuses.entries().map((elem) => `${elem[1]} ${bonusAsString(elem[0])}`).join(', ');
    const tileText = tileTypeAsString(adjacentSpace.tile?.tileType);
    game.log('${0} gains ${1} for placing next to ${2}', (b) => b.player(player).string(bonusText).string(tileText));

    let ownerBonus = 1;
    if (adjacentPlayer.cardIsInEffect(CardName.MARKETING_EXPERTS)) {
      ownerBonus = 2;
    };

    adjacentPlayer.megaCredits += ownerBonus;
    game.log('${0} gains ${1} M€ for a tile placed next to ${2}', (b) => b.player(adjacentPlayer).number(ownerBonus).string(tileText));

    return true;
  }

  // Returns a map of resources and resource types to track, and the current count
  // of each of these |player| has. Used with |rewardForPlacement|.
  //
  // This feature is part of Ecological Survey and Geological Survey.
  //
  public static beforeTilePlacement(player: Player): Multiset<Resources | ResourceType> {
    const multiset: Multiset<Resources | ResourceType> = new Multiset();
    if (player.playedCards.find((c) => c.name === CardName.ECOLOGICAL_SURVEY)) {
      multiset.add(Resources.PLANTS, player.getResource(Resources.PLANTS));
      multiset.add(ResourceType.ANIMAL, AresHandler.countResources(player, ResourceType.ANIMAL));
      multiset.add(ResourceType.MICROBE, AresHandler.countResources(player, ResourceType.MICROBE));
    }
    if (player.playedCards.find((c) => c.name === CardName.GEOLOGICAL_SURVEY)) {
      multiset.add(Resources.STEEL, player.getResource(Resources.STEEL));
      multiset.add(Resources.TITANIUM, player.getResource(Resources.TITANIUM));
      multiset.add(Resources.HEAT, player.getResource(Resources.HEAT));
    }
    return multiset;
  }

  // Used with Ecological and Geological Survey
  public static afterTilePlacement(game: Game, player: Player, startingResources?: Multiset<Resources | ResourceType>): void {
    if (startingResources === undefined) {
      return;
    }
    if (game.phase === Phase.SOLAR) {
      return;
    }

    function giveBonus(start: number | undefined, current: number): boolean {
      return start !== undefined && current > start;
    }

    // Although this bit of code goes through all six resource types, the expected input map will only contain
    // the three (or six) resources it is tracking.
    [Resources.PLANTS, Resources.STEEL, Resources.TITANIUM, Resources.HEAT].forEach((resource) => {
      if (giveBonus(startingResources.get(resource), player.getResource(resource))) {
        player.setResource(resource, 1);

        const cardName = resource === Resources.PLANTS ? CardName.ECOLOGICAL_SURVEY : CardName.GEOLOGICAL_SURVEY;
        game.log('${0} gained a bonus ${1} because of ${2}', (b) => b.player(player).string(resource).cardName(cardName));
      }
    });
    [ResourceType.MICROBE, ResourceType.ANIMAL].forEach((resourceType) => {
      if (giveBonus(startingResources.get(resourceType), AresHandler.countResources(player, resourceType))) {
        game.defer(new AddResourcesToCard(
          player,
          game,
          resourceType,
          1,
        ));
      }
    });
  }

  private static countResources(player: Player, resourceType: ResourceType): number {
    let count = player.playedCards
      .map((c) => resourceType === c.resourceType ? c.resourceCount || 0 : 0)
      .reduce((prior, current) => prior + current, 0);

    if (resourceType === player.corporationCard?.resourceType) {
      count += player.corporationCard.resourceCount || 0;
    }
    return count;
  }

  public static setupHazards(game: Game, playerCount: number) {
    // The number of dust storms depends on the player count.
    // I made up that the solo player has 3 dust storms. The rules
    // don't take solo into account, nor if you played with more than
    // five players.
    if (playerCount >= 5) {
      randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
    } else if (playerCount === 4) {
      randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
      randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, -1);
    } else if (playerCount <= 3) {
      randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
      randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
      randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, -1);
    }
  }

  public static hasHazardTile(space: ISpace): boolean {
    return AresHandler.hazardSeverity(space) !== HazardSeverity.NONE;
  }

  public static hazardSeverity(space: ISpace): HazardSeverity {
    const type = space.tile?.tileType;

    switch (type) {
    case TileType.DUST_STORM_MILD:
    case TileType.EROSION_MILD:
      return HazardSeverity.MILD;

    case TileType.DUST_STORM_SEVERE:
    case TileType.EROSION_SEVERE:
      return HazardSeverity.SEVERE;

    default:
      return HazardSeverity.NONE;
    }
  }

  private static computeAdjacencyCosts(game: Game, space: ISpace, subjectToHazardAdjacency: boolean): IAdjacencyCost {
    // Summing up production cost isn't really the way to do it, because each tile could
    // reduce different production costs. Oh well.
    let megaCreditCost = 0;
    let productionCost = 0;
    game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      megaCreditCost += adjacentSpace.adjacency?.cost || 0;
      if (subjectToHazardAdjacency === true) {
        const severity = this.hazardSeverity(adjacentSpace);
        switch (severity) {
        case HazardSeverity.MILD:
          productionCost += 1;
          break;
        case HazardSeverity.SEVERE:
          productionCost += 2;
          break;
        }
      }
    });

    const severity = this.hazardSeverity(space);
    switch (severity) {
    case HazardSeverity.MILD:
      megaCreditCost += 8;
      break;
    case HazardSeverity.SEVERE:
      megaCreditCost += 16;
      break;
    }

    return {megacredits: megaCreditCost, production: productionCost};
  }

  public static assertCanPay(game: Game, player: Player, space: ISpace, subjectToHazardAdjacency: boolean): IAdjacencyCost {
    if (game.phase === Phase.SOLAR) {
      return {megacredits: 0, production: 0};
    }
    const cost = AresHandler.computeAdjacencyCosts(game, space, subjectToHazardAdjacency);

    // Make this more sophisticated, a player can pay for different adjacencies
    // with different production units, and, a severe hazard can't split payments.
    const availableProductionUnits = (player.getProduction(Resources.MEGACREDITS) + 5) +
            player.getProduction(Resources.STEEL) +
            player.getProduction(Resources.TITANIUM) +
            player.getProduction(Resources.PLANTS) +
            player.getProduction(Resources.ENERGY) +
            player.getProduction(Resources.HEAT);

    if (availableProductionUnits >= cost.production && player.canAfford(cost.megacredits)) {
      return cost;
    }
    if (cost.production > 0) {
      throw new Error(`Placing here costs ${cost.production} units of production and ${cost.megacredits} M€`);
    } else {
      throw new Error(`Placing here costs ${cost.megacredits} M€`);
    }
  }

  public static payAdjacencyAndHazardCosts(game: Game, player: Player, space: ISpace, subjectToHazardAdjacency: boolean) {
    const cost = this.assertCanPay(game, player, space, subjectToHazardAdjacency);

    if (cost.production > 0) {
      // TODO(kberg): don't send interrupt if total is available.
      game.defer(new SelectProductionToLoseDeferred(player, cost.production));
    }
    if (cost.megacredits > 0) {
      game.log('${0} placing a tile here costs ${1} M€', (b) => b.player(player).number(cost.megacredits));

      game.defer(new SelectHowToPayDeferred(player, cost.megacredits, false, false, 'Select how to pay additional placement costs.'));
    }
  }

  // Returns true if |newTile| can cover |boardTile|.
  public static canCover(space: ISpace, newTile: ITile): boolean {
    if (space.tile === undefined) {
      return true;
    }

    // A hazard protected by the Desperate Measures action can't be covered.
    if (AresHandler.hasHazardTile(space) && space.tile.protectedHazard !== true) {
      return true;
    }
    if (space.tile.tileType === TileType.OCEAN && OCEAN_UPGRADE_TILES.includes(newTile.tileType)) {
      return true;
    }
    return false;
  }

  public static onTemperatureChange(game: Game, aresData: IAresData) {
    // This will have no effect if the erosions don't exist, but that's OK --
    // the check for placing erosions will take this into account.
    testConstraint(
      aresData.hazardData.severeErosionTemperature,
      game.getTemperature(),
      () => {
        makeSevere(game, TileType.EROSION_MILD, TileType.EROSION_SEVERE);
      },
    );
  }

  public static onOceanPlaced(game: Game, aresData: IAresData, player: Player) {
    testToPlaceErosionTiles(game, aresData, player);
    testToRemoveDustStorms(game, aresData, player);
  }

  public static onOxygenChange(game: Game, aresData: IAresData) {
    testConstraint(aresData.hazardData.severeDustStormOxygen, game.getOxygenLevel(), () => {
      makeSevere(game, TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE);
    });
  }

  public static grantBonusForRemovingHazard(game: Game, player: Player, initialTileType: TileType | undefined) {
    if (game.phase === Phase.SOLAR) {
      return;
    }
    let steps: number;
    switch (initialTileType) {
    case TileType.DUST_STORM_MILD:
    case TileType.EROSION_MILD:
      steps = 1;
      break;

    case TileType.DUST_STORM_SEVERE:
    case TileType.EROSION_SEVERE:
      steps = 2;
      break;

    default:
      return;
    }
    player.increaseTerraformRatingSteps(steps, game);
    game.log('${0}\'s TR increases ${1} step(s) for removing ${2}', (b) => b.player(player).number(steps).string(tileTypeAsString(initialTileType)));
  }


  public static putHazardAt(space: ISpace, tileType: TileType) {
    space.tile = {tileType: tileType, protectedHazard: false};
  }
}

function randomlyPlaceHazard(game: Game, tileType: TileType, direction: 1 | -1) {
  const space = game.getSpaceByOffset(direction, 'hazard');
  AresHandler.putHazardAt(space, tileType);
  return space;
}


function makeSevere(game: Game, from: TileType, to: TileType) {
  game.board.spaces
    .filter((s) => s.tile?.tileType === from)
    .forEach((s) => {
      AresHandler.putHazardAt(s, to);
    });

  game.log('${0} have upgraded to ${1}', (b) => b.string(tileTypeAsString(from)).string(tileTypeAsString(to)));
}

function testConstraint(constraint: IHazardConstraint, testValue: number, cb: () => void) {
  if (!constraint.available) {
    return;
  }
  if (testValue >= constraint.threshold) {
    cb();
    constraint.available = false;
  }
}

function testToRemoveDustStorms(game: Game, aresData: IAresData, player: Player) {
  testConstraint(
    aresData.hazardData.removeDustStormsOceanCount,
    game.board.getOceansOnBoard(),
    () => {
      game.board.spaces.forEach((space) => {
        if (space.tile?.tileType === TileType.DUST_STORM_MILD || space.tile?.tileType === TileType.DUST_STORM_SEVERE) {
          if (space.tile.protectedHazard !== true) {
            space.tile = undefined;
          }
        }
      });

      if (game.phase !== Phase.SOLAR) {
        player.increaseTerraformRating(game);
        game.log('${0}\'s TR increases 1 step for eliminating dust storms.', (b) => b.player(player));
      }
    },
  );
}

function testToPlaceErosionTiles(game: Game, aresData: IAresData, player: Player) {
  testConstraint(
    aresData.hazardData.erosionOceanCount,
    game.board.getOceansOnBoard(),
    () => {
      let type = TileType.EROSION_MILD;
      if (aresData.hazardData.severeErosionTemperature.available !== true) {
        type = TileType.EROSION_SEVERE;
      }

      const space1 = randomlyPlaceHazard(game, type, 1);
      const space2 = randomlyPlaceHazard(game, type, -1);
      [space1, space2].forEach((space) => {
        LogHelper.logTilePlacement(game, player, space, type);
      });
    },
  );
}

// TODO(kberg): convert to a log message type
const tileTypeToStringMap: Map<TileType, string> = new Map([
  [TileType.GREENERY, 'greenery'],
  [TileType.OCEAN, 'ocean'],
  [TileType.CITY, 'city'],

  [TileType.CAPITAL, CardName.CAPITAL],
  [TileType.COMMERCIAL_DISTRICT, CardName.COMMERCIAL_DISTRICT],
  [TileType.ECOLOGICAL_ZONE, CardName.ECOLOGICAL_ZONE],
  [TileType.INDUSTRIAL_CENTER, CardName.INDUSTRIAL_CENTER],
  [TileType.LAVA_FLOWS, CardName.LAVA_FLOWS],
  [TileType.MINING_AREA, CardName.MINING_AREA],
  [TileType.MINING_RIGHTS, CardName.MINING_RIGHTS],
  [TileType.MOHOLE_AREA, CardName.MOHOLE_AREA],
  [TileType.NATURAL_PRESERVE, CardName.NATURAL_PRESERVE],
  [TileType.NUCLEAR_ZONE, CardName.NUCLEAR_ZONE],
  [TileType.RESTRICTED_AREA, CardName.RESTRICTED_AREA],

  // DEIMOS_DOWN, "",
  // GREAT_DAM, "",
  // MAGNETIC_FIELD_GENERATORS, "",

  [TileType.BIOFERTILIZER_FACILITY, CardName.BIOFERTILIZER_FACILITY],
  [TileType.METALLIC_ASTEROID, CardName.METALLIC_ASTEROID],
  [TileType.SOLAR_FARM, CardName.SOLAR_FARM],
  [TileType.OCEAN_CITY, CardName.OCEAN_CITY],
  [TileType.OCEAN_FARM, CardName.OCEAN_FARM],
  [TileType.OCEAN_SANCTUARY, CardName.OCEAN_SANCTUARY],
  [TileType.DUST_STORM_MILD, 'Mild Dust Storm'],
  [TileType.DUST_STORM_SEVERE, 'Severe Dust Storm'],
  [TileType.EROSION_MILD, 'Mild Erosion'],
  [TileType.EROSION_SEVERE, 'Severe Erosion'],
  [TileType.MINING_STEEL_BONUS, 'Mining (Steel)'],
  [TileType.MINING_TITANIUM_BONUS, 'Mining (Titanium)'],
]);

function tileTypeAsString(tileType: TileType | undefined): string {
  if (tileType === undefined) {
    return 'undefined';
  };
  return tileTypeToStringMap.get(tileType)|| 'special';
}


const bonusToStringMap: Map<SpaceBonus, string> = new Map([
  [SpaceBonus.TITANIUM, 'Titanium'],
  [SpaceBonus.STEEL, 'Steel'],
  [SpaceBonus.PLANT, 'Plant'],
  [SpaceBonus.DRAW_CARD, 'Card'],
  [SpaceBonus.HEAT, 'Heat'],
  [SpaceBonus.OCEAN, 'Ocean'],
  [SpaceBonus.MEGACREDITS, 'MC'],
  [SpaceBonus.ANIMAL, 'Animal'],
  [SpaceBonus.MICROBE, 'Microbe'],
  [SpaceBonus.POWER, 'Power'],
]);

function bonusAsString(bonus: SpaceBonus | undefined): string {
  return (bonus === undefined) ? 'undefined' : (bonusToStringMap.get(bonus)|| 'special');
}
