import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {CardResource} from '../../../common/CardResource';

export class TopsoilContract extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TOPSOIL_CONTRACT,
      tags: [Tag.MICROBE, Tag.EARTH],
      cost: 8,

      behavior: {
        stock: {plants: 3},
      },

      metadata: {
        cardNumber: 'X30',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you gain a microbe to ANY CARD, also gain 1 M€.', (eb) => {
            eb.microbes(1).asterix().startEffect.megacredits(1);
          }).br;
          b.plants(3);
        }),
        description: 'Gain 3 plants.',
      },
    });
  }

  public onResourceAdded(player: Player, card: ICard, count: number) {
    if (card.resourceType === CardResource.MICROBE) {
      player.megaCredits += count;
    }
  }
}
