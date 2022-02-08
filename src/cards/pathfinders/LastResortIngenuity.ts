import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class LastResortIngenuity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.LAST_RESORT_INGENUITY,
      cost: 4,

      metadata: {
        cardNumber: 'Pf47',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).asterix().colon().openBrackets.steel(1).titanium(1).closeBrackets;
          b.br;
          b.text('The next card you play this generation can be paid for with steel or titanium despite its tags.', Size.MEDIUM, true, true);
        }),
      },
    });
  }

  // Behavior in player.canUseSteel, player.canUseTitanium, and SelectHowToPayForProjectCard.
  public play() {
    return undefined;
  }
}

