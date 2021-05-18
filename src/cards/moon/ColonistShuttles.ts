import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';

export class ColonistShuttles extends MoonCard {
  constructor() {
    super({
      name: CardName.COLONIST_SHUTTLES,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE],
      cost: 12,

      metadata: {
        description: 'Spend 1 titanium. Raise the Colony Rate 1 step. Gain 2M€ for each colony tile on the Moon.',
        cardNumber: 'M16',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonColonyRate().br;
          b.megacredits(2).slash().moonColony({size: Size.SMALL}).any;
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
    const surfaceColonies = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, surfaceColonies * 2, {log: true});

    return undefined;
  }
}
