import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class ColonistShuttles extends MoonCard {
  constructor() {
    super({
      name: CardName.COLONIST_SHUTTLES,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE],
      cost: 12,

      metadata: {
        description: 'Spend 1 titanium. Raise Colony Rate 1 step. Gain 2MC for each colony tile on the Moon.',
        cardNumber: 'M16',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonColonyRate().br;
          b.megacredits(2).slash().tile(TileType.MOON_COLONY, false);
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
      tilesBuilt: [TileType.MOON_COLONY],
    });
  };

  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseColonyRate(player);
    const surfaceColonies = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, true).length;
    player.megaCredits += surfaceColonies * 2;
    return undefined;
  }
}
