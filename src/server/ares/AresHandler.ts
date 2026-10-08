import {CardName} from '../../common/cards/CardName';
import {IGame} from '../IGame';
import {SelectCard} from '../inputs/SelectCard';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {CardResource} from '../../common/CardResource';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {HAZARD_STEPS, HazardSeverity, hazardSeverity} from '../../common/AresTileType';
import {TileType, tileTypeToString} from '../../common/TileType';
import {AresData, MilestoneCount} from '../../common/ares/AresData';
import {AdjacencyCost, AresProductionCost, EMPTY_ARES_PRODUCTION_COST} from './AdjacencyCost';
import {MultiSet} from 'mnemonist';
import {Phase} from '../../common/Phase';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {SelectProductionToLoseDeferred} from '../deferredActions/SelectProductionToLoseDeferred';
import {AresHazards} from './AresHazards';
import {CrashlandingBonus} from '../pathfinders/CrashlandingBonus';
import {Board} from '../boards/Board';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {message} from '../logs/MessageBuilder';
import {Units} from '../../common/Units';
import {PRODUCTION_MINIMUMS} from '../../common/constants';

export class AresHandler {
  private constructor() {}

  public static ifAres(game: IGame, cb: (aresData: AresData) => void) {
    if (game.gameOptions.aresExtension) {
      if (game.aresData === undefined) {
        throw new Error('Assertion failure: game.aresData is undefined');
      }
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
      if (adjacentPlayer.tableau.has(CardName.MARKETING_EXPERTS)) {
        ownerBonus = 2;
      }

      adjacentPlayer.megaCredits += ownerBonus;
      player.game.log('${0} gains ${1} M€ for a tile placed next to ${2}', (b) => b.player(adjacentPlayer).number(ownerBonus).string(tileText));
    }
  }

  public static maybeIncrementMilestones(aresData: AresData, player: IPlayer, space: Space, hazardSeverity: HazardSeverity) {
    const entry : MilestoneCount | undefined = aresData.milestoneResults.find((e) => e.id === player.id);
    if (entry === undefined) {
      throw new Error('Player ID not in the Ares milestone results map: ' + player.id);
    }

    const hasAdjacencyBonus = player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => {
      return (adjacentSpace.adjacency?.bonus?? []).length > 0;
    });

    if (hasAdjacencyBonus) {
      entry.networkerCount++;
    }
    if (hazardSeverity !== 'none') {
      entry.purifierCount++;
    }
  }

  public static incrementPurifier(aresData: AresData, player: IPlayer) {
    const entry : MilestoneCount | undefined = aresData.milestoneResults.find((e) => e.id === player.id);
    if (entry === undefined) {
      throw new Error('Player ID not in the Ares milestone results map: ' + player.id);
    }
    entry.purifierCount++;
  }

  public static hasHazardTile(space: Space): boolean {
    return hazardSeverity(space.tile?.tileType) !== 'none';
  }

  public static computePlacementCosts(player: IPlayer, board: Board, space: Space, subjectToHazardAdjacency: boolean): AdjacencyCost {
    if (player.tableau.has(CardName.ATHENA)) {
      subjectToHazardAdjacency = false;
    }

    let megaCreditCost = 0;
    const productionCost: AresProductionCost = {...EMPTY_ARES_PRODUCTION_COST};
    board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      megaCreditCost += adjacentSpace.adjacency?.cost || 0;
      // TODO(kberg): offset costs with heat and MC bonuses.
      // for (const bonus of adjacency.bonus) {
      //   case (bonus) {
      //     switch SpaceBonus.MEGACREDITS:
      //       costs.stock.megacredits--;
      //     switch SpaceBonus.MEGACREDITS:
      //       costs.stock.megacredits--;
      //   }
      // }
      if (subjectToHazardAdjacency === true) {
        const severity = hazardSeverity(adjacentSpace.tile?.tileType);
        if (severity !== 'none') {
          productionCost[severity]++;
        }
      }
    });

    const severity = hazardSeverity(space.tile?.tileType);
    megaCreditCost += HAZARD_STEPS[severity] * 8;
    const tr = HAZARD_STEPS[severity];

    return {megacredits: megaCreditCost, production: productionCost, tr};
  }

  public static assertCanPay(player: IPlayer, space: Space, subjectToHazardAdjacency: boolean): AdjacencyCost {
    if (player.game.phase === Phase.SOLAR) {
      return {megacredits: 0, production: EMPTY_ARES_PRODUCTION_COST, tr: 0};
    }
    const cost = AresHandler.computePlacementCosts(player, player.game.board, space, subjectToHazardAdjacency);

    if (AresHandler.canPayProduction(player, cost.production) && player.canAfford({cost: cost.megacredits, tr: {tr: cost.tr}})) {
      return cost;
    }
    const messages = [];
    const totalProduction = cost.production.mild * HAZARD_STEPS.mild + cost.production.severe * HAZARD_STEPS.severe;
    if (totalProduction > 0) {
      messages.push(`${totalProduction} units of production`);
    }
    if (cost.megacredits > 0) {
      messages.push(`${cost.megacredits} M€`);
    }
    if (cost.tr > 0 && PartyHooks.reds01PolicyInEffect(player)) {
      messages.push(`additional M€ for ${cost.tr} TR`);
    }
    throw new Error(`Placing here costs ${messages.join(', ')}`);
  }

  // Each hazard's production loss must come from a single production type.
  public static canPayProduction(player: IPlayer, costs: AresProductionCost): boolean {
    // Short circuit most of the time
    if (costs.mild === 0 && costs.severe === 0) {
      return true;
    }
    // Count how many 2-step and 1-step losses the player's production can cover.
    let twoStepLosses = 0;
    let oneStepLosses = 0;
    for (const resource of Units.keys) {
      const units = player.production.get(resource) - PRODUCTION_MINIMUMS[resource];
      twoStepLosses += Math.floor(units / 2);
      oneStepLosses += units % 2;
    }

    // Each severe hazard needs 2 steps from a single production.
    if (twoStepLosses < costs.severe) {
      return false;
    }
    // Pairs not used on severe hazards can pay for mild hazards.
    oneStepLosses += 2 * (twoStepLosses - costs.severe);
    return oneStepLosses >= costs.mild;
  }

  public static payAdjacencyAndHazardCosts(player: IPlayer, space: Space, subjectToHazardAdjacency: boolean) {
    const cost = this.assertCanPay(player, space, subjectToHazardAdjacency);

    const steps = cost.production.severe * HAZARD_STEPS.severe + cost.production.mild * HAZARD_STEPS.mild;
    if (steps > 0) {
      const title = message('Choose ${0} units of production to lose from ${1} mild and ${2} severe hazards',
        (b) => b.number(steps).number(cost.production.mild).number(cost.production.severe));
      const warning = cost.production.severe > 0 ?
        'Placing next to severe hazards requires losing 2 units of the same production.' :
        undefined;
      player.game.defer(new SelectProductionToLoseDeferred(player, steps, title, cost.production.severe, warning));
    }
    if (cost.megacredits > 0) {
      player.game.log('${0} placing a tile here costs ${1} M€', (b) => b.player(player).number(cost.megacredits));
      player.game.defer(new SelectPaymentDeferred(player, cost.megacredits, {title: 'Select how to pay additional placement costs.'}));
    }
  }

  public static onTemperatureChange(game: IGame, aresData: AresData) {
    AresHazards.onTemperatureChange(game, aresData);
  }

  public static onOceanPlaced(aresData: AresData, player: IPlayer) {
    AresHazards.onOceanPlaced(aresData, player);
  }

  public static onOxygenChange(game: IGame, aresData: AresData) {
    AresHazards.onOxygenChange(game, aresData);
  }

  public static grantBonusForRemovingHazard(player: IPlayer, initialTileType: TileType) {
    if (player.game.phase === Phase.SOLAR) {
      return;
    }
    const steps = HAZARD_STEPS[hazardSeverity(initialTileType)];
    if (steps > 0) {
      player.increaseTerraformRating(steps);
      player.game.log('${0}\'s TR increases ${1} step(s) for removing ${2}', (b) => b.player(player).number(steps).tileType(initialTileType));
    }
  }

  public static anyAdjacentSpaceGivesBonus(board: Board, space: Space, bonus: SpaceBonus): boolean {
    return board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }
}
