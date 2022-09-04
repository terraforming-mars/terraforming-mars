import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LuxuryFoods extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUXURY_FOODS,
      cardType: CardType.AUTOMATED,
      cost: 8,

      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.JOVIAN)),
      metadata: {
        description: 'Requires that you have a Venus tag, an Earth tag and a Jovian tag.',
        cardNumber: 'T10',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.tags.playerHas([Tag.VENUS, Tag.EARTH, Tag.JOVIAN]);
  }
}
