import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IStandardProjectCard} from '@/server/cards/IStandardProjectCard';
import {Resource} from '@/common/Resource';

export class StandardTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.STANDARD_TECHNOLOGY,
      tags: [Tag.SCIENCE],
      cost: 6,

      metadata: {
        cardNumber: '156',
        renderData: CardRenderer.builder((b) => {
          b.effect('After you pay for a standard project, except selling patents, you gain 3 M€.', (eb) => {
            eb.plate('Standard projects').startEffect.megacredits(3);
          });
        }),
      },
    });
  }
  public onStandardProject(player: IPlayer, projectType: IStandardProjectCard) {
    if (projectType.name !== CardName.SELL_PATENTS_STANDARD_PROJECT) {
      player.stock.add(Resource.MEGACREDITS, 3, {log: true});
    }
  }
}
