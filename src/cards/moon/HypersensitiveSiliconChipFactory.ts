import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class HypersensitiveSiliconChipFactory extends MoonCard {
  constructor() {
    super({
      name: CardName.HYPERSENSITIVE_SILICON_CHIP_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 11,
      productionBox: Units.of({megacredits: 4}),
      requirements: CardRequirements.builder((b) => b.miningTiles(2, {all})),
      reserveUnits: Units.of({titanium: 2}),

      metadata: {
        description: 'Requires 2 mining tiles on the Moon. Spend 2 titanium. Increase your M€ production 4 steps.',
        cardNumber: 'M43',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).nbsp;
          b.production((pb) => pb.megacredits(4)).br;
        }),
      },
    });
  }
}
