import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LastResortIngenuity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.LAST_RESORT_INGENUITY,
      cost: 4,

      metadata: {
        cardNumber: 'Pf47',
        renderData: CardRenderer.builder((_) => {}),
        description: 'The next card you play this generation can be paid for with steel or titanium despite its tags.',
      },
    });
  }

  // Behavior in player.canUseSteel, player.canUseTitanium, and SelectHowToPayForProjectCard.
  public play() {
    return undefined;
  }
}

