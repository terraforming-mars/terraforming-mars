import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class UndergroundRailway extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_RAILWAY,
      cost: 18,
      tags: [Tag.BUILDING],

      behavior: {
        production: {energy: -1},
        tr: {underworld: {undergroundTokens: {}}, per: 4},
      },

      metadata: {
        cardNumber: 'U004',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).br;
          b.tr(1).slash().undergroundResources(4, {digit});
        }),
        description: 'Decrease your energy production 1 step. Gain 1 TR for every 4 underground tokens you have.',
      },
    });
  }
}
