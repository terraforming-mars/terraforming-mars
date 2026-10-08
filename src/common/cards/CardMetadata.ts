import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {CardRenderDescription} from './render/CardRenderDescription';
import {CardComponent} from './render/CardComponent';

export type CardMetadata = {
  /**
   * The card's number. It's not used. it used to be shown, but now it isn't.
   *
   * It could be rendered on the card again, or used as part of card search.
   */
  cardNumber?: string;
  description?: string | CardRenderDescription;
  renderData?: CardComponent;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
  /** Extended rules explanation, in Markdown, shown in the card's help popup. */
  helpText?: string;
}
