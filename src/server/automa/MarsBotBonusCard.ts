// Stub — real implementation in PR 4
import {BonusCardId} from '../../common/automa/AutomaTypes';
export interface MarsBotBonusCard { id: BonusCardId; name: string; destroyed: boolean; }
export function createCorpBonusCard(_id: BonusCardId): MarsBotBonusCard | undefined { return undefined; }
export const CORP_BONUS_CARD_NAMES: Map<BonusCardId, string> = new Map();
