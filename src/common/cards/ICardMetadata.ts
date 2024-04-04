import {ICardRenderDynamicVictoryPoints} from './render/ICardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardComponent} from './render/CardComponent';

// TODO(kberg): make type CardMetadata.
export interface ICardMetadata {
  cardNumber?: string;
  /* When true, there's external text on the wiki. Render the card so it leads there. */
  hasExternalHelp?: true;
  description?: string | ICardRenderDescription;
  renderData?: CardComponent;
  victoryPoints?: number | ICardRenderDynamicVictoryPoints;
}
