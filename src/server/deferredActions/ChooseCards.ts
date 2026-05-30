import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {SelectCard} from '../inputs/SelectCard';
import {SelectPaymentDeferred} from './SelectPaymentDeferred';
import {LogHelper} from '../LogHelper';
import {oneWayDifference} from '../../common/utils/utils';
import {message} from '../logs/MessageBuilder';
import {Message} from '../../common/logs/Message';

export const LogType = {
  DREW: 'drew',
  BOUGHT: 'bought',
  DREW_VERBOSE: 'drew_verbose',
  BOUGHT_VERBOSE: 'bought_verbose',
} as const;
export type LogType = typeof LogType[keyof typeof LogType];

export type ChooseOptions = {
  keepMax?: number,
  logDrawnCard?: boolean,
  paying?: boolean,
  /** When true (and paying), log the bought cards publicly by name instead of just the count. */
  logBoughtCards?: boolean,
}

export class ChooseCards extends DeferredAction {
  public constructor(
    player: IPlayer,
    public cards: ReadonlyArray<IProjectCard>,
    public options: ChooseOptions = {},
  ) {
    super(player, Priority.DRAW_CARDS);
  }

  public execute() {
    const {options, cards, player} = this;

    let max = options.keepMax || cards.length;
    let msg: string | Message = message('Select ${0} card(s) to keep', (b) => b.number(max));
    if (options.paying) {
      const spendableMegacredits = this.player.spendableMegacredits();
      const affordableCards = Math.floor(spendableMegacredits / this.player.cardCost);
      max = Math.min(max, affordableCards);
      if (max === 0) {
        msg = 'You cannot afford any cards';
      } else if (max < this.cards.length) {
        // We're being offered more cards than we're able to buy
        // So we should be specific on maximum number of cards
        msg = message('Select up to ${0} card(s) to buy', (b) => b.number(max));
      } else {
        msg = 'Select card(s) to buy';
      }
    }

    const min = options.paying ? 0 : options.keepMax;

    const button = max === 0 ? 'Ok' : (options.paying ? 'Buy' : 'Select');
    return new SelectCard(msg, button, cards, {max, min, played: !options.paying})
      .andThen((selected) => {
        if (selected.length > max) {
          throw new Error('Selected too many cards');
        }
        const unselected = oneWayDifference(cards, selected);
        if (options.logDrawnCard === true) {
          LogHelper.logRevealedCards(player, cards);
        }
        const boughtLogType = options.logBoughtCards === true ? LogType.BOUGHT_VERBOSE : LogType.BOUGHT;
        if (options.paying && selected.length > 0) {
          const cost = selected.length * player.cardCost;
          player.game.defer(
            new SelectPaymentDeferred(
              player,
              cost,
              {title: message('Select how to spend ${0} M€ for ${1} cards', (b) => b.number(cost).number(selected.length))})
              .andThen(() => keep(player, selected, unselected, boughtLogType)));
        } else {
          keep(player, selected, unselected, options.paying ? boughtLogType : LogType.DREW);
        }
        return undefined;
      });
  }
}

export function keep(player: IPlayer, cards: ReadonlyArray<IProjectCard>, discards: ReadonlyArray<IProjectCard>, logType: LogType = LogType.DREW): void {
  player.cardsInHand.push(...cards);
  player.game.projectDeck.discard(...discards);

  switch (logType) {
  case LogType.DREW_VERBOSE:
    LogHelper.logDrawnCards(player, cards);
    break;
  case LogType.BOUGHT_VERBOSE:
    if (cards.length === 0) {
      player.game.log('${0} bought no cards', (b) => b.player(player));
    } else {
      player.game.log('${0} bought ${1}', (b) => b.player(player).cards(cards));
    }
    break;
  case LogType.DREW:
  case LogType.BOUGHT:
    player.game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(logType).number(cards.length));
    if (logType === LogType.BOUGHT) {
      if (cards.length > 0) {
        player.game.log('You bought ${0}', (b) => b.cards(cards), {reservedFor: player});
      }
    } else {
      LogHelper.logDrawnCards(player, cards, /* privateMessage */ true);
    }
    break;
  }
}
