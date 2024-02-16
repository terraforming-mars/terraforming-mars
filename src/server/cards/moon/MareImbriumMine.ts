import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonSpaces} from '../../../common/moon/MoonSpaces';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MareImbriumMine extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARE_IMBRIUM_MINE,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.BUILDING],
      cost: 19,
      reserveUnits: {titanium: 1},

      behavior: {
        production: {steel: 1, titanium: 1},
        moon: {
          mineTile: {space: MoonSpaces.MARE_IMBRIUM},
        },
      },

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step and your titanium production 1 step. Place a mine ON THE RESERVED AREA and raise the mining rate 1 step.',
        cardNumber: 'M03',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1);
          b.production((pb) => pb.steel(1).titanium(1)).br;
          b.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).asterix();
        }),
      },
    });
  }
}
