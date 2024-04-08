import {CardName} from '../../common/cards/CardName';
import {IGame} from '../IGame';
import {SelectCard} from '../inputs/SelectCard';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {CardResource} from '../../common/CardResource';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {HazardSeverity, hazardSeverity} from '../../common/AresTileType';
import {OCEAN_UPGRADE_TILES, TileType, tileTypeToString} from '../../common/TileType';
import {Tile} from '../Tile';
import {AresData, MilestoneCount} from '../../common/ares/AresData';
import {AdjacencyCost} from './AdjacencyCost';
import {MultiSet} from 'mnemonist';
import {Phase} from '../../common/Phase';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {SelectProductionToLoseDeferred} from '../deferredActions/SelectProductionToLoseDeferred';
import {_AresHazardPlacement} from './AresHazards';
import {CrashlandingBonus} from '../pathfinders/CrashlandingBonus';

export class AresHandler {
  private constructor() {}

  public static ifAres(game: IGame, cb: (aresData: AresData) => void) {
    if (game.gameOptions.aresExtension) {
      if (game.aresData === undefined) throw new Error('Assertion failure: game.aresData is undefined');
      cb(game.aresData);
    }
  }

  public static earnAdjacencyBonuses(player: IPlayer, space: Space, options?: {giveAresTileOwnerBonus?: boolean}) {
    for (const adjacentSpace of player.game.board.getAdjacentSpaces(space)) {
      this.earnAdacencyBonus(space, adjacentSpace, player, options?.giveAresTileOwnerBonus);
    }
  }

  // |player| placed a tile at |space| next to |adjacentSpace|.
  // Returns true if the adjacent space contains a bonus for adjacency.
  private static earnAdacencyBonus(newTileSpace: Space, adjacentSpace: Space, player: IPlayer, giveAresTileOwnerBonus: boolean = true): void {
    if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
      return;
    }
    const adjacentPlayer = adjacentSpace.player;
    if (adjacentPlayer === undefined) {
      throw new Error(`A tile with an adjacency bonus must have an owner (${adjacentSpace.x}, ${adjacentSpace.y}, ${adjacentSpace.adjacency.bonus}`);
    }

    const addResourceToCard = function(player: IPlayer, resourceType: CardResource, resourceAsText: string) {
      const availableCards = player.getResourceCards(resourceType);
      if (availableCards.length === 0) {
        return;
      } else if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0], {log: true});
      } else if (availableCards.length > 1) {
        player.defer(new SelectCard(
          'Select a card to add an ' + resourceAsText,
          'Add ' + resourceAsText + 's',
          availableCards)
          .andThen((selected) => {
            player.addResourceTo(selected[0], {log: true});
            return undefined;
          }));
      }
    };

    const bonuses = new MultiSet<SpaceBonus>();

    for (const bonus of adjacentSpace.adjacency.bonus) {
      if (bonus !== 'callback') {
        bonuses.add(bonus);
        continue;
      }
      // Special case for Crashlanding
      const cardName = adjacentSpace.tile?.card;
      if (cardName !== CardName.CRASHLANDING) {
        throw new Error('\'callback\' only applies to Crashlanding now.');
      }
      const adjacentBonuses =
        CrashlandingBonus.onTilePlacedAdjacentToCrashlanding(
          player.game, adjacentSpace, newTileSpace);
      adjacentBonuses.forEach((bonus) => bonuses.add(bonus));
    }

    for (const [bonus, qty] of bonuses.multiplicities()) {
      for (let idx = 0; idx < qty; idx++) {
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
      }
    }

    const bonusText = Array.from(bonuses.multiplicities())
      .map(([bonus, count]) => `${count} ${SpaceBonus.toString(bonus)}`)
      .join(', ');
    const tileText = adjacentSpace.tile !== undefined ? tileTypeToString[adjacentSpace.tile.tileType] : 'no tile';
    player.game.log('${0} gains ${1} for placing next to ${2}', (b) => b.player(player).string(bonusText).string(tileText));

    if (giveAresTileOwnerBonus) {
      let ownerBonus = 1;
      if (adjacentPlayer.cardIsInEffect(CardName.MARKETING_EXPERTS)) {
        ownerBonus = 2;
      }

      adjacentPlayer.megaCredits += ownerBonus;
      player.game.log('${0} gains ${1} M€ for a tile placed next to ${2}', (b) => b.player(adjacentPlayer).number(ownerBonus).string(tileText));
    }
  }

  public static maybeIncrementMilestones(aresData: AresData, player: IPlayer, space: Space) {
    const hasAdjacencyBonus = player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => {
      return (adjacentSpace.adjacency?.bonus?? []).length > 0;
    });

    if (hasAdjacencyBonus) {
      const entry : MilestoneCount | undefined = aresData.milestoneResults.find((e) => e.id === player.id);
      if (entry === undefined) {
        throw new Error('Player ID not in the Ares milestone results map: ' + player.id);
      }
      entry.count++;
    }
  }

  // TODO(kberg): replace with isHazardTileType?
  public static hasHazardTile(space: Space): boolean {
    return hazardSeverity(space.tile?.tileType) !== HazardSeverity.NONE;
  }

  private static computeAdjacencyCosts(game: IGame, space: Space, subjectToHazardAdjacency: boolean): AdjacencyCost {
    // Summing up production cost isn't really the way to do it, because each tile could
    // reduce different production costs. Oh well.
    let megaCreditCost = 0;
    let productionCost = 0;
    game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      megaCreditCost += adjacentSpace.adjacency?.cost || 0;
      if (subjectToHazardAdjacency === true) {
        const severity = hazardSeverity(adjacentSpace.tile?.tileType);
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

    const severity = hazardSeverity(space.tile?.tileType);
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

  public static assertCanPay(player: IPlayer, space: Space, subjectToHazardAdjacency: boolean): AdjacencyCost {
    if (player.game.phase === Phase.SOLAR) {
      return {megacredits: 0, production: 0};
    }
    const cost = AresHandler.computeAdjacencyCosts(player.game, space, subjectToHazardAdjacency);

    // Make this more sophisticated, a player can pay for different adjacencies
    // with different production units, and, a severe hazard can't split payments.
    const availableProductionUnits = (player.production.megacredits + 5) +
            player.production.steel +
            player.production.titanium +
            player.production.plants +
            player.production.energy +
            player.production.heat;

    if (availableProductionUnits >= cost.production && player.canAfford(cost.megacredits)) {
      return cost;
    }
    if (cost.production > 0) {
      throw new Error(`Placing here costs ${cost.production} units of production and ${cost.megacredits} M€`);
    }
    if (cost.megacredits > 0) {
      throw new Error(`Placing here costs ${cost.megacredits} M€`);
    }
    return cost;
  }

  public static payAdjacencyAndHazardCosts(player: IPlayer, space: Space, subjectToHazardAdjacency: boolean) {
    const cost = this.assertCanPay(player, space, subjectToHazardAdjacency);

    if (cost.production > 0) {
      // TODO(kberg): don't send interrupt if total is available.
      player.game.defer(new SelectProductionToLoseDeferred(player, cost.production));
    }
    if (cost.megacredits > 0) {
      player.game.log('${0} placing a tile here costs ${1} M€', (b) => b.player(player).number(cost.megacredits));
      player.game.defer(new SelectPaymentDeferred(player, cost.megacredits, {title: 'Select how to pay additional placement costs.'}));
    }
  }

  // Returns true if |newTile| can cover |boardTile|.
  public static canCover(space: Space, newTile: Tile): boolean {
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

  public static onTemperatureChange(game: IGame, aresData: AresData) {
    _AresHazardPlacement.onTemperatureChange(game, aresData);
  }

  public static onOceanPlaced(aresData: AresData, player: IPlayer) {
    _AresHazardPlacement.onOceanPlaced(aresData, player);
  }

  public static onOxygenChange(game: IGame, aresData: AresData) {
    _AresHazardPlacement.onOxygenChange(game, aresData);
  }

  public static grantBonusForRemovingHazard(player: IPlayer, initialTileType: TileType | undefined) {
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
    player.increaseTerraformRating(steps);
    player.game.log('${0}\'s TR increases ${1} step(s) for removing ${2}', (b) => b.player(player).number(steps).tileType(initialTileType));
  }
}
