import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';


export class Habitat14 extends Card {
  constructor() {
    super({
      name: CardName.HABITAT_14,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.MOON],
      cost: 5,
      productionBox: {energy: -1, megacredits: -1},
      reserveUnits: {titanium: 1},
      tr: {moonColony: 1},

      metadata: {
        description: 'Decrease your energy production 1 step and your M€ production 1 step. Spend 1 titanium. Place a colony tile on the Moon and raise the Colony Rate 1 step.',
        cardNumber: 'M05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).minus().megacredits(1);
          }).br;
          b.minus().titanium(1).br;
          b.moonColony();
        }),
      },
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
