import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {MoonCard} from './MoonCard';


export class Habitat14 extends MoonCard {
  constructor() {
    super({
      name: CardName.HABITAT_14,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.MOON],
      cost: 5,
      productionBox: Units.of({energy: -1, megacredits: -1}),

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
    }, {
      reserveUnits: Units.of({titanium: 1}),
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
