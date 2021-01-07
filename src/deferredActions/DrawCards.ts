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
        public options: DrawCards.Options = {amount: 1},
  ) { }

  public static cardString(amount: number) {
    return `${amount} card${amount === 1 ? '' : 's'}`;
  }

  private selected(selected: Array<IProjectCard>, from: Array<IProjectCard>) {
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

  private selectCardsToDraw(cards: Array<IProjectCard>) {
    return new SelectCard(
      `Select ${DrawCards.cardString(this.options.amount)} to keep`,
      'Select',
      cards,
      (selected: Array<IProjectCard>) => {
        selected = selected.slice(0, this.options.amount);
        this.selected(selected, cards);
        this.log(cards);
        return undefined;
      }, this.options.amount, this.options.amount,
    );
  }

  private selectCardsToBuy(cards: Array<IProjectCard>) {
    return new SelectCard(
      `Select at most ${DrawCards.cardString(this.options.amount)} to buy`,
      'Buy',
      cards,
      (selected: Array<IProjectCard>) => {
        selected = selected.slice(0, this.options.amount);
        this.selected(selected, cards);
        if (selected.length > 0) {
          this.game.defer(new SelectHowToPayDeferred(
            this.player, selected.length * this.player.cardCost,
            false, false, 'Select how to pay for action'));
        }
        this.game.log('${0} bought ${1}', (b) => b
          .player(this.player)
          .string(DrawCards.cardString(this.options.amount)));
        return undefined;
      }, this.options.amount, 0,
    );
  }

  private get specialRequirements(): boolean {
    return !!(this.options.include || this.options.tag || this.options.resource || this.options.cardType);
  }

  public execute() {
    const total = this.options.from || this.options.amount;
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
      return this.selectCardsToDraw(cards);
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

