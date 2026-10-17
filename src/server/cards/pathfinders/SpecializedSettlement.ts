import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card, productionBoxWithBonusResource} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';
import {Units} from '../../../common/Units';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {AdjustProduction} from '../../deferredActions/AdjustProduction';

export class SpecializedSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SPECIALIZED_SETTLEMENT,
      tags: [Tag.CITY, Tag.BUILDING, Tag.MARS],
      cost: 20,

      metadata: {
        cardNumber: 'PF57',
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. ' +
          'Place a city tile on Mars. Increase your production by 1 of a resource on the map gained by placement bonus.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.energy(-1).br;
            pb.plus().megacredits(3);
            pb.plus().wild(1);
          }).nbsp.city();
        }),
      },
    });
  }

  public bonusResource: Array<Resource> | undefined;
  private inSpecializedSettlement: boolean = false;

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.board.getAvailableSpacesForCity(player).length === 0) {
      return false;
    }
    if (player.production.energy >= 1) {
      return true;
    }
    // A Mars-track advance can grant +1 energy production, which offsets the cost.
    return PathfindersExpansion.willGainEnergyProductionOnNextMarsTag(player);
  }

  private static readonly RESOURCES_FOR_BONUS: Partial<Record<SpaceBonus, Resource>> = {
    [SpaceBonus.STEEL]: Resource.STEEL,
    [SpaceBonus.TITANIUM]: Resource.TITANIUM,
    [SpaceBonus.PLANT]: Resource.PLANTS,
    [SpaceBonus.ENERGY]: Resource.ENERGY,
    [SpaceBonus.HEAT]: Resource.HEAT,
  };

  private bonusResources(space: Space): ReadonlySet<Resource> {
    const resources: Set<Resource> = new Set();
    space.bonus
      .map((bonus) => SpecializedSettlement.RESOURCES_FOR_BONUS[bonus])
      .filter((resource) => resource !== undefined)
      .forEach((resource) => resources.add(resource));
    return resources;
  }

  public override bespokePlay(player: IPlayer) {
    // Deferred in case the energy production gain comes from the Planetary track.
    player.game.defer(new AdjustProduction(player, this.defaultProductionBox));

    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player))
      .andThen((space) => {
        const coveringExistingTile = space.tile !== undefined;

        player.game.addCity(player, space);

        if (coveringExistingTile) {
          return;
        }

        // When selecting a standard resource, keep track of that we're resolving
        // actions for this card.
        this.inSpecializedSettlement = space.bonus.includes(SpaceBonus.STANDARD_RESOURCE);
        this.produceForTile(player, this.bonusResources(space));
        return undefined;
      },
      );
  }

  private gainProduction(player: IPlayer, resource: Resource) {
    this.inSpecializedSettlement = false;
    player.production.add(resource, 1, {log: true});
    this.bonusResource = [resource];
  }

  public onStandardResourcePlacementBonus(cardOwner: IPlayer, _activePlayer: IPlayer, _space: Space, resource: Resource) {
    if (this.inSpecializedSettlement) {
      this.gainProduction(cardOwner, resource);
    }
  }

  public readonly defaultProductionBox = Units.of({energy: -1, megacredits: 3});
  public productionBox() {
    return productionBoxWithBonusResource(this);
  }

  private produceForTile(player: IPlayer, bonusResources: ReadonlySet<Resource>) {
    if (bonusResources.size === 0) {
      return;
    }

    player.game.defer(new SelectResourceTypeDeferred(
      player, Array.from(bonusResources),
      'Select a resource to gain 1 unit of production'))
      .andThen((resource) => this.gainProduction(player, resource));
  }
}
