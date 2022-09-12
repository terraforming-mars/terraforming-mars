import {CardName} from '../../common/cards/CardName';

export type SerializedDeck = {
  drawPile: Array<CardName>;
  discards: Array<CardName>;
}
