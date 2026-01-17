import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {Tag} from '@/common/cards/Tag';
import {all} from '@/server/cards/Options';

export class ExcavatorLeasing extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EXCAVATOR_LEASING,
      tags: [Tag.BUILDING],
      cost: 8,

      metadata: {
        cardNumber: 'U035',
        renderData: CardRenderer.builder((b) => {
          b.effect('The excavate standard project costs 1 M€ less for all players.',
            (eb) => eb.excavate(1, {all}).startEffect.minus().megacredits(1)).br;
          b.effect('When any player excavates underground resources, you gain 1 M€ per excavation.',
            (eb) => eb.excavate(1, {all}).startEffect.megacredits(1)).br;
        }),
      },
    });
  }
}
