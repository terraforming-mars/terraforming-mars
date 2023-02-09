import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
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
      cardType: CardType.EVENT,
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

  public override bespokePlay(player: Player) {
    let floaterCards = player.getResourceCards(CardResource.FLOATER);
    floaterCards = floaterCards.filter((card) => card.tags.some((cardTag) => cardTag === Tag.VENUS));
    if (floaterCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select card to add 3 floaters', 'Add floaters', floaterCards, ([card]) => {
      player.addResourceTo(card, 3);
      return undefined;
    });
  }
}
