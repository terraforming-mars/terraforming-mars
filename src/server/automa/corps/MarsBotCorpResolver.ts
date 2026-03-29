// Stub — real implementation in PR 7
import {IMarsBotCorp} from '../../../common/automa/MarsBotCorpTypes';
import {CardName} from '../../../common/cards/CardName';
import {Random} from '../../../common/utils/Random';
import type {MarsBot} from '../MarsBot';

export class MarsBotCorpResolver {
  public static selectCorp(_humanCorpName: CardName, _rng: Random): IMarsBotCorp | undefined { return undefined; }
  public static setupCorp(_corp: IMarsBotCorp, _marsBot: MarsBot): void {}
  public static onTrackAdvanced(_marsBot: MarsBot, _trackIndex: number, _position: number): void {}
  public static resolvePerGenEffect(_corp: IMarsBotCorp, _marsBot: MarsBot): void {}
}
