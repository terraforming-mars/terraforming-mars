import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectCard} from '../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {CardType} from '../../common/cards/CardType';
import {SelectPaymentDeferred} from './SelectPaymentDeferred';
import {LogHelper} from '../LogHelper';

enum LogType {
  DREW = 'drew',
  BOUGHT = 'bought',
  DREW_VERBOSE = 'drew_verbose',
}

export class DrawCards<T extends undefined | SelectCard<IProjectCard>> extends DeferredAction {
  private constructor(
    player: IPlayer,
    public count: number = 1,
    public options: DrawCards.AllOptions = {},
    public cb: (cards: Array<IProjectCard>) => T,
  ) {
    super(player, Priority.DRAW_CARDS);
  }

  public execute() : T {
    this.player.game.resettable = false;
    const game = this.player.game;
    const cards = game.projectDeck.drawByCondition(game, this.count, (card) => {
      if (this.options.resource !== undefined && this.options.resource !== card.resourceType) {
        return false;
      }
      if (this.options.cardType !== undefined && this.options.cardType !== card.type) {
        return false;
      }
      if (this.options.tag !== undefined && !this.player.tags.cardHasTag(card, this.options.tag)) {
        return false;
      }
      if (this.options.include !== undefined && !this.options.include(card)) {
        return false;
      }
      return true;
    });

    return this.cb(cards);
  }

  public static keepAll(player: IPlayer, count: number = 1, options?: DrawCards.DrawOptions): DrawCards<undefined> {
    return new DrawCards(player, count, options, (cards) => {
      let verbosity: LogType = LogType.DREW;
      if (options !== undefined) {
        if (options.tag !== undefined ||
          options.resource !== undefined ||
          options.cardType !== undefined ||
          options.include !== undefined) {
          verbosity = LogType.DREW_VERBOSE;
        }
      }
      return DrawCards.keep(player, cards, verbosity);
    });
  }

  public static keepSome(player: IPlayer, count: number = 1, options: DrawCards.AllOptions): DrawCards<SelectCard<IProjectCard>> {
    return new DrawCards(player, count, options, (cards) => DrawCards.choose(player, cards, options));
  }

  public static keep(player: IPlayer, cards: Array<IProjectCard>, logType: LogType = LogType.DREW): undefined {
    player.cardsInHand.push(...cards);
    if (logType === LogType.DREW_VERBOSE) {
      LogHelper.logDrawnCards(player, cards);
    } else {
      player.game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(logType).number(cards.length));
      LogHelper.logDrawnCards(player, cards, /* privateMessage */ true);
    }
    return undefined;
  }

  public static discard(player: IPlayer, preserve: Array<IProjectCard>, discard: Array<IProjectCard>) {
    discard.forEach((card) => {
      if (preserve.find((f) => f.name === card.name) === undefined) {
        player.game.projectDeck.discard(card);
      }
    });
  }

  public static choose(player: IPlayer, cards: Array<IProjectCard>, options: DrawCards.ChooseOptions): SelectCard<IProjectCard> {
    let max = options.keepMax || cards.length;
    let msg = '';
    if (options.paying) {
      const spendableMegacredits = player.spendableMegacredits();
      const affordableCards = Math.floor(spendableMegacredits / player.cardCost);
      max = Math.min(max, affordableCards);
      if (max === 0) {
        msg = 'You cannot afford any cards';
      } else if (max < cards.length) {
        // We're being offered more cards than we're able to buy
        // So we should be specific on maximum number of cards
        msg = `Select up to ${max} card(s) to buy`;
      } else {
        msg = 'Select card(s) to buy';
      }
    } else {
      msg = `Select ${max} card(s) to keep`;
    }
    const min = options.paying ? 0 : options.keepMax;

    const button = max === 0 ? 'Ok' : (options.paying ? 'Buy' : 'Select');
    const cb = (selected: Array<IProjectCard>) => {
      if (selected.length > max) {
        throw new Error('Selected too many cards');
      }
      if (options.paying && selected.length > 0) {
        const cost = selected.length * player.cardCost;
        player.game.defer(
          new SelectPaymentDeferred(player, cost, {
            title: `Select how to spend ${cost} M€ for ${selected.length} cards`,
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
      {max, min},
    );
  }
}

export namespace DrawCards {
  export interface DrawOptions {
    tag?: Tag,
    resource?: CardResource,
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
