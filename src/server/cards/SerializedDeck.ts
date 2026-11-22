import {CardName} from '../../common/cards/CardName';

export type SerializedDeck<N extends string = CardName> = {
  drawPile: Array<N>;
  discardPile: Array<N>;
}
