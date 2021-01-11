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
  private constructor(
    public player: Player,
    public count: number = 1,
    public options: DrawCards.DrawOptions = {},
    public cb: (cards: Array<IProjectCard>) => undefined | SelectCard<IProjectCard>,
  ) { }

  public execute() {
    if (this.count <= 0) return undefined;

    const game = this.player.game;
    const cards = game.dealer.drawProjectCardsByCondition(game, this.count, (card) => {
      if (this.options.resource !== undefined && this.options.resource !== card.resourceType) {
        return false;
      }
      if (this.options.cardType !== undefined && this.options.cardType !== card.cardType) {
        return false;
      }
      if (this.options.tag !== undefined && !card.tags.includes(this.options.tag)) {
        return false;
      }
      if (this.options.include !== undefined && !this.options.include(card)) {
        return false;
      }
      return true;
    });

    return this.cb(cards);
  };

  public static keepAll(
    player: Player,
    count: number = 1,
    options: DrawCards.DrawOptions = {}): DrawCards {
    return new DrawCards(player, count, options, (cards) => DrawCards.keep(player, cards));
  }

  public static keepSome(
    player: Player,
    count: number = 1,
    drawOptions: DrawCards.DrawOptions = {},
    chooseOptions:DrawCards.ChooseOptions = {}): DrawCards {
    return new DrawCards(player, count, drawOptions, (cards) => DrawCards.choose(player, cards, chooseOptions));
  }
}

export namespace DrawCards {
  export interface DrawOptions {
    tag?: Tags,
    resource?: ResourceType,
    cardType?: CardType,
    include?: (card: IProjectCard) => boolean,
  }

  export interface ChooseOptions {
    max?: number,
    paying?: boolean,
  }


  export function keep(player: Player, cards: Array<IProjectCard>): undefined {
    player.cardsInHand.push(...cards);
    LogHelper.logCardChange(player.game, player, 'kept', cards.length);
    return undefined;
  }

  export function discard(player: Player, cards: Array<IProjectCard>, all: Array<IProjectCard>) {
    all.forEach((card) => {
      if (cards.find((f) => f.name === card.name) === undefined) {
        player.game.dealer.discard(card);
      }
    });
  }

  export function choose(player: Player, cards: Array<IProjectCard>, options: DrawCards.ChooseOptions): SelectCard<IProjectCard> {
    // if paying, adjust max accordingly.

    const max = Math.min(options.max || 0, Math.floor(player.spendableMegacredits() / player.cardCost));
    const msg = '';
    const cb = (selected: Array<IProjectCard>) => {
      if (options.paying === true) {
        if (selected.length > 0) {
          player.game.defer(
            new SelectHowToPayDeferred(player, selected.length * player.cardCost, {
              title: 'Select how to pay for cards',
              afterPay: () => {
                keep(player, cards);
                discard(player, selected, cards);
              },
            }));
        }
      } else {
        keep(player, selected);
        discard(player, selected, cards);
      }
      return undefined;
    };
    return new SelectCard(
      msg,
      max === 0 ? 'Ok' : 'Buy',
      cards,
      cb,
      max,
      0);
  }
}
