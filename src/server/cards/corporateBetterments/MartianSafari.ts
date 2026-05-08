import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class MartianSafari extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_SAFARI,
      tags: [Tag.ANIMAL],
      cost: 22,
      victoryPoints: {tag: Tag.ANIMAL},

      requirements: {tag: Tag.ANIMAL, count: 1},

      metadata: {
        cardNumber: 'B03',
        description: 'Requires you own an Animal tag. 1 VP for each Animal tag you own.',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever an Animal tag is played, including this, increase your M€ production 1 step.', (eb) => {
            eb.tag(Tag.ANIMAL, {size: Size.SMALL}).startEffect.production((pb) => pb.megacredits(1));
          }).br;
          b.vpText('1 VP per Animal tag you own.');
        }),
      },
    });
  }

  public onCardPlayedByAnyPlayer(cardOwner: IPlayer, card: ICard, activePlayer: IPlayer) {
    const animalTags = activePlayer.tags.cardTagCount(card, Tag.ANIMAL);
    for (let i = 0; i < animalTags; i++) {
      cardOwner.production.add(Resource.MEGACREDITS, 1, {log: true});
    }
  }
}
