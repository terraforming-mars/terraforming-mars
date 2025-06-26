import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LuxuryFoods extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUXURY_FOODS,
      type: CardType.AUTOMATED,
      cost: 8,

      victoryPoints: 2,

      requirements: [{tag: Tag.VENUS}, {tag: Tag.EARTH}, {tag: Tag.JOVIAN}],
      metadata: {
        description: 'Requires that you have a Venus tag, an Earth tag and a Jovian tag.',
        cardNumber: '237',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.tags.playerHas([Tag.VENUS, Tag.EARTH, Tag.JOVIAN]);
  }
}
