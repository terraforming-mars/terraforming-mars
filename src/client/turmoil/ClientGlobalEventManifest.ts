import {ALL_EVENTS} from '@/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventModel} from '@/common/models/TurmoilModel';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IClientGlobalEvent} from '@/common/turmoil/IClientGlobalEvent';
// @ts-ignore events.json doesn't exist during npm run build
import * as eventJson from '@/genfiles/events.json';
import {getPreferences} from '../utils/PreferencesManager';

const events: Map<GlobalEventName, IClientGlobalEvent> = new Map();
if (getPreferences().experimental_ui) {
  (eventJson as any as Array<IClientGlobalEvent>).forEach((card) => {
    events.set(card.name, card);
  });
}

export function allGlobalEventNames() {
  if (getPreferences().experimental_ui) {
    return events.keys();
  } else {
    return ALL_EVENTS.keys();
  }
}

export function getGlobalEvent(globalEventName: GlobalEventName): IClientGlobalEvent | undefined {
  if (getPreferences().experimental_ui) {
    return events.get(globalEventName);
  } else {
    const Factory = ALL_EVENTS.get(globalEventName);
    if (Factory !== undefined) return new Factory();
    return undefined;
  }
}

export function getGlobalEventModel(globalEventName: GlobalEventName): GlobalEventModel {
  const globalEvent = getGlobalEvent(globalEventName);
  if (globalEvent) {
    return {
      name: globalEvent.name,
      description: globalEvent.description,
      revealed: globalEvent.revealedDelegate,
      current: globalEvent.currentDelegate,
    };
  }
  return {
    name: globalEventName,
    description: 'global event not found',
    revealed: PartyName.GREENS,
    current: PartyName.GREENS,
  };
}
