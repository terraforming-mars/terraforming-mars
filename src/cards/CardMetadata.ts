import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardRequirements} from './CardRequirements';

export interface CardMetadata {
  cardNumber: string;
  description?: string | ICardRenderDescription;
  requirements?: CardRequirements;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
  renderData?: CardRenderer;
}
