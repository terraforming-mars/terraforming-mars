// Stub — real implementation in PR 7
import type {MarsBot} from '../MarsBot';
import {IMarsBotCorp} from '../../../common/automa/MarsBotCorpTypes';
export class MarsBotCorpResolver {
  static setupCorp(_corp: IMarsBotCorp, _marsBot: MarsBot): void {}
  static onTrackAdvanced(_marsBot: MarsBot, _trackNum: number, _position: number): void {}
}
