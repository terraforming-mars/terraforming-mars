import {CardName} from '../../../common/cards/CardName';
import {IMarsBotCorp} from '../MarsBotCorpTypes';
import {ALL_AUTOMA_MANIFESTS} from './AllAutomaManifests';

const INITIAL_CORPS: Partial<Record<CardName, IMarsBotCorp>> = {};
for (const manifest of ALL_AUTOMA_MANIFESTS) {
  Object.assign(INITIAL_CORPS, manifest.corps);
}

let ALL_MARSBOT_CORPS: Partial<Record<CardName, IMarsBotCorp>> = {...INITIAL_CORPS};

export function getMarsBotCorp(name: CardName): IMarsBotCorp | undefined {
  return ALL_MARSBOT_CORPS[name];
}

export function getAllMarsBotCorps(): ReadonlyArray<IMarsBotCorp> {
  return Object.values(ALL_MARSBOT_CORPS) as ReadonlyArray<IMarsBotCorp>;
}

// Test helpers
export function clearMarsBotCorpRegistry(): void {
  ALL_MARSBOT_CORPS = {};
}

export function restoreMarsBotCorpRegistry(): void {
  ALL_MARSBOT_CORPS = {...INITIAL_CORPS};
}

export function registerMarsBotCorp(corp: IMarsBotCorp): void {
  ALL_MARSBOT_CORPS[corp.name] = corp;
}
