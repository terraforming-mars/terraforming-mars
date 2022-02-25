import {ICardRenderDynamicVictoryPoints} from './render/ICardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardComponent} from './render/CardComponent';

export interface ICardMetadata {
  cardNumber: string;
  description?: string | ICardRenderDescription;
  renderData?: CardComponent;
  victoryPoints?: number | ICardRenderDynamicVictoryPoints;
}
