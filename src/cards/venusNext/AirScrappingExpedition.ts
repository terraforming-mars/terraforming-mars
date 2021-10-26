import {ICard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class AirScrappingExpedition extends Card {
  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_EXPEDITION,
      cardType: CardType.EVENT,
      tags: [Tags.VENUS],
      cost: 13,
      tr: {venus: 1},

      metadata: {
        cardNumber: '215',
        description: 'Raise Venus 1 step. Add 3 Floaters to ANY Venus CARD.',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).floaters(3, {secondaryTag: Tags.VENUS});
        }),
      },
    });
  };

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    let floaterCards = player.getResourceCards(ResourceType.FLOATER);
    floaterCards = floaterCards.filter((card) => card.tags.some((cardTag) => cardTag === Tags.VENUS));
    if (floaterCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select card to add 3 floaters', 'Add floaters', floaterCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], 3);
      return undefined;
    });
  }
}
