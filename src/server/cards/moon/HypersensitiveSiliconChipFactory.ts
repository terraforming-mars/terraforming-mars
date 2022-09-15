import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class HypersensitiveSiliconChipFactory extends Card {
  constructor() {
    super({
      name: CardName.HYPERSENSITIVE_SILICON_CHIP_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 11,

      behavior: {
        production: {megacredits: 4},
      },
      requirements: CardRequirements.builder((b) => b.miningTiles(2, {all})),
      reserveUnits: {titanium: 2},

      metadata: {
        description: 'Requires 2 mining tiles on The Moon. Spend 2 titanium. Increase your M€ production 4 steps.',
        cardNumber: 'M43',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).nbsp;
          b.production((pb) => pb.megacredits(4)).br;
        }),
      },
    });
  }
}
