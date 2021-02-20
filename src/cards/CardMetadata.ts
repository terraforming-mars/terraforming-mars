import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';

export interface CardMetadata {
  cardNumber: string;
  description?: string | ICardRenderDescription;
  renderData?: CardRenderer;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
}
