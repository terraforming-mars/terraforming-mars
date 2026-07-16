import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardComponent} from './render/CardComponent';

export type CardMetadata = {
  /**
   * The card's number. It's not used. it used to be shown, but now it isn't.
   *
   * It could be rendered on the card again, or used as part of card search.
   */
  cardNumber?: string;
  /* When true, there's external text on the wiki. Render the card so it leads there. */
  hasExternalHelp?: true;
  description?: string | ICardRenderDescription;
  renderData?: CardComponent;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
}
