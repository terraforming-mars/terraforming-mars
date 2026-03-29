// Stub — real implementation in PR 7
import {MarsBotCorpId, IMarsBotCorp} from '../../../common/automa/MarsBotCorpTypes';

export function registerMarsBotCorp(_corp: IMarsBotCorp): void {}
export function getMarsBotCorp(_id: string): IMarsBotCorp | undefined { return undefined; }
export function getAllMarsBotCorps(): ReadonlyArray<IMarsBotCorp> { return []; }
export function clearMarsBotCorpRegistry(): void {}
