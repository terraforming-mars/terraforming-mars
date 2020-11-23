import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {CardRequirements} from './CardRequirements';

export interface CardMetadata {
  cardNumber: string;
  description?: string;
  requirements?: CardRequirements;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
  renderData?: CardRenderer;
}
