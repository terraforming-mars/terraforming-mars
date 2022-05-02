import {CardName} from '../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {CardResource} from '../common/CardResource';
import {SpaceBonus} from '../common/boards/SpaceBonus';
import {OCEAN_UPGRADE_TILES, TileType} from '../common/TileType';
import {ITile} from '../ITile';
import {IAresData, IMilestoneCount} from '../common/ares/IAresData';
import {IAdjacencyCost} from './IAdjacencyCost';
import {Multiset} from '../utils/Multiset';
import {Phase} from '../common/Phase';
import {SimpleDeferredAction} from '../deferredActions/DeferredAction';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {SelectProductionToLoseDeferred} from '../deferredActions/SelectProductionToLoseDeferred';
import {_AresHazardPlacement} from './AresHazards';

export enum HazardSeverity {
    NONE,
    MILD,
    SEVERE
}

export class AresHandler {
  private constructor() {}

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

  public static earnAdjacencyBonuses(aresData: IAresData, player: Player, space: ISpace) {
    let incrementMilestone = false;

    player.game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (this.earnAdacencyBonus(adjacentSpace, player)) {
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
  private static earnAdacencyBonus(adjacentSpace: ISpace, player: Player): boolean {
    if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
      return false;
    }
    const adjacentPlayer = adjacentSpace.player;
    if (adjacentPlayer === undefined) {
      throw new Error(`A tile with an adjacency bonus must have an owner (${adjacentSpace.x}, ${adjacentSpace.y}, ${adjacentSpace.adjacency.bonus}`);
    }

    const addResourceToCard = function(player: Player, resourceType: CardResource, resourceAsText: string) {
      const availableCards = player.getResourceCards(resourceType);
      if (availableCards.length === 0) {
      } else if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0], {log: true});
      } else if (availableCards.length > 1) {
        player.game.defer(new SimpleDeferredAction(
          player,
          () => new SelectCard(
            'Select a card to add an ' + resourceAsText,
            'Add ' + resourceAsText + 's',
            availableCards,
            (selected: ICard[]) => {
              player.addResourceTo(selected[0], {log: true});
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
        addResourceToCard(player, CardResource.ANIMAL, 'animal');
        break;

      case SpaceBonus.MEGACREDITS:
        player.megaCredits++;
        break;

      case SpaceBonus.ENERGY:
        player.energy++;
        break;

      case SpaceBonus.MICROBE:
        addResourceToCard(player, CardResource.MICROBE, 'microbe');
        break;

      default:
        player.game.grantSpaceBonus(player, bonus);
        break;
      }
    });

    const bonusText = bonuses.entries().map((elem) => `${elem[1]} ${SpaceBonus.toString(elem[0])}`).join(', ');
    const tileText = adjacentSpace.tile !== undefined ? TileType.toString(adjacentSpace.tile?.tileType) : 'no tile';
    player.game.log('${0} gains ${1} for placing next to ${2}', (b) => b.player(player).string(bonusText).string(tileText));

    let ownerBonus = 1;
    if (adjacentPlayer.cardIsInEffect(CardName.MARKETING_EXPERTS)) {
      ownerBonus = 2;
    }

    adjacentPlayer.megaCredits += ownerBonus;
    player.game.log('${0} gains ${1} M€ for a tile placed next to ${2}', (b) => b.player(adjacentPlayer).number(ownerBonus).string(tileText));

    return true;
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

  public static assertCanPay(player: Player, space: ISpace, subjectToHazardAdjacency: boolean): IAdjacencyCost {
    if (player.game.phase === Phase.SOLAR) {
      return {megacredits: 0, production: 0};
    }
    const cost = AresHandler.computeAdjacencyCosts(player.game, space, subjectToHazardAdjacency);

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

  public static payAdjacencyAndHazardCosts(player: Player, space: ISpace, subjectToHazardAdjacency: boolean) {
    const cost = this.assertCanPay(player, space, subjectToHazardAdjacency);

    if (cost.production > 0) {
      // TODO(kberg): don't send interrupt if total is available.
      player.game.defer(new SelectProductionToLoseDeferred(player, cost.production));
    }
    if (cost.megacredits > 0) {
      player.game.log('${0} placing a tile here costs ${1} M€', (b) => b.player(player).number(cost.megacredits));
      player.game.defer(new SelectHowToPayDeferred(player, cost.megacredits, {title: 'Select how to pay additional placement costs.'}));
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
    if (space.tile.tileType === TileType.OCEAN && OCEAN_UPGRADE_TILES.has(newTile.tileType)) {
      return true;
    }
    return false;
  }

  public static onTemperatureChange(game: Game, aresData: IAresData) {
    _AresHazardPlacement.onTemperatureChange(game, aresData);
  }

  public static onOceanPlaced(aresData: IAresData, player: Player) {
    _AresHazardPlacement.onOceanPlaced(aresData, player);
  }

  public static onOxygenChange(game: Game, aresData: IAresData) {
    _AresHazardPlacement.onOxygenChange(game, aresData);
  }

  public static grantBonusForRemovingHazard(player: Player, initialTileType: TileType | undefined) {
    if (player.game.phase === Phase.SOLAR) {
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
    player.increaseTerraformRatingSteps(steps);
    player.game.log('${0}\'s TR increases ${1} step(s) for removing ${2}', (b) => b.player(player).number(steps).string(TileType.toString(initialTileType)));
  }
}

