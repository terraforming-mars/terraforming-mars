import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {MoonCard} from './MoonCard';
import {Size} from '../../../common/cards/render/Size';
import {Resources} from '../../../common/Resources';
import {all} from '../Options';

export class ColonistShuttles extends MoonCard {
  constructor() {
    super({
      name: CardName.COLONIST_SHUTTLES,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SPACE],
      cost: 12,
      reserveUnits: {titanium: 1},
      tr: {moonColony: 1},

      metadata: {
        description: 'Spend 1 titanium. Raise the Colony Rate 1 step. Gain 2M€ for each colony tile on the Moon.',
        cardNumber: 'M16',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonColonyRate().br;
          b.megacredits(2).slash().moonColony({size: Size.SMALL, all});
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public play(player: Player) {
    MoonExpansion.raiseColonyRate(player);
    const surfaceColonies = MoonExpansion.spaces(player.game, TileType.MOON_COLONY, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, surfaceColonies * 2, {log: true});

    return undefined;
  }
}
