import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectCard} from '../inputs/SelectCard';
import {SelectPaymentDeferred} from './SelectPaymentDeferred';
import {LogHelper} from '../LogHelper';
import {oneWayDifference} from '../../common/utils/utils';
import {message} from '../logs/MessageBuilder';

export enum LogType {
  DREW = 'drew',
  BOUGHT = 'bought',
  DREW_VERBOSE = 'drew_verbose',
}

export type ChooseOptions = {
  keepMax?: number,
  logDrawnCard?: boolean,
  paying?: boolean,
}

export class ChooseCards extends DeferredAction {
  public constructor(
    player: IPlayer,
    public cards: Array<IProjectCard>,
    public options: ChooseOptions = {},
  ) {
    super(player, Priority.DRAW_CARDS);
  }

  public execute() {
    const options = this.options;
    const cards = this.cards;
    const player = this.player;

    let max = options.keepMax || cards.length;
    let msg = '';
    if (options.paying) {
      const spendableMegacredits = this.player.spendableMegacredits();
      const affordableCards = Math.floor(spendableMegacredits / this.player.cardCost);
      max = Math.min(max, affordableCards);
      if (max === 0) {
        msg = 'You cannot afford any cards';
      } else if (max < this.cards.length) {
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
      const unselected = oneWayDifference(cards, selected);
      if (options.paying && selected.length > 0) {
        const cost = selected.length * player.cardCost;
        player.game.defer(
          new SelectPaymentDeferred(
            player,
            cost,
            {title: message('Select how to spend ${0} M€ for ${1} cards', (b) => b.number(cost).number(selected.length))})
            .andThen(() => keep(player, selected, unselected, LogType.BOUGHT)));
      } else if (options.logDrawnCard === true) {
        keep(player, selected, unselected, LogType.DREW_VERBOSE);
      } else {
        keep(player, selected, unselected, options.paying ? LogType.BOUGHT : LogType.DREW);
      }
      return undefined;
    };
    return new SelectCard(msg, button, cards, {max, min}).andThen(cb);
  }
}

export function keep(player: IPlayer, cards: ReadonlyArray<IProjectCard>, discards: ReadonlyArray<IProjectCard>, logType: LogType = LogType.DREW): void {
  player.cardsInHand.push(...cards);
  player.game.projectDeck.discard(...discards);

  if (logType === LogType.DREW_VERBOSE) {
    LogHelper.logDrawnCards(player, cards);
  } else {
    player.game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(logType).number(cards.length));
    LogHelper.logDrawnCards(player, cards, /* privateMessage */ true);
  }
}
