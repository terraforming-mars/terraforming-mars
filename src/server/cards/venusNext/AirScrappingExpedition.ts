import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class AirScrappingExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_EXPEDITION,
      type: CardType.EVENT,
      tags: [Tag.VENUS],
      cost: 13,

      behavior: {
        global: {venus: 1},
      },

      metadata: {
        cardNumber: '215',
        description: 'Raise Venus 1 step. Add 3 floaters to ANY Venus CARD.',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).floaters(3, {secondaryTag: Tag.VENUS});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    let floaterCards = player.getResourceCards(CardResource.FLOATER);
    floaterCards = floaterCards.filter((card) => card.tags.some((cardTag) => cardTag === Tag.VENUS));
    if (floaterCards.length === 0) {
      return undefined;
    }

    if (floaterCards.length === 1) {
      player.addResourceTo(floaterCards[0], {qty: 3, log: true});
      return;
    }

    return new SelectCard('Select card to add 3 floaters', 'Add floaters', floaterCards)
      .andThen(([card]) => {
        player.addResourceTo(card, {qty: 3, log: true});
        return undefined;
      });
  }
}
