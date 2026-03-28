// Stub — real implementation in PR 5
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {DifficultyLevel} from '../../common/automa/AutomaTypes';
import {MarsBotTurnResolver} from './MarsBotTurnResolver';
import {Space} from '../boards/Space';
export interface MarsBotVPBreakdown {
  terraformRating: number; milestones: number; awards: number;
  greenery: number; cityAdjacentGreenery: number; neuralInstance: number;
  mcToVP: number; cardVP: number; total: number;
}
export class MarsBotScoring {
  constructor(_game: IGame, _marsBot: IPlayer, _humanPlayer: IPlayer, _turnResolver: MarsBotTurnResolver, _difficulty: DifficultyLevel, _neuralInstanceSpace: Space | undefined, _playedProjectCards: IProjectCard[], _corpVpBonus: number) {}
  calculate(): MarsBotVPBreakdown { return {terraformRating: 0, milestones: 0, awards: 0, greenery: 0, cityAdjacentGreenery: 0, neuralInstance: 0, mcToVP: 0, cardVP: 0, total: 0}; }
  isInstantWin(): boolean { return false; }
}
