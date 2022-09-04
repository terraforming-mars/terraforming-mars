import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';

export class SpecializedSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
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

  public bonusResource?: Array<Resources>;

  public override bespokeCanPlay(player: Player): boolean {
    return player.production.energy >= 1 &&
      player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  private bonusResources(space: ISpace) {
    const resources: Set<Resources> = new Set();
    space.bonus.forEach((bonus) => {
      switch (bonus) {
      case SpaceBonus.STEEL:
        resources.add(Resources.STEEL);
        break;
      case SpaceBonus.TITANIUM:
        resources.add(Resources.TITANIUM);
        break;
      case SpaceBonus.PLANT:
        resources.add(Resources.PLANTS);
        break;
      case SpaceBonus.HEAT:
        resources.add(Resources.HEAT);
        break;
      }
    });
    return Array.from(resources);
  }

  public override bespokePlay(player: Player) {
    this.defaultProduce(player);
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        const coveringExistingTile = space.tile !== undefined;

        player.game.addCityTile(player, space.id);

        if (coveringExistingTile) return;
        const bonusResources = this.bonusResources(space);
        if (bonusResources.length === 0) return;

        player.game.defer(new SelectResourceTypeDeferred(
          player, bonusResources,
          'Select a resource to gain 1 unit of production',
          (resource) => {
            player.production.add(resource, 1, {log: true});
            this.bonusResource = [resource];
          },
        ));
        return undefined;
      },
    );
  }

  public produce(player: Player) {
    this.defaultProduce(player);
    if (this.bonusResource && this.bonusResource.length === 1) {
      player.production.add(this.bonusResource[0], 1, {log: true});
    }
  }

  private defaultProduce(player: Player) {
    player.production.add(Resources.ENERGY, -1);
    player.production.add(Resources.MEGACREDITS, 3);
  }

  public produceForTile(player: Player, bonusResources: Array<Resources>) {
    if (bonusResources.length === 0) return;

    player.game.defer(new SelectResourceTypeDeferred(
      player, bonusResources,
      'Select a resource to gain 1 unit of production',
      (resource) => {
        player.production.add(resource, 1, {log: true});
        this.bonusResource = [resource];
      },
    ));
  }
}
