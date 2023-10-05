import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';

export class L1TradeTerminal extends Card {
  constructor() {
    super({
      name: CardName.L1_TRADE_TERMINAL,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 25,
      victoryPoints: 2,

      behavior: {
        colonies: {
          tradeOffset: 2, // TODO(kberg): mandatory
        },
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, first increase that colony tile track 2 steps.', (eb) =>
            eb.trade().startEffect.text('+2')).br;
          b.text('3').diverseTag().asterix().br;
          b.plainText('(Add a resource to 3 different cards.)').br;
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    function addResources(cards: ReadonlyArray<ICard>): void {
      for (const card of cards) {
        player.addResourceTo(card, {qty: 1, log: true});
      }
    }

    const cards = player.getResourceCards();
    if (cards.length <= 3) {
      addResources(cards);
      return undefined;
    }

    return new SelectCard('Select 3 cards to gain 1 resource each', 'Add Resources', cards, {min: 3, max: 3})
      .andThen((cards) => {
        addResources(cards);
        return undefined;
      });
  }
}
