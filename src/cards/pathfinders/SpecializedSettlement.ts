import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../common/Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';

export class SpecializedSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SPECIALIZED_SETTLEMENT,
      tags: [Tags.CITY, Tags.BUILDING, Tags.MARS],
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

  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 &&
      player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  private calcuateBonusResources(space: ISpace) {
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
    this.bonusResource = Array.from(resources);
  }

  public play(player: Player) {
    this.defaultProduce(player);
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        this.calcuateBonusResources(space);
        this.produceForTile(player);
        return undefined;
      },
    );
  }

  public produce(player: Player) {
    this.defaultProduce(player);
    this.produceForTile(player);
  }

  private defaultProduce(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);
  }

  public produceForTile(player: Player) {
    if (this.bonusResource === undefined) {
      return;
    }

    player.game.defer(new SelectResourceTypeDeferred(
      player, this.bonusResource,
      'Select a resource to gain 1 unit of production',
      (resource) => {
        player.addProduction(resource, 1, {log: true});
      },
    ));
  }
}
