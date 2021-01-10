import {Game} from '../Game';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction} from './DeferredAction';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';
import {CardType} from '../cards/CardType';
import {SelectHowToPayDeferred} from './SelectHowToPayDeferred';
import {LogHelper} from '../LogHelper';

export class DrawCards implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public options: DrawCards.Options = {count: 1},
  ) { }

  private drawSelectedDiscardOthers(selected: Array<IProjectCard>, from: Array<IProjectCard>) {
    this.player.cardsInHand.push(...selected);
    this.log(selected);
    from.forEach((card) => {
      if (selected.find((f) => f.name === card.name) === undefined) {
        this.game.dealer.discard(card);
      }
    });
  }

  private log(cards: Array<IProjectCard>) {
    if (this.specialRequirements) {
      LogHelper.logDrawnCards(this.game, this.player, cards);
    } else {
      LogHelper.logCardChange(this.game, this.player, this.options.paying ? 'bought' : 'drew', cards.length);
    }
  }

  private selectCardsToKeep(cards: Array<IProjectCard>) {
    const keep = this.options.keep || this.options.count;
    return new SelectCard(
      `Select ${keep} card(s) to keep`,
      'Select',
      cards,
      (selected: Array<IProjectCard>) => {
        this.drawSelectedDiscardOthers(selected, cards);
        this.options.cb?.();
        return undefined;
      }, keep, keep,
    );
  }

  private selectCardsToBuy(cards: Array<IProjectCard>) {
    const max = Math.min(this.options.count, Math.floor(this.player.spendableMegacredits() / this.player.cardCost));
    const title = max === 0 ? 'You cannot afford any cards' :
      `Select up to ${max} cards to buy for ${this.player.cardCost} MC each`;
    return new SelectCard(
      title,
      max === 0 ? 'Ok' : 'Buy',
      cards,
      (selected: Array<IProjectCard>) => {
        if (selected.length > 0) {
          this.game.defer(new SelectHowToPayDeferred(
            this.player,
            selected.length * this.player.cardCost,
            {
              title: 'Select how to pay for cards',
              afterPay: () => this.drawSelectedDiscardOthers(selected, cards),
            }));
        } else {
          this.drawSelectedDiscardOthers(selected, cards);
        }
        this.options.cb?.();
        return undefined;
      }, max, 0,
    );
  }

  private get specialRequirements(): boolean {
    return Boolean(this.options.include || this.options.tag || this.options.resource || this.options.cardType);
  }

  public execute() {
    if (this.options.count <= 0) return undefined;
    const include = (card: IProjectCard) => (
      (!this.options.tag || card.tags.includes(this.options.tag)) &&
      (!this.options.resource || this.options.resource === card.resourceType) &&
      (!this.options.cardType || this.options.cardType === card.cardType));

    const cards = this.options.cards ||
      this.game.dealer.drawProjectCardsByCondition(this.game, this.options.count, this.options.include || include);
    if (cards.length === 0) return undefined;

    if (this.options.keep === undefined && !this.options.paying) {
      this.player.cardsInHand.push(...cards);
      this.log(cards);
      return undefined;
    }

    if (this.options.paying) {
      return this.selectCardsToBuy(cards);
    } else {
      return this.selectCardsToKeep(cards);
    }
  }
}

export namespace DrawCards {
  export interface Options {
    count: number,
    keep?: number,
    tag?: Tags,
    resource?: ResourceType,
    cardType?: CardType,
    paying?: boolean,
    include?: (card: IProjectCard) => boolean,
    cards?: Array<IProjectCard>, // Cards to draw or buy. If undefined, then cards are draw from game.dealer.
    cb?: () => void,
  }
}
