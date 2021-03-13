import {Player} from '../Player';
import {Tags} from '../cards/Tags';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';
import {CardType} from '../cards/CardType';
import {SelectHowToPayDeferred} from './SelectHowToPayDeferred';
import {LogHelper} from '../LogHelper';

// <T> is the return value type
export class DrawCards<T extends undefined | SelectCard<IProjectCard>> implements DeferredAction {
  public priority = Priority.DRAW_CARDS;
  private constructor(
    public player: Player,
    public count: number = 1,
    public options: DrawCards.AllOptions = {},
    public cb: (cards: Array<IProjectCard>) => T,
  ) { }

  public execute() : T {
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

  public static keepAll(player: Player, count: number = 1, options?: DrawCards.DrawOptions): DrawCards<undefined> {
    return new DrawCards(player, count, options, (cards) =>
      DrawCards.keep(player, cards, options === undefined ? DrawCards.LogType.DREW : DrawCards.LogType.DREW_VERBOSE));
  }

  public static keepSome(player: Player, count: number = 1, options: DrawCards.AllOptions): DrawCards<SelectCard<IProjectCard>> {
    return new DrawCards(player, count, options, (cards) => DrawCards.choose(player, cards, options));
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
    keepMax?: number,
    logDrawnCard?: boolean,
    paying?: boolean,
  }

  export enum LogType {
    DREW='drew',
    BOUGHT='bought',
    DREW_VERBOSE='drew_verbose',
  }

  export interface AllOptions extends DrawOptions, ChooseOptions { }

  export function keep(player: Player, cards: Array<IProjectCard>, logType: LogType = LogType.DREW): undefined {
    player.cardsInHand.push(...cards);
    if (logType === LogType.DREW_VERBOSE) {
      LogHelper.logDrawnCards(player, cards);
    } else {
      LogHelper.logCardChange(player, logType, cards.length);
    }
    return undefined;
  }

  export function discard(player: Player, preserve: Array<IProjectCard>, discard: Array<IProjectCard>) {
    discard.forEach((card) => {
      if (preserve.find((f) => f.name === card.name) === undefined) {
        player.game.dealer.discard(card);
      }
    });
  }

  export function choose(player: Player, cards: Array<IProjectCard>, options: DrawCards.ChooseOptions): SelectCard<IProjectCard> {
    let max = options.keepMax || cards.length;
    if (options.paying) {
      max = Math.min(max, Math.floor(player.spendableMegacredits() / player.cardCost));
    }
    const min = options.paying ? 0 : options.keepMax;
    const msg = options.paying ? (max === 0 ? 'You cannot afford any cards' : 'Select card(s) to buy') :
      `Select ${max} card(s) to keep`;
    const button = max === 0 ? 'Oh' : (options.paying ? 'Buy' : 'Select');
    const cb = (selected: Array<IProjectCard>) => {
      if (options.paying && selected.length > 0) {
        player.game.defer(
          new SelectHowToPayDeferred(player, selected.length * player.cardCost, {
            title: 'Select how to pay for cards',
            afterPay: () => {
              keep(player, selected, DrawCards.LogType.BOUGHT);
              discard(player, selected, cards);
            },
          }));
      } else if (options.logDrawnCard === true) {
        keep(player, selected, DrawCards.LogType.DREW_VERBOSE);
        discard(player, selected, cards);
      } else {
        keep(player, selected, options.paying ? DrawCards.LogType.BOUGHT : DrawCards.LogType.DREW);
        discard(player, selected, cards);
      }
      return undefined;
    };
    return new SelectCard(
      msg,
      button,
      cards,
      cb,
      max,
      min,
      false,
      undefined,
      false,
    );
  }
}
