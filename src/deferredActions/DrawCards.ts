import {Player} from '../Player';
import {Tags} from '../cards/Tags';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';
import {CardType} from '../cards/CardType';
import {SelectHowToPayDeferred} from './SelectHowToPayDeferred';
import {LogHelper} from '../LogHelper';

enum LogType {
  DREW='drew',
  BOUGHT='bought',
  DREW_VERBOSE='drew_verbose',
}

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
      DrawCards.keep(player, cards, options === undefined ? LogType.DREW : LogType.DREW_VERBOSE));
  }

  public static keepSome(player: Player, count: number = 1, options: DrawCards.AllOptions): DrawCards<SelectCard<IProjectCard>> {
    return new DrawCards(player, count, options, (cards) => DrawCards.choose(player, cards, options));
  }

  public static keep(player: Player, cards: Array<IProjectCard>, logType: LogType = LogType.DREW): undefined {
    player.cardsInHand.push(...cards);
    if (logType === LogType.DREW_VERBOSE) {
      LogHelper.logDrawnCards(player, cards);
    } else {
      player.game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(logType).number(cards.length));
      LogHelper.logDrawnCards(player, cards, /* privateMessage */ true);
    }
    return undefined;
  }

  public static discard(player: Player, preserve: Array<IProjectCard>, discard: Array<IProjectCard>) {
    discard.forEach((card) => {
      if (preserve.find((f) => f.name === card.name) === undefined) {
        player.game.dealer.discard(card);
      }
    });
  }

  public static choose(player: Player, cards: Array<IProjectCard>, options: DrawCards.ChooseOptions): SelectCard<IProjectCard> {
    let max = options.keepMax || cards.length;
    if (options.paying) {
      max = Math.min(max, Math.floor(player.spendableMegacredits() / player.cardCost));
    }
    const min = options.paying ? 0 : options.keepMax;
    const msg = options.paying ? (max === 0 ? 'You cannot afford any cards' : 'Select card(s) to buy') :
      `Select ${max} card(s) to keep`;
    const button = max === 0 ? 'Ok' : (options.paying ? 'Buy' : 'Select');
    const cb = (selected: Array<IProjectCard>) => {
      if (options.paying && selected.length > 0) {
        player.game.defer(
          new SelectHowToPayDeferred(player, selected.length * player.cardCost, {
            title: 'Select how to pay for cards',
            afterPay: () => {
              this.keep(player, selected, LogType.BOUGHT);
              this.discard(player, selected, cards);
            },
          }));
      } else if (options.logDrawnCard === true) {
        this.keep(player, selected, LogType.DREW_VERBOSE);
        this.discard(player, selected, cards);
      } else {
        this.keep(player, selected, options.paying ? LogType.BOUGHT : LogType.DREW);
        this.discard(player, selected, cards);
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

  export interface AllOptions extends DrawOptions, ChooseOptions { }
}
