import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {CardType} from '../../../common/cards/CardType';
import {uppercase} from '../Options';

export class HeadStart extends PreludeCard {
  constructor() {
    super({
      name: CardName.HEAD_START,

      behavior: {
        stock: {
          steel: 2,
        },
      },

      metadata: {
        cardNumber: 'X43',
        renderData: CardRenderer.builder((b) => {
          b.steel(2).br;
          b.text('GAIN 2 STEEL.', {size: Size.TINY}).br;
          b.megacredits(1, {text: '?'}).br;
          b.text('GAIN 2 M€ PER PROJECT CARD YOU HAVE IN HAND.', {size: Size.TINY, uppercase, isBold: false}).br;
          b.arrow().arrow().br;
          b.text('IMMEDIATELY TAKE 2 ACTIONS.', {size: Size.TINY, uppercase, isBold: false}).br;
        }),
      },
    });
  }

  private static PROJECT_CARD_TYPES = [CardType.ACTIVE, CardType.AUTOMATED, CardType.EVENT];

  public override bespokePlay(player: IPlayer) {
    const projectCardsInHand = player.cardsInHand.filter((card) => HeadStart.PROJECT_CARD_TYPES.includes(card.type));
    const megacredits = projectCardsInHand.length * 2;
    player.stock.add(Resource.MEGACREDITS, megacredits, {log: true});

    return undefined;
  }
}
