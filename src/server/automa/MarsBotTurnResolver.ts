// Stub — real implementation in PR 3
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {DifficultyLevel} from '../../common/automa/AutomaTypes';
import {MarsBotBoard} from './MarsBotBoard';
import {MarsBotTilePlacer} from './MarsBotTilePlacer';
import {IMilestone} from '../milestones/IMilestone';
import {IAward} from '../awards/IAward';
import type {MarsBot} from './MarsBot';

export class MarsBotTurnResolver {
  public readonly tilePlacer: MarsBotTilePlacer;
  public marsBotManager: MarsBot | undefined;
  public readonly board: MarsBotBoard;
  public mcSupply: number = 0;

  constructor(
    game: IGame, marsBot: IPlayer, humanPlayer: IPlayer,
    public readonly _board: MarsBotBoard,
    _difficulty: DifficultyLevel, _mcSupply?: number,
    tilePlacer?: MarsBotTilePlacer,
  ) {
    this.board = _board;
    this.tilePlacer = tilePlacer ?? new MarsBotTilePlacer(game, marsBot, humanPlayer);
  }

  resolveProjectCard(_card: IProjectCard): void {}
  advanceTrackPublic(_trackIndex: number): void {}
  placeGreenery(): void {}
  placeOcean(): void {}
  placeCity(): void {}
  getMarsBotAwardValue(_award: IAward): number { return 0; }
  marsBotMeetsMilestone(_milestone: IMilestone): boolean { return false; }
}
