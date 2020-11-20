import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderVictoryPoints} from './render/CardRenderVictoryPoints';
import {CardRequirements} from './CardRequirements';

export interface CardMetadata {
  cardNumber: string;
  description?: string;
  requirements?: CardRequirements;
  victoryPoints?: number | CardRenderVictoryPoints;
  renderData?: CardRenderer;
}
