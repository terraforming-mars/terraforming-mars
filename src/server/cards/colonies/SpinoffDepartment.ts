import {IProjectCard, isIProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {ICard} from '@/server/cards/ICard';

export class SpinoffDepartment extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tag.BUILDING],
      name: CardName.SPINOFF_DEPARTMENT,
      type: CardType.ACTIVE,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'C41',
        renderData: CardRenderer.builder((b) => {
          b.effect('WHEN PLAYING A CARD WITH A BASIC COST OF 20M€ OR MORE, draw a card.', (eb) => {
            eb.megacredits(20).asterix().startEffect.cards(1);
          }).br;
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Increase your M€ production 2 steps.',
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (isIProjectCard(card) && card.cost >= 20) {
      player.drawCard();
    }
  }
}
