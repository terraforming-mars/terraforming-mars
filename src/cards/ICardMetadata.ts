import {CardRenderer} from './render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from '../common/cards/render/ICardRenderDescription';

export interface ICardMetadata {
  cardNumber: string;
  description?: string | ICardRenderDescription;
  renderData?: CardRenderer;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
}
