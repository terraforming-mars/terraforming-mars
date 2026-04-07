// Stub — real implementation in PR 4
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {MarsBotBonusCard} from './MarsBotBonusCard';
import {MarsBotBonusDeck} from './MarsBotBonusDeck';
import {MarsBotTilePlacer} from './MarsBotTilePlacer';
import {MarsBotTurnResolver} from './MarsBotTurnResolver';
import {Space} from '../boards/Space';

export class MarsBotBonusResolver {
  public onNeuralInstancePlaced: ((space: Space) => void) | undefined;

  constructor(
    _game: IGame, _marsBot: IPlayer, _humanPlayer: IPlayer,
    _turnResolver: MarsBotTurnResolver, _bonusDeck: MarsBotBonusDeck,
    _tilePlacer: MarsBotTilePlacer,
  ) {}

  resolve(_card: MarsBotBonusCard): void {}
}
