import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Size} from '../../../common/cards/render/Size';
import {SelectProjectCardToPlay} from '../../inputs/SelectProjectCardToPlay';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Odyssey extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.ODYSSEY,
      startingMegaCredits: 33,

      metadata: {
        cardNumber: 'PfC18',
        description: 'You start with 33 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br.br.br.megacredits(33).nbsp.nbsp.nbsp;
          b.colon().cards(1, {secondaryTag: Tag.EVENT}).asterix().br;
          b.text('(Effect: Your event cards stay face up, and their tags are in use as if those were automated (green) cards.)',
            Size.TINY, false, false).br;
          b.action('Pay for and play an event card you have already played that has a base cost of 16M€ or less (INCLUDING events that place special tiles,) after which discard that card.', (e) => {
            e.empty().startAction.tag(Tag.EVENT).asterix().nbsp.text('≤').nbsp.megacredits(16);
          });
        }),
      },
    });
  }

  // For Project Inspection
  private checkLoops: number = 0;

  public getCheckLoops(): number {
    return this.checkLoops;
  }


  private availableEventCards(player: IPlayer) {
    this.checkLoops++;
    try {
      const array = [];
      for (const card of player.playedCards) {
        // Special case Price Wars, which is not easy to work with.
        if (card.name === CardName.PRICE_WARS) {
          continue;
        }
        if (card.type === CardType.EVENT && card.cost <= 16) {
          const details = player.canPlay(card);
          if (details !== false) {
            array.push({card, details});
          }
        }
      }
      return array;
    } finally {
      this.checkLoops--;
    }
  }

  public canAct(player: IPlayer) {
    return this.availableEventCards(player).length > 0;
  }

  public action(player: IPlayer) {
    const eventCards = this.availableEventCards(player);
    return new SelectProjectCardToPlay(player, eventCards, {action: 'discard'})
      .andThen((card) => {
        player.removedFromPlayCards.push(card);
        return undefined;
      });
  }
}
