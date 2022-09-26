import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';

export class StandardTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
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
  public onStandardProject(player: Player, projectType: ICard) {
    if (projectType.name !== CardName.SELL_PATENTS_STANDARD_PROJECT) {
      player.megaCredits += 3;
    }
  }
}
