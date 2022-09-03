import {IProjectCard} from '../IProjectCard';
import {Card2} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class CEOsFavoriteProject extends Card2 implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CEOS_FAVORITE_PROJECT,
      cost: 1,

      metadata: {
        cardNumber: '149',
        renderData: CardRenderer.builder((b) => b.text('Add 1 resource to a card with at least 1 resource on it', Size.SMALL, true)),
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getCardsWithResources().length > 0;
  }

  public override bespokePlay(player: Player) {
    const cards = player.getCardsWithResources();
    return new SelectCard(
      'Select card to add resource',
      'Add resource',
      cards,
      ([card]) => {
        if (!cards.includes(card)) {
          throw new Error('Invalid card selection');
        }
        player.addResourceTo(card, {log: true});
        return undefined;
      },
    );
  }
}

