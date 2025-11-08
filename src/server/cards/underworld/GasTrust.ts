import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {digit} from '../Options';

export class GasTrust extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GAS_TRUST,
      type: CardType.AUTOMATED,
      cost: 12,
      tags: [Tag.CRIME],

      behavior: {
        underworld: {
          corruption: 1,
        },
      },

      metadata: {
        cardNumber: 'U092',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).nbsp.nbsp.heat(3, {digit}).slash().tag(Tag.CRIME).asterix();
        }),
        description: 'Gain 1 corruption. Gain 3 heat for each crime tag you have INCLUDING EVENTS and this card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // +1 is for including this.
    const tags = player.tags.count(Tag.CRIME, 'raw-underworld') + player.tags.count(Tag.WILD) + 1;
    player.stock.add(Resource.HEAT, tags * 3, {log: true});
    return undefined;
  }
}
