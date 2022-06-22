import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../common/TileType';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';

export class TheWomb extends MoonCard {
  constructor() {
    super({
      name: CardName.THE_WOMB,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.MOON],
      cost: 16,
      productionBox: Units.of({energy: -2, megacredits: 4}),
      reserveUnits: Units.of({titanium: 2}),
      tr: {moonColony: 1},

      metadata: {
        description: 'Decrease your energy production 2 steps and increase your M€ production 4 steps. ' +
          'Spend 2 titanium. Place a colony tile on the Moon and raise the Colony Rate 1 step.',
        cardNumber: 'M08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).nbsp.megacredits(4);
          }).br;
          b.minus().titanium(2).moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE});
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public override play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
