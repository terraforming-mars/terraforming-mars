import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonSpaces} from '../../../common/moon/MoonSpaces';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MareNectarisMine extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARE_NECTARIS_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.BUILDING],
      cost: 14,

      behavior: {
        production: {steel: 1},
        moon: {
          mineTile: {space: MoonSpaces.MARE_NECTARIS},
        },
      },
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step. Place a mine ON THE RESERVED AREA and raise the Mining Rate 1 step.',
        cardNumber: 'M01',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).nbsp;
          b.production((pb) => pb.steel(1));
          b.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).asterix();
        }),
      },
      tilesBuilt: [TileType.MOON_MINE],
    });
  }
}
