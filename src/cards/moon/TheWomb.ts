import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';

export class TheWomb extends MoonCard {
  constructor() {
    super({
      name: CardName.THE_WOMB,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.MOON],
      cost: 16,
      productionBox: Units.of({energy: -2, megacredits: 4}),

      metadata: {
        description: 'Decrease your energy production 2 steps and increase your MC production 4 steps. ' +
          'Spend 2 titanium. Place a colony tile on the Moon and raise the Colony Rate 1 step.',
        cardNumber: 'M08',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).br;
          b.production((pb) => {
            pb.minus().energy(2).br.megacredits(4);
          }).br;
          b.moonColony();
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 2}),
      tilesBuilt: [TileType.MOON_COLONY],
    });
  };

  public play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
