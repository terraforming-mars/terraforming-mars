import {CardName} from '../../../common/cards/CardName';
import {IMarsBotCorp} from '../MarsBotCorpTypes';

const ALL_MARSBOT_CORPS: Map<CardName, IMarsBotCorp> = new Map();

export function registerMarsBotCorp(corp: IMarsBotCorp): void {
  if (ALL_MARSBOT_CORPS.has(corp.name)) {
    throw new Error(`MarsBot corp ${corp.name} is already registered`);
  }
  ALL_MARSBOT_CORPS.set(corp.name, corp);
}

export function getMarsBotCorp(name: CardName): IMarsBotCorp | undefined {
  return ALL_MARSBOT_CORPS.get(name);
}

export function getAllMarsBotCorps(): ReadonlyArray<IMarsBotCorp> {
  return Array.from(ALL_MARSBOT_CORPS.values());
}

export function clearMarsBotCorpRegistry(): void {
  ALL_MARSBOT_CORPS.clear();
}
