import {LogMessageDataType} from './LogMessageDataType';

export type LogMessageDataAttrs = {
  /** When true for a card, also show the card's tags */
  tags?: boolean,
  /** When true for a card, also show the card's cost */
  cost?: boolean,
}

export type LogMessageData = {
  type: LogMessageDataType;
  value: string;
  attrs?: LogMessageDataAttrs;
}
