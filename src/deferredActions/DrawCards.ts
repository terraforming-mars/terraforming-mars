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
import {range} from '../utils/utils';

export class DrawCards implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public options: DrawCards.Options = {amount: 1},
  ) { }

  private drawSelectedDiscardOthers(selected: Array<IProjectCard>, from: Array<IProjectCard>) {
    this.player.cardsInHand.push(...selected);
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
      this.game.log('${0} drew ${1} card(s)', (b) => b
        .player(this.player)
        .number(cards.length),
      );
    }
  }

  private selectCardsToKeep(cards: Array<IProjectCard>) {
    return new SelectCard(
      `Select ${this.options.amount} card(s) to keep`,
      'Select',
      cards,
      (selected: Array<IProjectCard>) => {
        selected = selected.slice(0, this.options.amount);
        this.drawSelectedDiscardOthers(selected, cards);
        this.log(cards);
        return undefined;
      }, this.options.amount, this.options.amount,
    );
  }

  private selectCardsToBuy(cards: Array<IProjectCard>) {
    const howManyCanAfford = Math.max(
      ...range(this.options.amount + 1)
        .filter((n) => this.player.canAfford(n * this.player.cardCost)),
    );
    const info = howManyCanAfford !== this.options.amount ? ' (you cannot afford more)':'';
    return new SelectCard(
      `Select at most ${howManyCanAfford}${info} card(s) to buy`,
      'Buy',
      cards,
      (selected: Array<IProjectCard>) => {
        selected = selected.slice(0, howManyCanAfford);
        this.drawSelectedDiscardOthers(selected, cards);
        if (selected.length > 0) {
          this.game.defer(new SelectHowToPayDeferred(
            this.player, selected.length * this.player.cardCost,
            {title: 'Select how to pay for cards'}));
        }
        this.game.log('${0} bought ${1} card(s)', (b) => b
          .player(this.player)
          .number(selected.length));
        return undefined;
      }, this.options.amount, 0,
    );
  }

  private get specialRequirements(): boolean {
    return Boolean(this.options.include || this.options.tag || this.options.resource || this.options.cardType);
  }

  public execute() {
    const total = this.options.from || this.options.amount;
    if (total <= 0) return undefined;
    const include = (card: IProjectCard) => (
      (!this.options.tag || card.tags.includes(this.options.tag)) &&
      (!this.options.resource || this.options.resource === card.resourceType) &&
      (!this.options.cardType || this.options.cardType === card.cardType));

    const cards = this.game.dealer.drawProjectCardsByCondition(this.game, total, this.options.include || include);

    if (this.options.from === undefined && !this.options.isBuying) {
      this.player.cardsInHand.push(...cards);
      this.log(cards);
      return undefined;
    }

    if (this.options.isBuying) {
      return this.selectCardsToBuy(cards);
    } else {
      return this.selectCardsToKeep(cards);
    }
  }
}

export namespace DrawCards {
  export interface Options {
    amount: number,
    from?: number,
    tag?: Tags,
    resource?: ResourceType,
    cardType?: CardType,
    isBuying?: boolean,
    include?: (card: IProjectCard) => boolean,
  }
}
