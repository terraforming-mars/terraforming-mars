// Stub — real implementation in PR 4
import {Random} from '../../common/utils/Random';
import {MarsBotBonusCard} from './MarsBotBonusCard';
export class MarsBotBonusDeck {
  public drawPile: MarsBotBonusCard[] = [];
  public discardPile: MarsBotBonusCard[] = [];
  static createBase(_random: Random): MarsBotBonusDeck { return new MarsBotBonusDeck(); }
  draw(): MarsBotBonusCard | undefined { return undefined; }
  discard(_card: MarsBotBonusCard): void {}
  findAndRemove(_id: string): MarsBotBonusCard | undefined { return undefined; }
  removeById(_id: string): void {}
}
