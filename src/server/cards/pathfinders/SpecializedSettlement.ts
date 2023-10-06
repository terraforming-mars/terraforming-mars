import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';

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
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
            pb.plus().wild(1);
          }).nbsp.city();
        }),
      },
    });
  }

  public bonusResource?: Array<Resource>;

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.production.energy >= 1 &&
      player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  private bonusResources(space: Space) {
    const resources: Set<Resource> = new Set();
    space.bonus.forEach((bonus) => {
      switch (bonus) {
      case SpaceBonus.STEEL:
        resources.add(Resource.STEEL);
        break;
      case SpaceBonus.TITANIUM:
        resources.add(Resource.TITANIUM);
        break;
      case SpaceBonus.PLANT:
        resources.add(Resource.PLANTS);
        break;
      case SpaceBonus.ENERGY:
        resources.add(Resource.ENERGY);
        break;
      case SpaceBonus.HEAT:
        resources.add(Resource.HEAT);
        break;
      }
    });
    return Array.from(resources);
  }

  public override bespokePlay(player: IPlayer) {
    this.defaultProduce(player);
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player))
      .andThen((space) => {
        const coveringExistingTile = space.tile !== undefined;

        player.game.addCity(player, space);

        if (coveringExistingTile) return;
        const bonusResources = this.bonusResources(space);
        if (bonusResources.length === 0) return;

        player.game.defer(new SelectResourceTypeDeferred(
          player, bonusResources,
          'Select a resource to gain 1 unit of production'))
          .andThen(
            (resource) => {
              player.production.add(resource, 1, {log: true});
              this.bonusResource = [resource];
            },
          );
        return undefined;
      },
      );
  }

  public produce(player: IPlayer) {
    this.defaultProduce(player);
    if (this.bonusResource && this.bonusResource.length === 1) {
      player.production.add(this.bonusResource[0], 1, {log: true});
    }
  }

  private defaultProduce(player: IPlayer) {
    player.production.add(Resource.ENERGY, -1);
    player.production.add(Resource.MEGACREDITS, 3);
  }

  public produceForTile(player: IPlayer, bonusResources: Array<Resource>) {
    if (bonusResources.length === 0) return;

    player.game.defer(new SelectResourceTypeDeferred(
      player, bonusResources,
      'Select a resource to gain 1 unit of production'))
      .andThen(
        (resource) => {
          player.production.add(resource, 1, {log: true});
          this.bonusResource = [resource];
        },
      );
  }
}
